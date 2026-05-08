@echo off
echo ========================================
echo ZenShorts AI - 安装脚本
echo ========================================
echo.

echo [1/4] 检查 Node.js 版本...
node --version
if %errorlevel% neq 0 (
    echo 错误: 未找到 Node.js
    echo 请先安装 Node.js: https://nodejs.org/
    pause
    exit /b 1
)

echo.
echo [2/4] 安装依赖...
call npm install

if %errorlevel% neq 0 (
    echo 错误: 依赖安装失败
    pause
    exit /b 1
)

echo.
echo [3/4] 检查环境变量配置...
if not exist ".env.local" (
    echo 警告: .env.local 文件不存在
    echo 请确保配置了以下环境变量:
    echo   - GEMINI_API_KEY
    echo.
)

echo.
echo [4/4] 安装完成!
echo.
echo ========================================
echo 下一步:
echo ========================================
echo.
echo 1. 编辑 .env.local 文件，配置你的 API 密钥:
echo    - GEMINI_API_KEY=your-gemini-api-key
echo.
echo 2. 运行开发服务器:
echo    npm run dev
echo.
echo 3. 打开浏览器访问:
echo    http://localhost:3000
echo.
echo ========================================
echo.

pause
