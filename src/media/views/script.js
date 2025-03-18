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

async function run() {
    const inputData = {
        input_dir: document.getElementById('Input Directory').value,
        output_dir: document.getElementById('Output Directory').value,
        linux_dir: document.getElementById('Linux Directory').value,
        bindgen_dir: document.getElementById('Bindgen Directory').value,
        llms: document.getElementById('LLMs-select').value
    };

    try {
        // 发送请求到后端API
        const response = await fetch('http://localhost:5000/run', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(inputData)
        });
        const data = await response.json();
        // 将换行符 \n 替换为 <br> 标签
        const formattedResult = data.result.replace(/\n/g, '<br>');
        // document.getElementById('runresult').textContent = `${data.result}`;
        document.getElementById('runresult').innerHTML = formattedResult;
    } catch (error) {
        console.error('请求失败:', error);
    }
}
