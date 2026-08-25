"""
Module 3: Standalone Interactive HTML Exporter (html_exporter.py)
------------------------------------------------------------------
Generates a 100% self-contained, zero-dependency HTML dashboard file
(steam_micro_indies_dashboard.html) featuring Steam Geek Dark Theme,
real-time KPI calculation, interactive search/filter/sort, and evidence inspect modal.
"""

import json
from typing import List, Dict, Any


def generate_dashboard_html(games: List[Dict[str, Any]], output_file: str = "steam_micro_indies_dashboard.html") -> str:
    """Render the games dataset into a standalone interactive HTML dashboard."""
    
    # Calculate initial KPIs
    total_games = len(games)
    solo_games = sum(1 for g in games if g.get("team_size") == 1)
    solo_ratio = (solo_games / total_games * 100) if total_games > 0 else 0
    avg_rating = (sum(g.get("positive_rate", 0) for g in games) / total_games) if total_games > 0 else 0
    total_est_sales = sum(g.get("estimated_sales", 0) for g in games)

    # Encode games data into JSON string safe for script tag
    games_json_str = json.dumps(games, ensure_ascii=False)

    html_template = f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Steam 爆款微型独立游戏数据看板 (Steam Micro-Indie Radar)</title>
  <style>
    /* ================= STEAM DARK THEME RESET & SYSTEM ================= */
    :root {{
      --bg-main: #0e141b;
      --bg-surface: #171a21;
      --bg-card: #1b2838;
      --bg-card-hover: #22354c;
      --bg-accent: #2a475e;
      --border-color: #2b3e52;
      --border-highlight: #3b5773;
      --text-primary: #e5f0f9;
      --text-secondary: #90a5b8;
      --text-muted: #5e7992;
      --steam-blue: #66c0f4;
      --steam-light-blue: #a3dcff;
      --green-solo: #10b981;
      --green-solo-bg: rgba(16, 185, 129, 0.15);
      --green-solo-border: rgba(16, 185, 129, 0.4);
      --cyan-team: #06b6d4;
      --cyan-team-bg: rgba(6, 182, 212, 0.15);
      --cyan-team-border: rgba(6, 182, 212, 0.4);
      --gold-accent: #f59e0b;
      --danger-red: #f43f5e;
      --font-stack: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
    }}

    * {{
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }}

    body {{
      background: radial-gradient(circle at 50% 0%, #172432 0%, #0e141b 100%);
      color: var(--text-primary);
      font-family: var(--font-stack);
      line-height: 1.5;
      min-height: 100vh;
      padding: 24px 20px 60px 20px;
    }}

    .container {{
      max-width: 1380px;
      margin: 0 auto;
    }}

    /* ================= HEADER & BADGES ================= */
    .header {{
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      margin-bottom: 28px;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--border-color);
    }}

    .title-area {{
      display: flex;
      align-items: center;
      gap: 14px;
    }}

    .logo-icon {{
      width: 44px;
      height: 44px;
      background: linear-gradient(135deg, #1b2838, #2a475e);
      border: 1px solid var(--steam-blue);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(102, 192, 244, 0.2);
    }}

    .logo-icon svg {{
      width: 24px;
      height: 24px;
      fill: var(--steam-blue);
    }}

    h1 {{
      font-size: 24px;
      font-weight: 700;
      letter-spacing: -0.5px;
      color: #fff;
    }}

    .subtitle {{
      font-size: 13px;
      color: var(--text-secondary);
      margin-top: 2px;
    }}

    .criteria-tags {{
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }}

    .tag-badge {{
      font-size: 12px;
      padding: 4px 10px;
      border-radius: 6px;
      background: rgba(42, 71, 94, 0.4);
      border: 1px solid var(--border-color);
      color: var(--text-secondary);
    }}

    .tag-badge.active {{
      background: rgba(102, 192, 244, 0.12);
      border-color: rgba(102, 192, 244, 0.4);
      color: var(--steam-blue);
      font-weight: 600;
    }}

    /* ================= KPI STATS CARDS ================= */
    .kpi-grid {{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }}

    .kpi-card {{
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: 10px;
      padding: 18px 20px;
      display: flex;
      flex-direction: column;
      position: relative;
      overflow: hidden;
      box-shadow: 0 4px 16px rgba(0,0,0,0.25);
    }}

    .kpi-card::before {{
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--steam-blue), #2a475e);
    }}

    .kpi-card.solo::before {{
      background: linear-gradient(90deg, var(--green-solo), #059669);
    }}

    .kpi-card.rating::before {{
      background: linear-gradient(90deg, var(--gold-accent), #d97706);
    }}

    .kpi-card.sales::before {{
      background: linear-gradient(90deg, #8b5cf6, #6366f1);
    }}

    .kpi-label {{
      font-size: 13px;
      color: var(--text-secondary);
      font-weight: 500;
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }}

    .kpi-val {{
      font-size: 28px;
      font-weight: 800;
      color: #fff;
      font-feature-settings: "tnum";
    }}

    .kpi-subtext {{
      font-size: 12px;
      color: var(--text-muted);
      margin-top: 4px;
    }}

    /* ================= FILTER & SEARCH BAR ================= */
    .control-panel {{
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: 10px;
      padding: 16px;
      margin-bottom: 24px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }}

    .search-box-wrapper {{
      position: relative;
      flex: 1;
      min-width: 260px;
    }}

    .search-input {{
      width: 100%;
      background: var(--bg-main);
      border: 1px solid var(--border-color);
      color: #fff;
      padding: 10px 14px 10px 38px;
      border-radius: 8px;
      font-size: 14px;
      outline: none;
      transition: all 0.2s ease;
    }}

    .search-input:focus {{
      border-color: var(--steam-blue);
      box-shadow: 0 0 0 2px rgba(102, 192, 244, 0.2);
    }}

    .search-icon {{
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      width: 16px;
      height: 16px;
      fill: var(--text-muted);
    }}

    .filter-group {{
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
    }}

    .filter-label {{
      font-size: 13px;
      color: var(--text-muted);
      margin-right: 4px;
    }}

    .btn-pill {{
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      color: var(--text-secondary);
      font-size: 13px;
      font-weight: 500;
      padding: 6px 14px;
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.2s ease;
      user-select: none;
    }}

    .btn-pill:hover {{
      background: var(--bg-card-hover);
      color: #fff;
      border-color: var(--border-highlight);
    }}

    .btn-pill.active {{
      background: var(--steam-blue);
      color: #0e141b;
      border-color: var(--steam-blue);
      font-weight: 700;
    }}

    .select-dropdown {{
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      color: var(--text-primary);
      padding: 7px 12px;
      border-radius: 8px;
      font-size: 13px;
      outline: none;
      cursor: pointer;
    }}

    .view-toggle {{
      display: flex;
      background: var(--bg-main);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 2px;
    }}

    .toggle-btn {{
      background: transparent;
      border: none;
      padding: 6px 10px;
      border-radius: 6px;
      cursor: pointer;
      color: var(--text-muted);
      display: flex;
      align-items: center;
      justify-content: center;
    }}

    .toggle-btn.active {{
      background: var(--bg-card);
      color: var(--steam-blue);
    }}

    /* ================= TABLE VIEW ================= */
    .table-container {{
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: 10px;
      overflow-x: auto;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    }}

    table {{
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 13px;
    }}

    thead th {{
      background: #141c24;
      color: var(--text-secondary);
      font-weight: 600;
      padding: 12px 14px;
      border-bottom: 1px solid var(--border-color);
      white-space: nowrap;
    }}

    tbody tr {{
      border-bottom: 1px solid rgba(43, 62, 82, 0.5);
      transition: background 0.15s ease;
      cursor: pointer;
    }}

    tbody tr:hover {{
      background: rgba(34, 53, 76, 0.4);
    }}

    tbody td {{
      padding: 12px 14px;
      vertical-align: middle;
    }}

    .game-thumb {{
      width: 110px;
      height: 52px;
      object-fit: cover;
      border-radius: 6px;
      border: 1px solid var(--border-color);
      background: #000;
      display: block;
    }}

    .game-title-cell {{
      display: flex;
      flex-direction: column;
      gap: 2px;
    }}

    .game-name {{
      font-size: 14px;
      font-weight: 700;
      color: #fff;
    }}

    .game-appid {{
      font-size: 11px;
      color: var(--text-muted);
    }}

    .badge-solo {{
      display: inline-flex;
      align-items: center;
      gap: 4px;
      background: var(--green-solo-bg);
      border: 1px solid var(--green-solo-border);
      color: var(--green-solo);
      padding: 3px 8px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 700;
      white-space: nowrap;
    }}

    .badge-team {{
      display: inline-flex;
      align-items: center;
      gap: 4px;
      background: var(--cyan-team-bg);
      border: 1px solid var(--cyan-team-border);
      color: var(--cyan-team);
      padding: 3px 8px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 700;
      white-space: nowrap;
    }}

    .rating-bar-wrap {{
      display: flex;
      flex-direction: column;
      gap: 3px;
      min-width: 90px;
    }}

    .rating-num {{
      font-size: 12px;
      font-weight: 700;
      color: var(--gold-accent);
    }}

    .rating-bar-bg {{
      width: 100%;
      height: 4px;
      background: rgba(255,255,255,0.1);
      border-radius: 2px;
      overflow: hidden;
    }}

    .rating-bar-fill {{
      height: 100%;
      background: linear-gradient(90deg, #f59e0b, #10b981);
    }}

    .evidence-text {{
      font-size: 12px;
      color: var(--text-secondary);
      max-width: 280px;
      line-height: 1.4;
    }}

    .steam-btn {{
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      color: var(--steam-blue);
      text-decoration: none;
      padding: 5px 10px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      transition: all 0.2s;
    }}

    .steam-btn:hover {{
      background: var(--steam-blue);
      color: #0e141b;
      border-color: var(--steam-blue);
    }}

    /* ================= GRID CARDS VIEW ================= */
    .grid-container {{
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 18px;
    }}

    .game-card {{
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: 10px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
      cursor: pointer;
    }}

    .game-card:hover {{
      transform: translateY(-3px);
      border-color: var(--steam-blue);
      box-shadow: 0 8px 24px rgba(0,0,0,0.4);
    }}

    .card-banner {{
      width: 100%;
      height: 150px;
      object-fit: cover;
      background: #000;
      position: relative;
    }}

    .card-content {{
      padding: 16px;
      display: flex;
      flex-direction: column;
      flex: 1;
    }}

    .card-header-row {{
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 8px;
    }}

    .card-title {{
      font-size: 16px;
      font-weight: 700;
      color: #fff;
      line-height: 1.3;
    }}

    .card-meta-grid {{
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin: 12px 0;
      padding: 10px;
      background: var(--bg-main);
      border-radius: 6px;
      font-size: 12px;
    }}

    .card-meta-item span {{
      color: var(--text-muted);
      display: block;
      font-size: 11px;
    }}

    .card-meta-item strong {{
      color: var(--text-primary);
      font-weight: 600;
    }}

    .evidence-box {{
      background: rgba(16, 185, 129, 0.08);
      border-left: 3px solid var(--green-solo);
      padding: 8px 10px;
      border-radius: 0 6px 6px 0;
      font-size: 12px;
      color: #a7f3d0;
      margin-top: auto;
    }}

    .evidence-box.team-ev {{
      background: rgba(6, 182, 212, 0.08);
      border-left: 3px solid var(--cyan-team);
      color: #a5f3fc;
    }}

    /* ================= MODAL DRAWER ================= */
    .modal-overlay {{
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.75);
      backdrop-filter: blur(4px);
      z-index: 999;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }}

    .modal-box {{
      background: #171a21;
      border: 1px solid var(--border-highlight);
      border-radius: 12px;
      width: 100%;
      max-width: 650px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 16px 48px rgba(0,0,0,0.6);
      position: relative;
    }}

    .modal-header {{
      position: relative;
    }}

    .modal-banner {{
      width: 100%;
      height: 220px;
      object-fit: cover;
      border-radius: 12px 12px 0 0;
    }}

    .modal-close {{
      position: absolute;
      top: 14px;
      right: 14px;
      background: rgba(0,0,0,0.6);
      border: 1px solid rgba(255,255,255,0.2);
      color: #fff;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
    }}

    .modal-body {{
      padding: 20px;
    }}

    .empty-state {{
      text-align: center;
      padding: 60px 20px;
      color: var(--text-muted);
      font-size: 15px;
    }}
  </style>
</head>
<body>
  <div class="container">
    <!-- Header Area -->
    <header class="header">
      <div class="title-area">
        <div class="logo-icon">
          <svg viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
          </svg>
        </div>
        <div>
          <h1>Steam 爆款微型独立游戏数据看板</h1>
          <div class="subtitle">近 3 年 (2023-至今) 核心团队 ≤ 3 人 · 销量 ≥ 10 万套 (评测 ≥ 2,500 条) 爆款雷达</div>
        </div>
      </div>
      <div class="criteria-tags">
        <span class="tag-badge active">发售: 2023 - 2026</span>
        <span class="tag-badge active">标签: Indie (独立游戏)</span>
        <span class="tag-badge active">评测: ≥ 2,500 条</span>
        <span class="tag-badge active">团队: ≤ 3 人核心</span>
      </div>
    </header>

    <!-- Top KPI Cards -->
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-label">符合条件爆款总量 <span>🎯</span></div>
        <div class="kpi-val" id="kpi-total">{total_games} <span style="font-size:16px;font-weight:400;color:var(--text-secondary);">款</span></div>
        <div class="kpi-subtext">通过严格多维规则筛选</div>
      </div>
      <div class="kpi-card solo">
        <div class="kpi-label">单人开发 (Solo Dev) 占比 <span>👤</span></div>
        <div class="kpi-val" id="kpi-solo-ratio">{solo_ratio:.1f}%</div>
        <div class="kpi-subtext">其中单人研发作品数: <strong id="kpi-solo-count" style="color:#fff;">{solo_games}</strong> 款</div>
      </div>
      <div class="kpi-card rating">
        <div class="kpi-label">平均好评率 <span>⭐</span></div>
        <div class="kpi-val" id="kpi-avg-rating">{avg_rating:.1f}%</div>
        <div class="kpi-subtext">Steam 好评如潮 / 特别好评</div>
      </div>
      <div class="kpi-card sales">
        <div class="kpi-label">预估总销量 (Boxleiter 40x) <span>💰</span></div>
        <div class="kpi-val" id="kpi-total-sales">{total_est_sales / 1_000_000:.1f}M <span style="font-size:16px;font-weight:400;color:var(--text-secondary);">套</span></div>
        <div class="kpi-subtext">累计预估流水超千万美元</div>
      </div>
    </div>

    <!-- Interactive Control Panel -->
    <div class="control-panel">
      <!-- Search Input -->
      <div class="search-box-wrapper">
        <svg class="search-icon" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
        <input type="text" id="searchInput" class="search-input" placeholder="搜索游戏名称、开发者、判定依据..." oninput="handleSearchChange()" />
      </div>

      <!-- Quick Filter Buttons -->
      <div class="filter-group">
        <span class="filter-label">团队规模:</span>
        <button class="btn-pill active" onclick="setTeamFilter('all', this)">全部</button>
        <button class="btn-pill" onclick="setTeamFilter('1', this)">1人 (Solo)</button>
        <button class="btn-pill" onclick="setTeamFilter('2-3', this)">2-3人小团队</button>
      </div>

      <div class="filter-group">
        <span class="filter-label">年份:</span>
        <select id="yearFilter" class="select-dropdown" onchange="applyFilters()">
          <option value="all">全部年份 (2023-2026)</option>
          <option value="2023">2023 年</option>
          <option value="2024">2024 年</option>
          <option value="2025">2025 年</option>
          <option value="2026">2026 年</option>
        </select>
      </div>

      <div class="filter-group">
        <span class="filter-label">排序:</span>
        <select id="sortSelect" class="select-dropdown" onchange="applyFilters()">
          <option value="sales_desc">预估销量 (高到低)</option>
          <option value="reviews_desc">评价数 (高到低)</option>
          <option value="rating_desc">好评率 (高到低)</option>
          <option value="date_desc">发售日期 (最新优先)</option>
          <option value="team_asc">团队人数 (少到多)</option>
        </select>
      </div>

      <!-- View Switcher -->
      <div class="view-toggle">
        <button id="viewTableBtn" class="toggle-btn active" onclick="setViewMode('table')" title="表格模式">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h18v18H3V3zm2 4h14V5H5v2zm0 4h14V9H5v2zm0 4h14v-2H5v2zm0 4h14v-2H5v2z"/></svg>
        </button>
        <button id="viewGridBtn" class="toggle-btn" onclick="setViewMode('grid')" title="卡片模式">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z"/></svg>
        </button>
      </div>
    </div>

    <!-- Data Views Container -->
    <div id="tableViewWrap" class="table-container">
      <table>
        <thead>
          <tr>
            <th>封面</th>
            <th>游戏名称 / AppID</th>
            <th>发售日期</th>
            <th>评价数 / 好评率</th>
            <th>预估销量</th>
            <th>开发者</th>
            <th>团队预估</th>
            <th>判定依据</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody id="gamesTableBody">
          <!-- Rendered via JS -->
        </tbody>
      </table>
    </div>

    <div id="gridViewWrap" class="grid-container" style="display: none;">
      <!-- Rendered via JS -->
    </div>

    <div id="emptyState" class="empty-state" style="display: none;">
      没有找到匹配条件的微型独立游戏记录，请调整筛选条件。
    </div>
  </div>

  <!-- Detail Modal -->
  <div id="detailModal" class="modal-overlay" onclick="closeModal(event)">
    <div class="modal-box" onclick="event.stopPropagation()">
      <div class="modal-header">
        <img id="modalBanner" class="modal-banner" src="" alt="Banner" />
        <button class="modal-close" onclick="closeModalDirect()">&times;</button>
      </div>
      <div class="modal-body">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
          <div>
            <h2 id="modalTitle" style="font-size: 20px; font-weight: 700; color: #fff;"></h2>
            <div id="modalDev" style="font-size: 13px; color: var(--text-secondary); margin-top: 2px;"></div>
          </div>
          <div id="modalBadge"></div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin: 16px 0; background: var(--bg-main); padding: 12px; border-radius: 8px; font-size: 13px;">
          <div><span style="color:var(--text-muted);display:block;font-size:11px;">发售日期</span><strong id="modalDate" style="color:#fff;"></strong></div>
          <div><span style="color:var(--text-muted);display:block;font-size:11px;">Steam 评价</span><strong id="modalReviews" style="color:#fff;"></strong></div>
          <div><span style="color:var(--text-muted);display:block;font-size:11px;">预估销量</span><strong id="modalSales" style="color:var(--steam-blue);"></strong></div>
        </div>

        <div style="margin-bottom: 16px;">
          <h4 style="font-size: 13px; color: var(--text-secondary); margin-bottom: 6px;">🎯 团队判定证据 (Evidence Trace):</h4>
          <div id="modalEvidence" style="background: rgba(42, 71, 94, 0.3); border: 1px solid var(--border-color); border-radius: 6px; padding: 10px; font-size: 13px; color: #d1fae5; line-height: 1.6;"></div>
        </div>

        <div style="margin-bottom: 20px;">
          <h4 style="font-size: 13px; color: var(--text-secondary); margin-bottom: 6px;">📖 游戏简介:</h4>
          <p id="modalDesc" style="font-size: 13px; color: var(--text-secondary); line-height: 1.6;"></p>
        </div>

        <div style="margin-bottom: 16px;">
          <h4 style="font-size: 13px; color: #facc15; margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
            ✨ 游戏类型与看点:
          </h4>
          <div id="modalGenreAnalysis" style="background: rgba(234, 179, 8, 0.1); border: 1px solid rgba(234, 179, 8, 0.3); border-radius: 6px; padding: 10px; font-size: 13px; color: #fef08a; line-height: 1.6;"></div>
        </div>

        <div style="margin-bottom: 20px;">
          <h4 style="font-size: 13px; color: #fb923c; margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
            🔥 爆款逻辑 / 破圈驱动机制:
          </h4>
          <div id="modalViralLogic" style="background: rgba(249, 115, 22, 0.1); border: 1px solid rgba(249, 115, 22, 0.3); border-radius: 6px; padding: 10px; font-size: 13px; color: #fed7aa; line-height: 1.6;"></div>
        </div>

        <div style="display: flex; gap: 12px;">
          <a id="modalSteamLink" href="#" target="_blank" class="steam-btn" style="flex: 1; justify-content: center; padding: 10px;">
            在 Steam 商店中查看
          </a>
          <a id="modalSteamDbLink" href="#" target="_blank" class="steam-btn" style="background: transparent; border-color: var(--border-color); color: var(--text-secondary); padding: 10px 16px;">
            SteamDB 数据库
          </a>
        </div>
      </div>
    </div>
  </div>

  <!-- Raw JSON Dataset -->
  <script>
    const rawGamesData = {games_json_str};
    let currentTeamFilter = 'all';
    let currentViewMode = 'table';

    function formatNumber(num) {{
      return num.toLocaleString();
    }}

    function renderKPIs(dataset) {{
      const total = dataset.length;
      const soloCount = dataset.filter(g => g.team_size === 1).length;
      const soloRatio = total > 0 ? ((soloCount / total) * 100).toFixed(1) : 0;
      const avgRating = total > 0 ? (dataset.reduce((acc, g) => acc + (g.positive_rate || 0), 0) / total).toFixed(1) : 0;
      const totalSales = dataset.reduce((acc, g) => acc + (g.estimated_sales || 0), 0);

      document.getElementById('kpi-total').innerHTML = `${{total}} <span style="font-size:16px;font-weight:400;color:var(--text-secondary);">款</span>`;
      document.getElementById('kpi-solo-ratio').textContent = `${{soloRatio}}%`;
      document.getElementById('kpi-solo-count').textContent = soloCount;
      document.getElementById('kpi-avg-rating').textContent = `${{avgRating}}%`;
      document.getElementById('kpi-total-sales').innerHTML = `${{(totalSales / 1000000).toFixed(1)}}M <span style="font-size:16px;font-weight:400;color:var(--text-secondary);">套</span>`;
    }}

    function getTeamBadgeHtml(game) {{
      if (game.team_size === 1) {{
        return `<span class="badge-solo">👤 1人 Solo Dev</span>`;
      }} else if (game.team_size === 2) {{
        return `<span class="badge-team">👥 2人 Duo 团队</span>`;
      }} else if (game.team_size === 3) {{
        return `<span class="badge-team">👥 3人 Trio 团队</span>`;
      }} else {{
        return `<span class="tag-badge">${{game.team_size}} 人团队</span>`;
      }}
    }}

    function applyFilters() {{
      const searchQuery = document.getElementById('searchInput').value.trim().toLowerCase();
      const yearFilter = document.getElementById('yearFilter').value;
      const sortSelect = document.getElementById('sortSelect').value;

      let filtered = rawGamesData.filter(game => {{
        // Team size filter
        if (currentTeamFilter === '1' && game.team_size !== 1) return false;
        if (currentTeamFilter === '2-3' && (game.team_size < 2 || game.team_size > 3)) return false;

        // Year filter
        if (yearFilter !== 'all') {{
          const y = parseInt(yearFilter);
          if (game.release_year !== y && !game.release_date.includes(yearFilter)) return false;
        }}

        // Search query
        if (searchQuery) {{
          const title = (game.title || '').toLowerCase();
          const devs = (game.developers || []).join(' ').toLowerCase();
          const evidence = (game.evidence || []).join(' ').toLowerCase();
          const desc = (game.description || '').toLowerCase();
          if (!title.includes(searchQuery) && !devs.includes(searchQuery) && !evidence.includes(searchQuery) && !desc.includes(searchQuery)) {{
            return false;
          }}
        }}

        return true;
      }});

      // Sorting
      filtered.sort((a, b) => {{
        if (sortSelect === 'sales_desc') return (b.estimated_sales || 0) - (a.estimated_sales || 0);
        if (sortSelect === 'reviews_desc') return (b.reviews_count || 0) - (a.reviews_count || 0);
        if (sortSelect === 'rating_desc') return (b.positive_rate || 0) - (a.positive_rate || 0);
        if (sortSelect === 'date_desc') return (b.release_date || '').localeCompare(a.release_date || '');
        if (sortSelect === 'team_asc') return (a.team_size || 1) - (b.team_size || 1);
        return 0;
      }});

      renderKPIs(filtered);
      renderTable(filtered);
      renderGrid(filtered);

      const emptyState = document.getElementById('emptyState');
      const tableWrap = document.getElementById('tableViewWrap');
      const gridWrap = document.getElementById('gridViewWrap');

      if (filtered.length === 0) {{
        emptyState.style.display = 'block';
        tableWrap.style.display = 'none';
        gridWrap.style.display = 'none';
      }} else {{
        emptyState.style.display = 'none';
        if (currentViewMode === 'table') {{
          tableWrap.style.display = 'block';
          gridWrap.style.display = 'none';
        }} else {{
          tableWrap.style.display = 'none';
          gridWrap.style.display = 'grid';
        }}
      }}
    }}

    function renderTable(dataset) {{
      const tbody = document.getElementById('gamesTableBody');
      tbody.innerHTML = '';

      dataset.forEach(game => {{
        const tr = document.createElement('tr');
        tr.onclick = () => openModal(game);

        const evHtml = (game.evidence && game.evidence.length > 0)
          ? `<div class="evidence-text">${{game.evidence[0]}}</div>`
          : '<div class="evidence-text" style="color:var(--text-muted);">单开发者署名推断</div>';

        tr.innerHTML = `
          <td>
            <img class="game-thumb" src="${{game.header_image}}" alt="${{game.title}}" loading="lazy" onerror="this.src='https://via.placeholder.com/120x60/171a21/66c0f4?text=Steam'" />
          </td>
          <td>
            <div class="game-title-cell">
              <span class="game-name">${{game.title}}</span>
              <span class="game-appid">AppID: ${{game.appid}}</span>
            </div>
          </td>
          <td style="white-space: nowrap; color: var(--text-secondary); font-size:12px;">${{game.release_date}}</td>
          <td>
            <div class="rating-bar-wrap">
              <div><strong>${{formatNumber(game.reviews_count)}}</strong> 条</div>
              <div class="rating-num">${{game.positive_rate}}% 好评</div>
              <div class="rating-bar-bg">
                <div class="rating-bar-fill" style="width: ${{game.positive_rate}}%;"></div>
              </div>
            </div>
          </td>
          <td style="font-weight: 700; color: var(--steam-blue); white-space: nowrap;">
            ~${{formatNumber(game.estimated_sales)}}
          </td>
          <td style="color: var(--text-secondary); max-width: 140px; font-size:12px;">
            ${{game.developers.join(', ')}}
          </td>
          <td>${{getTeamBadgeHtml(game)}}</td>
          <td>${{evHtml}}</td>
          <td>
            <a href="https://store.steampowered.com/app/${{game.appid}}/" target="_blank" class="steam-btn" onclick="event.stopPropagation()">
              商店 ↗
            </a>
          </td>
        `;
        tbody.appendChild(tr);
      }});
    }}

    function renderGrid(dataset) {{
      const grid = document.getElementById('gridViewWrap');
      grid.innerHTML = '';

      dataset.forEach(game => {{
        const card = document.createElement('div');
        card.className = 'game-card';
        card.onclick = () => openModal(game);

        const evClass = game.team_size === 1 ? 'evidence-box' : 'evidence-box team-ev';
        const evText = (game.evidence && game.evidence.length > 0) ? game.evidence[0] : '单人独立开发者';

        card.innerHTML = `
          <img class="card-banner" src="${{game.header_image}}" alt="${{game.title}}" loading="lazy" />
          <div class="card-content">
            <div class="card-header-row">
              <div class="card-title">${{game.title}}</div>
              ${{getTeamBadgeHtml(game)}}
            </div>
            <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 6px;">
              ${{game.developers.join(', ')}} · ${{game.release_date}}
            </div>
            <div class="card-meta-grid">
              <div class="card-meta-item">
                <span>Steam 评测</span>
                <strong>${{formatNumber(game.reviews_count)}} (${{game.positive_rate}}%)</strong>
              </div>
              <div class="card-meta-item">
                <span>预估销量 (40x)</span>
                <strong style="color:var(--steam-blue);">~${{formatNumber(game.estimated_sales)}}</strong>
              </div>
            </div>
            <div class="${{evClass}}">
              💡 ${{evText}}
            </div>
          </div>
        `;
        grid.appendChild(card);
      }});
    }}

    function setTeamFilter(filterVal, btn) {{
      currentTeamFilter = filterVal;
      document.querySelectorAll('.filter-group .btn-pill').forEach(el => el.classList.remove('active'));
      btn.classList.add('active');
      applyFilters();
    }}

    function handleSearchChange() {{
      applyFilters();
    }}

    function setViewMode(mode) {{
      currentViewMode = mode;
      document.getElementById('viewTableBtn').classList.toggle('active', mode === 'table');
      document.getElementById('viewGridBtn').classList.toggle('active', mode === 'grid');
      applyFilters();
    }}

    function openModal(game) {{
      document.getElementById('modalBanner').src = game.header_image;
      document.getElementById('modalTitle').textContent = game.title;
      document.getElementById('modalDev').textContent = `开发者: ${{game.developers.join(', ')}} | 发行商: ${{game.publishers.join(', ')}} | AppID: ${{game.appid}}`;
      document.getElementById('modalBadge').innerHTML = getTeamBadgeHtml(game);
      document.getElementById('modalDate').textContent = game.release_date;
      document.getElementById('modalReviews').textContent = `${{formatNumber(game.reviews_count)}} 条 (${{game.positive_rate}}% 好评)`;
      document.getElementById('modalSales').textContent = `~${{formatNumber(game.estimated_sales)}} 份 ($${{formatNumber(Math.round(game.estimated_sales * (game.price_usd || 10)))}})`;

      const evContainer = document.getElementById('modalEvidence');
      if (game.evidence && game.evidence.length > 0) {{
        evContainer.innerHTML = game.evidence.map(e => `• ${{e}}`).join('<br/>');
      }} else {{
        evContainer.textContent = '根据开发者署名与公开元数据推断';
      }}

      document.getElementById('modalDesc').textContent = game.description || '暂无详细介绍';
      document.getElementById('modalGenreAnalysis').textContent = game.genre_analysis || '暂无专属类型与看点分析';
      document.getElementById('modalViralLogic').textContent = game.viral_logic || '核心玩法自洽 + 强情绪正反馈 + 适合社交分享或直播切片传播';
      document.getElementById('modalSteamLink').href = `https://store.steampowered.com/app/${{game.appid}}/`;
      document.getElementById('modalSteamDbLink').href = `https://steamdb.info/app/${{game.appid}}/`;

      document.getElementById('detailModal').style.display = 'flex';
    }}

    function closeModal(e) {{
      if (e.target.id === 'detailModal') {{
        document.getElementById('detailModal').style.display = 'none';
      }}
    }}

    function closeModalDirect() {{
      document.getElementById('detailModal').style.display = 'none';
    }}

    // Initial render on page load
    document.addEventListener('DOMContentLoaded', () => {{
      applyFilters();
    }});
  </script>
</body>
</html>"""

    with open(output_file, "w", encoding="utf-8") as f:
        f.write(html_template)

    return output_file


if __name__ == "__main__":
    from fetcher import SteamDataFetcher
    print("--- Generating Standalone HTML Dashboard ---")
    fetcher = SteamDataFetcher()
    games = fetcher.get_filtered_games(min_year=2023, min_reviews=2500, max_team_size=3)
    out = generate_dashboard_html(games)
    print(f"Successfully generated standalone dashboard file: {out}")
