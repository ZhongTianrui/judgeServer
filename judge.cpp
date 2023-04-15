#include <iostream>
#include <fstream>
#include <bits/stdc++.h>

using namespace std;

int main(int argc, char *argv[]) {
  // 获取传入的参数
  const char* codePath = argv[1];
  const char* inputPath = argv[2];
  const char* outputPath = argv[3];
  
  // 编译代码
  system(("g++ " + string(codePath) + " -o code").c_str());

  // 执行代码
  system(("./code < " + string(inputPath) + " > output").c_str());

  // 比较输出结果
  ifstream expectedOutput(outputPath);
  ifstream actualOutput("output");
  if (!expectedOutput || !actualOutput) {
    return 2;
  }
  string expectedLine, actualLine;
  while (getline(expectedOutput, expectedLine) && getline(actualOutput, actualLine)) {
    if (expectedLine != actualLine) {
      return 1;
    }
  }
  return 0;
}