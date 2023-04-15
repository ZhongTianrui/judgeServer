const express = require('express');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const fs = require('fs-extra');

const app = express();
app.use(bodyParser.json());

const port = process.env.PORT || 1300;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

// 规定评测文件存放目录
const JUDGE_DIR = `${__dirname}/judge`;

// 处理评测请求
app.post('/judge', (req, res) => {
  // 创建评测编号，并创建对应的评测目录
  const judgeId = Date.now();
  const judgeDir = `${JUDGE_DIR}/${judgeId}`;
  fs.ensureDirSync(judgeDir);

  // 将提交的代码和测试数据写入对应的文件
  const codePath = `${judgeDir}/code.cpp`;
  console.log(decodeURIComponent(req.body.code));
  fs.writeFileSync(codePath, decodeURIComponent(req.body.code));
  const testInputPath = `${judgeDir}/test.in`;
  fs.writeFileSync(testInputPath, req.body.testData.input);
  const testOutputPath = `${judgeDir}/test.out`;
  fs.writeFileSync(testOutputPath, req.body.testData.output);
  var rest = {};
  // 执行评测命令行程序，传入代码、测试数据和输出路径
  const judgeProcess = spawn('judge.exe', [codePath, testInputPath, testOutputPath]);
  judgeProcess.stdout.on('data', (data) => {
    console.log(`Judge stdout: ${data}`);
    rest["stdout"] = data;
  });
  judgeProcess.stderr.on('data', (data) => {
    console.log(`Judge stderr: ${data}`);
    // rest["stderr"] = data;
  });
  judgeProcess.on('close', (code) => {
    console.log(`Judge process exited with code ${code}`);
    const resPath = `${judgeDir}/result.json`;
    fs.writeFileSync(resPath, "{}");
    // 读取评测结果，发送给客户端
    const resultPath = `${judgeDir}/result.json`;
    const resultData = fs.readFileSync(resultPath);
    if (code == 0) {
        Code = "AC";
    } else {
        Code = "WA";
    }
    rest["code"] = Code;
    res.json(rest);
    // 删除评测目录
    fs.removeSync(judgeDir);
  });
});