# PM2 与 Nginx

## 一、PM2 — Node 进程管理器

### 1.1 为什么需要 PM2

没有 PM2 的情况：

```bash
node app.js
# 问题1：关掉终端（SSH断开），服务就停了
# 问题2：代码报错崩溃，服务就没了
# 问题3：想看历史日志？没有，输出都丢了
```

有了 PM2：

```bash
pm2 start app.js --name todo-server
# ✔ 后台运行，关掉终端也不影响
# ✔ 崩溃自动重启
# ✔ 日志自动保存到文件
# ✔ 可以监控 CPU、内存使用情况
```

### 1.2 PM2 做了什么

PM2 是一个**守护进程（daemon）**，它在后台持续运行，负责：

```
PM2 守护进程（常驻后台）
    │
    ├── 监控 todo-server 进程
    │     ├── 进程活着 → 不管
    │     ├── 进程崩了 → 自动重启
    │     └── 记录日志 → 写入 /root/.pm2/logs/
    │
    └── 可以同时管理多个 Node 应用
          ├── todo-server（端口 3000）
          ├── blog-server（端口 4000）
          └── chat-server（端口 5000）
```

### 1.3 常用命令

```bash
# 启动
pm2 start app.js --name todo-server    # 启动并命名

# 查看状态
pm2 list                               # 列出所有进程
pm2 show todo-server                   # 查看某个进程的详细信息

# 日志
pm2 logs todo-server                   # 实时查看日志
pm2 logs todo-server --lines 50        # 查看最近50行日志
pm2 flush                              # 清空所有日志

# 重启 / 停止 / 删除
pm2 restart todo-server                # 重启（代码更新后用这个）
pm2 stop todo-server                   # 停止（进程还在列表里）
pm2 delete todo-server                 # 删除（从列表移除）

# 彻底重来
pm2 kill                               # 杀掉 PM2 守护进程本身

# 开机自启
pm2 startup                            # 生成开机启动脚本
pm2 save                               # 保存当前进程列表，开机自动恢复
```

### 1.4 日志位置

```
/root/.pm2/logs/
    ├── todo-server-out.log     # 正常输出（console.log）
    └── todo-server-error.log   # 错误输出（console.error、崩溃信息）
```

---

## 二、Nginx — Web 服务器 + 反向代理

### 2.1 为什么需要 Nginx

直接让用户访问 Node 服务有很多问题：

| | 直接访问 Node | 通过 Nginx |
|---|---|---|
| 访问地址 | `http://ip:3000`（要带端口） | `http://ip`（默认 80，用户不用记端口） |
| 前端文件 | Node 不擅长处理静态文件 | Nginx 专门干这个，性能极高 |
| HTTPS | 需要 Node 代码里自己处理证书 | Nginx 统一配置 SSL 证书 |
| 安全性 | Node 直接暴露在公网 | Nginx 挡在前面，Node 只监听 127.0.0.1 |
| 并发能力 | Node 单线程，高并发下容易卡 | Nginx 用事件驱动，轻松处理上万并发 |

### 2.2 Nginx 做了什么

Nginx 在本项目中承担两个角色：

**角色一：静态文件服务器**

```
用户访问 http://ip/login
    ↓
Nginx 在 /www/wwwroot/todo/client/dist/ 目录下找文件
    ↓
找不到 /login 这个文件
    ↓
try_files → 返回 index.html（让 React Router 处理前端路由）
    ↓
浏览器加载 index.html、JS、CSS → React 渲染登录页
```

**角色二：反向代理**

```
用户访问 http://ip/api/users/login
    ↓
Nginx 发现是 /api 开头
    ↓
转发到 http://127.0.0.1:3000/api/users/login（本机的 Node 服务）
    ↓
Node 处理完返回结果给 Nginx
    ↓
Nginx 把结果返回给用户浏览器
```

### 2.3 配置文件解析

```nginx
server {
    listen 80;                        # 监听 80 端口
    server_name 111.229.182.142;      # 服务器 IP 或域名

    # ===== 前端：静态文件 =====
    location / {
        root /www/wwwroot/todo/client/dist;   # 前端打包后的目录
        index index.html;
        try_files $uri $uri/ /index.html;     # SPA 路由支持
    }
    # try_files 的含义：
    #   1. 先找 $uri 对应的文件（如 /assets/index.js）
    #   2. 再找 $uri/ 目录
    #   3. 都找不到就返回 /index.html（交给 React Router）

    # ===== 后端：API 代理 =====
    location /api {
        proxy_pass http://127.0.0.1:3000;     # 转发到 Node 服务
        proxy_set_header X-Real-IP $remote_addr;  # 把用户真实 IP 传给后端
        ...
    }
}
```

### 2.4 常用命令

```bash
nginx -t              # 检查配置文件有没有语法错误（修改配置后先检查）
nginx -s reload       # 重新加载配置（不停服，不断开用户连接）
nginx -s stop         # 停止 Nginx
nginx -s start        # 启动 Nginx（宝塔面板一般自动管理）
```

---

## 三、整体架构

```
                        互联网
                          │
                          ▼
              ┌───────────────────────┐
              │   Nginx（80端口）      │  ← 对外，用户能看到
              │   门卫 + 前台          │
              ├───────────┬───────────┤
              │ 静态请求   │ /api 请求  │
              │ /login    │ /api/todos │
              │ /home     │ /api/users │
              ▼           ▼           │
         ┌─────────┐ ┌──────────────┐ │
         │ dist/   │ │  proxy_pass  │ │
         │ 前端文件 │ │  转发请求     │ │
         └─────────┘ └──────┬───────┘ │
                            │         │
              └─────────────┼─────────┘
                            ▼
              ┌───────────────────────┐
              │ PM2 + Node（3000端口） │  ← 仅本机，外部访问不到
              │ 后厨                   │
              │                       │
              │ Express 处理业务逻辑    │
              │ ├── 用户认证            │
              │ ├── 增删改查            │
              │ └── 操作 MySQL 数据库   │
              └───────────┬───────────┘
                          ▼
              ┌───────────────────────┐
              │ MySQL（3306端口）      │
              │ 数据库                 │
              └───────────────────────┘
```

## 四、部署流程总结

```bash
# 1. 前端打包
cd client && npm run build        # 生成 dist/ 目录

# 2. 上传到服务器
# 把 client/dist/ 放到 /www/wwwroot/todo/client/dist/
# 把 server/ 代码放到 /www/wwwroot/todo/server/

# 3. 服务器上安装后端依赖
cd /www/wwwroot/todo/server && npm install

# 4. 配置环境变量
# 编辑 /www/wwwroot/todo/server/.env

# 5. 启动 Node 服务
pm2 start app.js --name todo-server

# 6. 配置 Nginx 并生效
nginx -t && nginx -s reload

# 7. 访问
# http://111.229.182.142
```

## 五、一句话总结

- **PM2**：让 Node 服务在后台持续运行，崩了自动重启 —— **保姆**
- **Nginx**：接收用户请求，静态文件自己处理，API 请求转发给 Node —— **门卫 + 前台**
- **Node/Express**：处理业务逻辑，操作数据库 —— **后厨**
- **MySQL**：存储数据 —— **仓库**
