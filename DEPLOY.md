# 部署指南

## 方案一：Vercel 部署（推荐）

### 方法 1：通过 Vercel CLI 部署

1. 安装 Vercel CLI:
```bash
npm install -g vercel
```

2. 登录 Vercel:
```bash
vercel login
```

3. 部署项目:
```bash
cd my-app
vercel --prod
```

### 方法 2：通过 GitHub + Vercel 自动部署

1. 在 GitHub 上创建一个新仓库
2. 将代码推送到 GitHub:
```bash
cd /root/.openclaw/workspace/calculator-project
git remote add origin https://github.com/YOUR_USERNAME/calculator.git
git push -u origin master
```

3. 在 Vercel 官网 (vercel.com) 导入 GitHub 仓库
4. 配置：
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `dist`

## 方案二：静态文件部署

项目已构建为静态文件，位于 `my-app/dist/` 目录。

### 部署到任何静态托管服务：

1. **Vercel (静态)**:
```bash
cd my-app/dist
npx vercel --yes
```

2. **Netlify**:
```bash
cd my-app/dist
npx netlify deploy --prod --dir=.
```

3. **Cloudflare Pages**:
上传 `dist` 目录到 Cloudflare Pages

4. **GitHub Pages**:
将 `dist` 目录内容推送到 `gh-pages` 分支

5. **自有服务器**:
将 `dist` 目录内容复制到 Web 服务器的根目录

## 方案三：Docker 部署

创建 Dockerfile:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY my-app/dist ./
RUN npm install -g serve
EXPOSE 3000
CMD ["serve", ".", "-p", "3000"]
```

构建并运行:
```bash
docker build -t calculator .
docker run -p 3000:3000 calculator
```

## 当前构建输出

- 位置: `/root/.openclaw/workspace/calculator-project/my-app/dist/`
- 入口文件: `index.html`
- 构建类型: 静态导出 (Next.js `output: 'export'`)

## 本地预览

```bash
cd my-app/dist
python3 -m http.server 3000
# 或
npx serve .
```

然后访问 http://localhost:3000
