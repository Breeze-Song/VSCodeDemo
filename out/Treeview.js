"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileItem = exports.FileExplorerProvider = void 0;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
// TreeDataProvider实现
class FileExplorerProvider {
    _onDidChangeTreeData = new vscode.EventEmitter();
    onDidChangeTreeData = this._onDidChangeTreeData.event;
    rootUri;
    // 刷新TreeView
    refresh() {
        this._onDidChangeTreeData.fire(undefined);
    }
    getTreeItem(element) {
        return element;
    }
    async getChildren(element) {
        if (!element) {
            // 根节点：显示所选文件夹内容
            if (!this.rootUri) {
                return [];
            }
            try {
                const files = await vscode.workspace.fs.readDirectory(this.rootUri);
                return files.map(([name, type]) => {
                    const isDirectory = type === vscode.FileType.Directory;
                    const uri = vscode.Uri.file(path.join(this.rootUri.path, name));
                    return new FileItem(name, uri, isDirectory);
                });
            }
            catch (error) {
                vscode.window.showErrorMessage('无法读取文件夹内容');
                return [];
            }
        }
        else {
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
exports.FileExplorerProvider = FileExplorerProvider;
// TreeItem表示文件或文件夹
class FileItem extends vscode.TreeItem {
    label;
    resourceUri;
    isDirectory;
    constructor(label, resourceUri, isDirectory) {
        super(label, isDirectory ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None);
        this.label = label;
        this.resourceUri = resourceUri;
        this.isDirectory = isDirectory;
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
exports.FileItem = FileItem;
//# sourceMappingURL=Treeview.js.map