import * as vscode from 'vscode';
import * as path from 'path';
// TreeDataProvider实现
export class FileExplorerProvider implements vscode.TreeDataProvider<FileItem> {
    private _onDidChangeTreeData = new vscode.EventEmitter<FileItem | undefined>();
    readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

    public rootUri: vscode.Uri | undefined;

    // 刷新TreeView
    refresh(): void {
        this._onDidChangeTreeData.fire(undefined);
    }

    getTreeItem(element: FileItem): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: FileItem): Promise<FileItem[]> {
        if (!element) {
            // 根节点：显示所选文件夹内容
            if (!this.rootUri) {
                return [];
            }
            try {
                const files = await vscode.workspace.fs.readDirectory(this.rootUri);
                return files.map(([name, type]) => {
                    const isDirectory = type === vscode.FileType.Directory;
                    const uri = vscode.Uri.file(path.join(this.rootUri!.path, name));
                    return new FileItem(name, uri, isDirectory);
                });
            } catch (error) {
                vscode.window.showErrorMessage('无法读取文件夹内容');
                return [];
            }
        } else {
            // 子节点：显示子目录内容
            const files = await vscode.workspace.fs.readDirectory(element.resourceUri);
            return files.map(([name, type]) => {
                const isDirectory = type === vscode.FileType.Directory;
                const uri = vscode.Uri.file(path.join(element.resourceUri.path, name));
                return new FileItem(name, uri, isDirectory);
            });
        }
    }
}

// TreeItem表示文件或文件夹
export class FileItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly resourceUri: vscode.Uri,
        public readonly isDirectory: boolean
    ) {
        super(
            label,
            isDirectory ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None
        );
        this.tooltip = resourceUri.path;
        this.iconPath = isDirectory ? vscode.ThemeIcon.Folder : vscode.ThemeIcon.File;
        // 点击文件时在编辑器中打开
        if (!isDirectory) {
            this.command = {
                command: 'vscode.open',
                title: '打开文件',
                arguments: [resourceUri]
            };
        }
    }
}