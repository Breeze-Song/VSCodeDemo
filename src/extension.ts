import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { exec, ChildProcess } from 'child_process';

let flaskProcess: ChildProcess | undefined;

export function activate(context: vscode.ExtensionContext) {
    // 注册Webview视图提供者
    const provider = new TestDemoViewProvider(context.extensionUri);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider('testdemo', provider)
    );

    // 启动Flask服务器
    const serverPath = path.join(__dirname, '..','src','media', 'views', 'server.py');
    flaskProcess = exec(`python ${serverPath}`, (error) => {
        if (error) {
            vscode.window.showErrorMessage(`启动Flask失败: ${error}`);
        }
    });

    // 确保扩展停用时终止进程
    context.subscriptions.push({
        dispose: () => {
            if (flaskProcess) {
                flaskProcess.kill();
                flaskProcess = undefined;
            }
        }
    });

}

// This method is called when your extension is deactivated
export function deactivate() {
    if (flaskProcess) {
        flaskProcess.kill();
        flaskProcess = undefined;
    }
}

class TestDemoViewProvider implements vscode.WebviewViewProvider {
    constructor(private readonly _extensionUri: vscode.Uri) { }
    // 获取外部 HTML 内容
    private _getHtmlContent(webview: vscode.Webview): string {
        // 1. 获取 HTML 文件路径
        const htmlPath = path.join(this._extensionUri.fsPath, 'src','media', 'views', 'demo.html');
        // 2. 读取 HTML 文件内容
        let htmlContent = fs.readFileSync(htmlPath, 'utf-8');
        // 3. 替换资源路径为 Webview 可访问的 URI
        const resourceUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, 'src','media')
        );
        return htmlContent
            .replace(/href="styles.css"/g, `href="${resourceUri}/views/styles.css"`)
            .replace(/src="script.js"/g, `src="${resourceUri}/views/script.js"`);
    }
    public resolveWebviewView(webviewView: vscode.WebviewView) {

        webviewView.webview.html = this._getHtmlContent(webviewView.webview);
        // 配置Webview选项
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };

        // 处理来自Webview的消息
        webviewView.webview.onDidReceiveMessage(message => {
            if (message.command === 'externalButtonClick') {
                vscode.window.showInformationMessage('按钮被点击了！');
            }
        });
    }
}