# VSCode插件开发
## Flask API Server 项目说明
### 项目概述
基于Flask框架构建的RESTful API服务，提供数学计算、文件路径选择和子进程执行功能。

#### 功能特性
数学计算接口 - 计算输入数值的平方
图形化文件夹选择 - 通过系统对话框获取文件夹路径
子进程执行 - 运行指定Python脚本并捕获输出
#### 快速开始
环境要求:
Python 3.9
依赖包：
```bash
pip install flask flask-cors
```
文件结构
```
📦 plugindemo
├── 📂 src
│   ├── 📂 media
│   │   └── 📂 views
│   │       ├── 🐍 server.py       # 主服务入口(5000端口)
│   │       └── 🐍 app.py          # 子进程脚本模板
│   └── 📄 extension.ts           # 插件主程序
└── 📄 README.md                  # 项目文档
```



启动服务(手动)
```bash
python server.py
```
启动服务（F5调试时，自动）-在 src\extension.ts 中
```typescript
export function activate(context: vscode.ExtensionContext) {
    // 启动Flask服务器
    const serverPath = path.join(__dirname, '..','src','media', 'views', 'server.py');
    flaskProcess = exec(`python ${serverPath}`, (error) => {
        if (error) {
            vscode.window.showErrorMessage(`启动Flask失败: ${error}`);
        }
    });
｝
```
