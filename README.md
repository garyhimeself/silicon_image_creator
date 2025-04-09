# Silicon Image Creator

一个简单的AI图片生成网站，使用硅基流动API来生成图片。

## 功能特点

- 文本提示词输入
- AI图片生成
- 图片预览
- 图片下载

## 技术栈

- React
- Material-UI
- Axios
- 硅基流动API

## 开始使用

1. 克隆项目
```bash
git clone [项目地址]
cd silicon-image-creator
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
创建 `.env` 文件并添加以下内容：
```
REACT_APP_SILICON_API_KEY=你的硅基流动API密钥
```

4. 启动开发服务器
```bash
npm start
```

5. 构建生产版本
```bash
npm run build
```

## 部署

项目可以部署到Cloudflare Pages：

1. 在Cloudflare Pages中创建新项目
2. 连接GitHub仓库
3. 设置构建命令：`npm run build`
4. 设置构建输出目录：`build`
5. 添加环境变量：`REACT_APP_SILICON_API_KEY`

## 注意事项

- 请确保妥善保管API密钥
- 建议在生产环境中使用环境变量管理API密钥
- 图片生成可能需要几秒钟时间，请耐心等待 