# Context Lens for Google Antigravity

<p align="center">
  <img src="assets/logo.svg" alt="Context Lens Logo" width="80" height="80">
</p>

<p align="center">
  <strong>Antigravity 原生风格上下文与 Token 监视器 (Native Context & Token Usage Monitor)</strong><br>
  实时展示会话上下文窗口占用、Google Prompt 缓存命中率、交互增长折线图与一键优化建议。
</p>

<p align="center">
  <a href="#features">特性 (Features)</a> •
  <a href="#installation">安装指南 (Installation)</a> •
  <a href="#usage">使用方法 (Usage)</a> •
  <a href="#architecture">技术架构 (Architecture)</a> •
  <a href="#license">开源协议 (License)</a>
</p>

---

## 特性 (Features)

* **100% 融合 Antigravity 原生设计**：
  采用 Google Material 3 规范与官方主题 CSS 变量（`--background`, `--card`, `--border`, `--primary`, `--foreground` 等），完美自适应浅色（Light）与深色（Dark）模式，原生内嵌在右侧辅助面板（Aux Pane），完全不突兀。
* **实时上下文用量仪表盘**：
  大号醒目呈现当前 Prompt 上下文大小与健康度区间（健康 <30% / 适中 30-70% / 偏高 >70%），支持自由切换窗口上限基准（1M / 2M / 200k / 128k）。
* **Prompt Caching 缓存命中率深度拆解**：
  针对 Gemini 系列长上下文特性，精确分解 **缓存命中 (Cache Read)**、**新增输入 (New Input)** 与 **模型生成 (Output)**，直观展现缓存加速倍率。
* **交互上下文膨胀趋势图**：
  采用纯原生轻量 SVG 矢量绘制平滑面积折线走势图，支持鼠标悬停查看每一步交互的 Token 数量、缓存比例与触发的工具。
* **工具调用与累计吞吐统计**：
  统计整个会话的累计 Prompt 吞吐量、累计模型回复、模型深度思考字符数，以及各工具（如 `run_command`, `view_file` 等）的调用次数占比。
* **一键压缩优化与诊断导出**：
  提供一键向 Agent 发送 `/compact` 上下文压缩指令，以及一键复制 Markdown 诊断报告。
* **完整中英双语自适应 (i18n)**：
  自动侦测系统语言，支持在界面右上角一键无刷新切换中文 / English。
* **全矢量 SVG 图标体系**：
  界面所有图符均采用纯矢量 SVG 绘制，无任何操作系统 emoji 平台兼容性或风格突兀问题。

---

## 安装指南 (Installation)

### 方式一：克隆到 Antigravity 插件目录（推荐）

打开终端，将本项目克隆到 Antigravity 全局插件目录中：

**macOS / Linux**:
```bash
git clone https://github.com/your-username/antigravity-context-lens.git ~/.gemini/config/plugins/context-lens
```

**Windows (PowerShell)**:
```powershell
git clone https://github.com/your-username/antigravity-context-lens.git "$env:USERPROFILE\.gemini\config\plugins\context-lens"
```

### 方式二：手动解压
将解压后的文件夹重命名为 `context-lens`，放置在对应系统的插件目录下：
- **macOS / Linux**: `~/.gemini/config/plugins/context-lens`
- **Windows**: `%USERPROFILE%\.gemini\config\plugins\context-lens`

---

## 使用方法 (Usage)

1. **启用插件**：
   - 打开 Antigravity 客户端，在左侧导航栏点击 **Customizations**（自定义）。
   - 切换到 **Installed**（已安装）标签页。
   - 找到 **Context Lens** 插件，点击右侧开关将其**启用（Enable）**。
2. **打开面板**：
   - 进入任意对话会话。
   - 点击右上角的 **⋮**（三点菜单），在 **Extensions**（扩展）菜单中选择 **Context Lens** 即可在右侧边栏开启。
   - 快捷链接：可在会话中直接点击 `[Context Lens](sidecar://context-lens/panel/)` 打开。

---

## 项目目录结构 (Directory Structure)

```text
context-lens/
├── assets/
│   └── logo.svg                 # 插件矢量图标 (64x64 SVG)
├── sidecars/
│   └── panel/                   # UI Extension Sidecar
│       ├── sidecar.json         # 进程与 Aux Pane 视图声明
│       ├── package.json         # ES Module 配置
│       ├── main.mjs             # 后端：SidecarApp API 与 transcript 日志解析
│       ├── index.html           # 前端：结构与组件 (全矢量 SVG 图符)
│       ├── app.js               # 前端：i18n 引擎、SVG 走势图绘制与双向通信
│       └── styles.css           # 样式：Antigravity 原生主题变量
├── .gitignore                   # Git 忽略配置
├── LICENSE                      # MIT 开源协议
├── plugin.json                  # Antigravity 插件清单
└── README.md                    # 项目说明文档
```

---

## 开源协议 (License)

本项目采用 [MIT License](LICENSE) 开源协议。
欢迎提交 Issue 和 Pull Request 共建 Antigravity 开源生态！
