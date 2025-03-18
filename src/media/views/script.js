const vscode = acquireVsCodeApi();
document.getElementById('actionButton').addEventListener('click', () => {
    vscode.postMessage({
        command: 'externalButtonClick',
        data: '来自外部 HTML 的点击'
    });
});

async function calculateSquare() {
    const number = document.getElementById('inputNumber').value;

    try {
        // 发送请求到后端API
        const response = await fetch('http://localhost:5000/calculate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ number: number })
        });

        const data = await response.json();
        document.getElementById('result').textContent = `结果：${data.result}`;
    } catch (error) {
        console.error('请求失败:', error);
    }
}

async function getfolderpath() {
    try {
        // 发送请求到后端API
        const response = await fetch('http://localhost:5000/getfolderpath', {
            method: 'POST'
        });
        const result = await response.json();
        
        if (response.ok) {
            // document.getElementById('Input Directory').value = response.status;
            document.getElementById('Input Directory').value = result.result;
        } else {
            
        }
    } catch (error) {
        console.error('请求失败:', error);
    }
}

async function getfolderpath_output() {
    try {
        // 发送请求到后端API
        const response = await fetch('http://localhost:5000/getfolderpath', {
            method: 'POST'
        });
        const data = await response.json();
        document.getElementById('Output Directory').value = `${data.result}`;
    } catch (error) {
        console.error('请求失败:', error);
    }
}

async function getfolderpath_Linux() {
    try {
        // 发送请求到后端API
        const response = await fetch('http://localhost:5000/getfolderpath', {
            method: 'POST'
        });
        const data = await response.json();
        document.getElementById('Linux Directory').value = `${data.result}`;
    } catch (error) {
        console.error('请求失败:', error);
    }
}

async function getfolderpath_Bindgen() {
    try {
        // 发送请求到后端API
        const response = await fetch('http://localhost:5000/getfolderpath', {
            method: 'POST'
        });
        const data = await response.json();
        document.getElementById('Bindgen Directory').value = `${data.result}`;
    } catch (error) {
        console.error('请求失败:', error);
    }
}

// async function run() {
//     const inputData = {
//         input_dir: document.getElementById('Input Directory').value,
//         output_dir: document.getElementById('Output Directory').value,
//         linux_dir: document.getElementById('Linux Directory').value,
//         bindgen_dir: document.getElementById('Bindgen Directory').value,
//         llms: document.getElementById('LLMs-select').value
//     };

//     try {
//         // 发送请求到后端API
//         const response = await fetch('http://localhost:5000/run', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(inputData)
//         });
//         const data = await response.json();
//         // 将换行符 \n 替换为 <br> 标签
//         const formattedResult = data.result.replace(/\n/g, '<br>');
//         // document.getElementById('runresult').textContent = `${data.result}`;
//         document.getElementById('runresult').innerHTML = formattedResult;
//     } catch (error) {
//         console.error('请求失败:', error);
//     }
// }

//保留缓冲区
async function run() {
    const inputData = {
        input_dir: document.getElementById('Input Directory').value,
        output_dir: document.getElementById('Output Directory').value,
        linux_dir: document.getElementById('Linux Directory').value,
        bindgen_dir: document.getElementById('Bindgen Directory').value,
        llms: document.getElementById('LLMs-select').value
    };
    // 清空之前的结果
    const outputElement = document.getElementById('runresult');
    outputElement.innerHTML = '';
    
    // try {
    //     const response = await fetch('http://localhost:5000/run', {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify(inputData)
    //     });

    //     const reader = response.body.getReader();
    //     const decoder = new TextDecoder();

    //     while (true) {
    //         const { done, value } = await reader.read();
    //         if (done) break;

    //         // 直接解码当前数据块（不保留未完成部分）
    //         const chunk = decoder.decode(value, { stream: true });
            
    //         // 实时显示原始数据（保留所有字符）
    //         outputElement.innerHTML += chunk
    //             .replace(/\n/g, '<br>')   // 替换换行符
    //             .replace(/\r/g, '');      // 去除回车符

    //         // 保持自动滚动
    //         outputElement.scrollTop = outputElement.scrollHeight;
    //     }

    //     // 最终解码可能残留的缓冲
    //     const finalChunk = decoder.decode();
    //     if (finalChunk) {
    //         outputElement.innerHTML += finalChunk
    //             .replace(/\n/g, '<br>')
    //             .replace(/\r/g, '');
    //     }

    // } catch (error) {
    //     console.error('请求失败:', error);
    //     outputElement.innerHTML += `<br>ERROR: ${error.message}`;
    // }

    try {
        const response = await fetch('http://localhost:5000/run', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(inputData)
        });

        // 使用 TextDecoder 处理流数据
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) 
                break;

            // 解码并处理数据块
            buffer += decoder.decode(value, { stream: true });
            
            // 处理完整的事件（按换行分割）
            const parts = buffer.split('\n');
            buffer = parts.pop() || ''; // 保留未完成的部分

            for (const part of parts) {
                // 处理 SSE 格式（"data: " 前缀）
                if (part.startsWith('data: ')) {
                    const content = part.slice(6).trim();
                    
                    // 处理退出状态码
                    if (content.startsWith('PROCESS_EXIT_CODE:')) {
                        const code = content.split(':')[1];
                        outputElement.innerHTML += `<br>Process exited with code ${code}`;
                        continue;
                    }
                    
                    // 替换换行符并添加内容
                    outputElement.innerHTML += content.replace(/\n/g, '<br>') + '<br>';
                    
                    // 自动滚动到底部
                    outputElement.scrollTop = outputElement.scrollHeight;
                }
            }
        }
    } catch (error) {
        console.error('请求失败:', error);
        outputElement.innerHTML += `<br>Error: ${error.message}`;
    }
}
