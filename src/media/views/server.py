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
        initialdir=Path(__file__).parent.parent.parent.parent  # 初始路径设为当前工作目录
    )
    root.destroy()
    return jsonify({'result': folder_path + '/'})

import subprocess
import sys
import os
from pathlib import Path
from flask import Response
@app.route('/run', methods=['POST'])
def run():
    data = request.get_json()
    input_dir = data.get('input_dir')
    output_dir = data.get('output_dir')
    linux_dir = data.get('linux_dir')
    bindgen_dir = data.get('bindgen_dir')
    llms = data.get('llms')
    # 获取当前项目的绝对路径
    project_root = Path(__file__).parent.parent.parent.parent  # 根据实际情况调整层级
    script_path = os.path.join(project_root, "Linux_Rust", "run.py")  # 构建 app.py 的完整路径\
    root_path = os.path.join(project_root, "Linux_Rust")

    # 构造命令行参数
    args = [
        "-i", input_dir,
        "-o", output_dir,
        "-l", linux_dir,
        "-b", bindgen_dir,
        "-e",'10',
        "-g",'3',
        "-m",llms,
    ]
    #本地python环境
    python_path = "D:/Programs/anaconda3/envs/C2Rust/python.exe" 

    #启动子进程并合并stderr到stdout
    proc = subprocess.Popen(
        [python_path,"-u", script_path] + args,
        cwd=root_path,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,  # 将标准错误合并到标准输出
        text=True,
        bufsize=1,                # 行缓冲模式
        universal_newlines=True
    )

    #SSE格式 
    def generate():
        # 实时流式读取输出
        while proc.poll() is None:  # 当进程未结束时循环
            line = proc.stdout.readline()
            if line:
                # 使用SSE格式发送数据（可选）
                yield f"data: {line}\n\n"
        
        # 读取进程结束后的剩余输出
        for line in proc.stdout:
            yield f"data: {line}\n\n"
        
        # 返回最终状态码
        yield f"data: PROCESS_EXIT_CODE:{proc.returncode}\n\n"

    # 返回流式响应
    return Response(
        generate(),
        mimetype="text/event-stream",  # 使用Server-Sent Events格式
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no"  # 禁用Nginx缓冲
        }
    )

if __name__ == '__main__':
    app.run(port=5000)