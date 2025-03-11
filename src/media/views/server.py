from flask import Flask, request, jsonify
from flask_cors import CORS  # 解决跨域问题

import tkinter as tk
from tkinter import filedialog


app = Flask(__name__)
CORS(app)  # 允许所有域名跨域访问

@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.get_json()
    number = float(data['number'])
    result = number ** 2  # 计算平方
    return jsonify({'result': result})

@app.route('/getfolderpath', methods=['POST'])
def getfolderpath():
    root = tk.Tk()
    root.withdraw()  # 隐藏主窗口
    root.attributes('-topmost', True)  # 设置对话框置顶
    folder_path = filedialog.askdirectory(
        title="选择文件夹",
        initialdir="/"  # 初始路径设为当前工作目录
    )
    root.destroy()
    return jsonify({'result': folder_path})

import subprocess
import sys
import os
from pathlib import Path

@app.route('/run', methods=['POST'])
def run():

    # 获取当前项目的绝对路径
    project_root = Path(__file__).parent  # 根据实际情况调整层级
    script_path = os.path.join(project_root, "app.py")  # 构建 app.py 的完整路径

    # return jsonify({'result':  script_path})
    
    args = [
        "-n", "123",         # 其他参数
        "--verbose"
    ]
    # 启动脚本（使用当前Python解释器）
    result = subprocess.run(
        [sys.executable, script_path] + args,
        capture_output=True,  # 捕获输出
        text=True             # 以文本形式返回结果
    )
    # 检查执行结果
    if result.returncode == 0:
        return jsonify({'result':  result.stdout})
    else:
        return jsonify({'result':  f"执行失败！:{result.stderr}"})
        



if __name__ == '__main__':
    app.run(port=5000)