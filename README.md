# 礼物设计师作品集 - 部署指南（永久在线版）

## 当前状态
本地服务器已启动，预览地址：http://localhost:3000
- 上传图片/视频 → 自动保存到服务器 → 所有设备同步
- 不再需要手动导出/导入 JSON

## 永久部署到云端（免费）

### 方案：Render.com（推荐，免费，无需信用卡）

1. **把 server 文件夹上传到 GitHub**
   - 在 https://github.com 创建一个新仓库（public 或 private 均可）
   - 把 `server/` 文件夹内所有内容上传上去（包括 server.js、package.json、public/、uploads/）

2. **在 Render 创建服务**
   - 打开 https://render.com → 注册（可用 GitHub 账号直接登录）
   - 点 New → Web Service
   - 连接刚才的 GitHub 仓库
   - 设置：
     - Name: `gift-portfolio`（随意）
     - Runtime: Node
     - Build Command: `npm install`
     - Start Command: `node server.js`
   - 点 Create Web Service

3. **等待 1-2 分钟部署完成**
   - Render 会给你一个地址，如 `https://gift-portfolio.onrender.com`
   - 这就是你的永久线上地址

4. **使用**
   - 电脑打开这个地址 → 滚到底部 → 点圆点 ×4 → 进入编辑 → 上传图片/视频 → 保存
   - 手机打开同一个地址 → 自动看到你上传的内容
   - 分享按钮的二维码也指向这个地址

### 文件说明
| 文件 | 作用 |
|------|------|
| `server.js` | Node.js 后端：文件上传 + 配置同步 API |
| `package.json` | 依赖声明（express + multer） |
| `public/index.html` | 作品集网页（所有前端代码内联） |
| `uploads/` | 上传的图片/视频存储目录 |
| `data/config.json` | 配置文件（服务器端，所有设备共享） |

### API 说明
| 端点 | 方法 | 作用 |
|------|------|------|
| `/api/config` | GET | 获取当前配置（所有设备读取同一份） |
| `/api/config` | POST | 保存配置（保存后所有设备同步） |
| `/api/upload` | POST | 上传图片/视频文件，返回 URL |
| `/uploads/*` | GET | 访问已上传的文件 |

### 本地运行
```bash
cd server
npm install
node server.js
# 打开 http://localhost:3000
```
