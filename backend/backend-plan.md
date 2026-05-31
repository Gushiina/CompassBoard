# 后端开发计划（WPF + C# + SQLite）

## Phase 1：WPF 窗口壳

### 目标
建立一个无边框、全屏化的 WPF 容器，内嵌 WebView2 并正确加载前端产物。

### 里程碑
- [ ] `MainWindow.xaml`：无边框（`WindowStyle=None`）、最大化、允许透明背景
- [ ] `WebView2` 铺满：使用 `DockPanel` 或 `Grid` 使 WebView2 填满整个窗口客户区
- [ ] 虚拟域名映射：`SetVirtualHostNameToFolderMapping` 将 `http://desktop.app` 指向前端构建产物目录
- [ ] 生命周期管理：窗口关闭事件拦截，改为隐藏而非退出（为系统托盘做准备）

### 验收标准
运行 WPF 程序后，WebView2 正确渲染 Vue 前端；无地址栏、无滚动条、无边框装饰。

---

## Phase 2：SQLite 数据层

### 目标
建立唯一持久化数据源，替代前端内存状态。

### 里程碑
- [ ] 数据库初始化：程序启动时自动创建 `board.db` 及 `cards` 表
- [ ] 表结构设计：涵盖 `id`、`x`、`y`、`width`、`height`、`type`、`title`、`content`、`color`、`remind_at`、`created_at`
- [ ] Repository 封装：`LoadAll()` 读取全部卡片；`SaveAll(List<Card>)` 全量覆盖写入
- [ ] 启动加载流程：WebView2 加载完成后，读取数据库并通过 `ExecuteScriptAsync` 向前端注入初始数据
- [ ] 关闭保存流程：窗口隐藏或退出前，向前端发送 `request-save`，接收回传后写入数据库

### 验收标准
关闭程序后重新打开，卡片数量、位置、内容、类型与上次完全一致；数据库文件独立存在于程序目录。

---

## Phase 3：系统层集成

### 目标
让程序具备"系统级常驻应用"的能力，而非普通浏览器窗口。

### 里程碑
- [ ] 系统托盘（NotifyIcon）：ESC 或点击关闭按钮时隐藏窗口，托盘图标常驻；双击托盘图标唤回窗口
- [ ] 托盘右键菜单：显示窗口 / 保存并退出
- [ ] 开机自启：启动时检查注册表 `HKCU\...\Run`，不存在则写入当前 exe 路径
- [ ] 本地文件存储：接收前端发来的图片二进制数据，存储至 `%LocalAppData%\CompaasBoard\images\`，返回 `local://images/` 协议路径
- [ ] 协议拦截：WebView2 中拦截 `local://` 请求，映射到真实磁盘路径
- [ ] Windows 通知提醒：接收前端 `set-reminder` 指令，`DispatcherTimer` 定时扫描 `remind_at` 字段，到期触发系统 Toast 或托盘气泡提示

### 验收标准
开机后程序自动全屏出现；ESC 隐藏到托盘；右键可完全退出；图片刷新不丢失；到点右下角弹窗提醒。

---

## Phase 4：桌面层级（可选）

### 目标
将窗口真正钉在桌面壁纸层之上，实现"替代桌面"的终极体验。

### 里程碑
- [ ] 窗口层级研究：通过 P/Invoke `SetWindowPos` 或 `SetParent` 将 WPF 窗口置于桌面图标层（WorkerW）之上
- [ ] 防最小化：拦截 `Win+D` 或 `Show Desktop` 事件，确保窗口不被系统最小化
- [ ] 多显示器适配：窗口在所有显示器上正确最大化，或跟随主显示器

### 验收标准
按 `Win+D` 显示桌面时，看板依然可见；桌面图标在看板之下可正常点击。

