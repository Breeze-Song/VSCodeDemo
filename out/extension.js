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
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const child_process_1 = require("child_process");
const Treeview_1 = require("./Treeview");
let flaskProcess;
function activate(context) {
    // 注册Webview视图提供者
    const provider = new TestDemoViewProvider(context.extensionUri);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider('htmldemo', provider));
    // 启动Flask服务器
    const serverPath = path.join(__dirname, '..', 'src', 'media', 'views', 'server.py');
    flaskProcess = (0, child_process_1.exec)(`python ${serverPath}`, (error) => {
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
function deactivate() {
    if (flaskProcess) {
        flaskProcess.kill();
        flaskProcess = undefined;
    }
}
class TestDemoViewProvider {
    _extensionUri;
    constructor(_extensionUri) {
        this._extensionUri = _extensionUri;
    }
    // 获取外部 HTML 内容
    _getHtmlContent(webview) {
        // 获取 HTML 文件路径
        const htmlPath = path.join(this._extensionUri.fsPath, 'src', 'media', 'views', 'demo.html');
        // 读取 HTML 文件内容
        let htmlContent = fs.readFileSync(htmlPath, 'utf-8');
        // 替换资源路径为 Webview 可访问的 URI
        const resourceUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'src', 'media'));
        return htmlContent
            .replace(/href="styles.css"/g, `href="${resourceUri}/views/styles.css"`)
            .replace(/src="script.js"/g, `src="${resourceUri}/views/script.js"`);
    }
    resolveWebviewView(webviewView) {
        webviewView.webview.html = this._getHtmlContent(webviewView.webview);
        // 配置Webview选项
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };
        console.log("webview 配置完成");
        // 处理来自Webview的消息
        webviewView.webview.onDidReceiveMessage(message => {
            console.log("Received message from webview:\n command:", message.command, "\n text:", message.data);
            if (message.command === 'open_result_dir') {
                // vscode.window.showInformationMessage('按钮被点击了！');
                // 动态创建并注册 TreeDataProvider
                const feProvider = new Treeview_1.FileExplorerProvider();
                vscode.window.registerTreeDataProvider('fileexplorer', feProvider);
                if (message.data === "") {
                    vscode.window.showErrorMessage('请输入正确的路径！');
                    return;
                }
                // 设置根路径
                // feProvider.rootUri = vscode.Uri.file(path.join(message.data));
                const tempDirPath = vscode.Uri.joinPath(this._extensionUri, "temp_result").fsPath;
                try {
                    if (!fs.existsSync(tempDirPath)) {
                        fs.mkdirSync(tempDirPath, { recursive: true });
                        console.log("目录已创建:", tempDirPath);
                    }
                    // 设置文件浏览器根路径
                    feProvider.rootUri = vscode.Uri.file(path.join(tempDirPath));
                }
                catch (error) {
                    vscode.window.showErrorMessage(`创建目录失败: ${error}`);
                    return;
                }
                feProvider.refresh();
                // 动态设置条件，显示 view
                vscode.commands.executeCommand('setContext', 'fileexplorer.enabled', true);
                // 动态显示 panel
                vscode.commands.executeCommand('workbench.view.extension.FILEDIR');
                // 监听文件变化
                // const watcher = vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(message.data, '**/*'));
                const watcher = vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(tempDirPath, '**/*'));
                watcher.onDidChange(() => {
                    feProvider.refresh();
                });
                watcher.onDidCreate(() => {
                    feProvider.refresh();
                });
                watcher.onDidDelete(() => {
                    feProvider.refresh();
                });
            }
        });
    }
}
//# sourceMappingURL=extension.js.map