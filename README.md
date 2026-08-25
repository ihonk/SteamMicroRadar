# Steam 爆款微型独立游戏数据搜集与筛选工具 (Steam Micro-Indie Radar)

一套针对 Steam 平台的自动化爆款独立游戏数据搜集、团队规模智能判定与交互式数据看板生成工具。

## 🎯 核心筛选指标
1. **发售时间**：近 3 年内发售（2023 年至 2026 年）。
2. **平台与标签**：Steam 平台，必须包含 `Indie`（独立游戏）标签/类别。
3. **销量/热度预估**：预估销量 ≥ 10 万套（基于 Boxleiter 40x 转换模型，对应 Steam 真实评测数 ≥ 2,500 条）。
4. **团队规模**：核心开发人员（Core Developers）必须 **≤ 3 人**（1人单人开发 Solo Dev、2人 Duo 或 3人 Trio）。

---

## 📂 项目文件目录结构
```text
├── fetcher.py                         # Module 1: Steam API/Gamalytic 数据抓取、过滤与 SQLite 缓存
├── team_analyzer.py                   # Module 2: 基于正则挖掘、元数据与知识库的团队规模分析器
├── html_exporter.py                   # Module 3: 单文件独立交互式暗黑风 HTML 看板生成器
├── main.py                            # 主程序 CLI 入口（串联抓取、分析、导出流水线）
├── requirements.txt                   # Python 依赖清单
├── README.md                          # 项目说明与使用文档
├── steam_cache.db                     # SQLite 本地持久化缓存数据库
└── steam_micro_indies_dashboard.html  # 最终生成的单文件零依赖交互式数据看板
```

---

## ⚙️ 快速上手与运行说明

### 1. 环境准备
支持 Python 3.8+。默认使用标准库（`urllib`, `sqlite3`, `re`, `json` 等），无需任何第三方依赖即可开箱即用。

如需安装可选依赖（如 `requests`, `jinja2` 等）：
```bash
pip install -r requirements.txt
```

### 2. 执行自动化流水线
一键完成数据拉取、微型团队规模智能推断与交互式 HTML 仪表盘渲染：
```bash
python3 main.py
```
运行后将自动生成并输出 `steam_micro_indies_dashboard.html`。

### 3. CLI 参数进阶用法

- **自定义筛选阈值与输出文件**：
  ```bash
  python3 main.py --min-year 2023 --min-reviews 5000 --max-team 1 --out solo_dev_hits.html
  ```

- **单游戏 AppID 即时深度判定**（例如分析《Balatro》AppID 2379780）：
  ```bash
  python3 main.py --appid 2379780
  ```

- **导出为标准 JSON 格式**：
  ```bash
  python3 main.py --json > micro_indies.json
  ```

---

## 🧠 模块实现细节

### Module 1: `fetcher.py`
- **数据源支持**：Steam Store Web API (`appdetails`)、SteamSpy 标签检索、以及高可信基准数据集。
- **本地缓存机制**：使用 SQLite (`steam_cache.db`) 自动建立 `game_cache` 数据表，避免重复调用 Steam API。
- **防封禁限速 (Rate Limiting)**：内置智能 Token Bucket 请求延迟控制（1.0s+ 间隔），严格遵循 Steam API 爬虫礼仪。
- **销量估算模型**：采用行业通用的 Boxleiter 模型（`Estimated Sales = Reviews Count × 40.0`），并兼顾定价阶梯。

### Module 2: `team_analyzer.py`
- **多层级推断引擎**：
  1. **已知知名独立创作者数据库**：收录 LocalThunk、Zeekerss、Mike Klubnika、Billy Basso、Slavic Magic 等已核实的独立制作人。
  2. **文本挖掘正则匹配库**：扫描商店“关于游戏”及开发者致谢中的高频特征短语（如 `solo developer`, `made by one person`, `one-man army`, `team of 2`, `duo studio`, `二人团队`, `单人开发` 等）。
  3. **开发者实体拆分与排他分析**：解析 `developers` 字段中的自然人姓名与工作室关键词。
  4. **置信度评级**：输出 `High`（明确文本证据/核实数据库）、`Medium`（署名单一自然人/小工作室）、`Low`（弱证据推断）。

### Module 3: `html_exporter.py`
- **零外部依赖**：将 CSS 样式、SVG 图标、交互脚本与 JSON 数据集全部内联为单一独立的 `.html` 文件。
- **Steam 极客暗黑主题**：符合 Steam 玩家与开发者审美的 `#171a21` / `#1b2838` / `#66c0f4` 配色规范。
- **交互控制台**：
  - 支持即时模糊搜索（游戏名、开发者、判定依据）。
  - 支持团队规模（全部 / 1人 Solo / 2-3人团队）及年份（2023-2026）过滤。
  - 支持预估销量、评测数、好评率、发售时间多维度排序。
  - 支持表格视图 (Table) 与卡片网格视图 (Grid) 无缝切换。
  - 点击任意卡片/行弹出详情抽屉，展示完整团队判定证据链与 Steam 商店直达链接。
