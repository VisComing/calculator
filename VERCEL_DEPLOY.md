# Vercel 部署指南

## ✅ GitHub 仓库已创建

**仓库地址**: https://github.com/VisComing/calculator

代码已推送完成。

## 手动部署到 Vercel（推荐）

### 步骤 1：登录 Vercel
1. 访问 https://vercel.com
2. 点击 "Sign Up" 用 GitHub 账号登录
3. 授权 Vercel 访问你的 GitHub 仓库

### 步骤 2：导入项目
1. 点击 "Add New..." → "Project"
2. 在列表中找到 `VisComing/calculator` 仓库
3. 点击 "Import"

### 步骤 3：配置构建设置
```
Framework Preset: Next.js
Root Directory: my-app
Build Command: npm run build
Output Directory: dist
```

### 步骤 4：部署
点击 "Deploy" 按钮，等待部署完成。

部署成功后，Vercel 会提供一个类似 `https://calculator-xxxxx.vercel.app` 的域名。

## 自动部署

配置完成后，每次推送到 GitHub 的 main 分支，Vercel 会自动重新部署。

## 当前状态

- ✅ GitHub 仓库: https://github.com/VisComing/calculator
- ✅ 代码已推送
- ⏳ 等待 Vercel 部署（需要手动在 Vercel 网站完成）

## 本地预览

```bash
cd /root/.openclaw/workspace/calculator-project/my-app/dist
python3 -m http.server 3000
```

访问 http://localhost:3000
