"""
Main CLI Entry Point: Steam Micro-Indie Radar (main.py)
------------------------------------------------------
Automated data pipeline for discovering and analyzing Steam viral micro-indies (<= 3 developers, 2023+, >= 2500 reviews).

Usage:
  python3 main.py
  python3 main.py --appid 2379780
  python3 main.py --min-year 2023 --min-reviews 2500 --max-team 3 --out report.html
"""

import argparse
import sys
import json
from fetcher import SteamDataFetcher
from team_analyzer import TeamAnalyzer
from html_exporter import generate_dashboard_html


def main():
    parser = argparse.ArgumentParser(
        description="Steam 爆款微型独立游戏数据搜集与筛选工具 (Steam Micro-Indie Radar)"
    )
    parser.add_argument(
        "--appid",
        type=int,
        help="Query and analyze a specific Steam AppID (e.g. 2379780 for Balatro)"
    )
    parser.add_argument(
        "--min-year",
        type=int,
        default=2023,
        help="Minimum release year (default: 2023)"
    )
    parser.add_argument(
        "--min-reviews",
        type=int,
        default=2500,
        help="Minimum reviews count for viral threshold (default: 2500)"
    )
    parser.add_argument(
        "--max-team",
        type=int,
        default=3,
        help="Maximum core team size (default: 3)"
    )
    parser.add_argument(
        "--out",
        type=str,
        default="steam_micro_indies_dashboard.html",
        help="Output HTML dashboard file path"
    )
    parser.add_argument(
        "--json",
        action="store_true",
        help="Print JSON results to stdout"
    )

    args = parser.parse_args()

    fetcher = SteamDataFetcher()

    # Mode 1: Single AppID inspection
    if args.appid:
        print(f"[*] Querying and analyzing Steam AppID: {args.appid}...")
        game = fetcher.process_custom_appid(args.appid)
        if not game:
            print(f"[!] Error: Could not fetch data for AppID {args.appid} from Steam API.")
            sys.exit(1)

        print("\n================ STEAM GAME ANALYSIS ================")
        print(f"Title:        {game['title']}")
        print(f"Developers:   {', '.join(game['developers'])}")
        print(f"Publishers:   {', '.join(game['publishers'])}")
        print(f"Release Date: {game['release_date']}")
        print(f"Reviews:      {game['reviews_count']:,} ({game['positive_rate']}% positive, all languages)")
        print(f"Est. Sales:   ~{game['estimated_sales']:,} units (Boxleiter 40x model)")
        print(f"Team Size:    {game['team_size']} person ({'Solo Dev' if game['team_size'] == 1 else 'Micro Team'})")
        print(f"Confidence:   {game['confidence']}")
        print(f"Is Micro:     {'YES (<=3 devs)' if game['is_micro'] else 'NO (>3 devs)'}")
        print("Evidence:")
        for ev in game['evidence']:
            print(f"  - {ev}")
        print("====================================================\n")
        return

    # Mode 2: Multi-criteria pipeline collection
    print("=======================================================")
    print("  🚀 Steam 爆款微型独立游戏自动化筛选工具")
    print("=======================================================")
    print(f"[*] 筛选条件: 发售年份 >= {args.min_year} | 评测数 >= {args.min_reviews:,} | 团队人数 <= {args.max_team} 人")
    print("[*] 正在加载并分析本地 SQLite 缓存与 Steam API 数据...")

    games = fetcher.get_filtered_games(
        min_year=args.min_year,
        min_reviews=args.min_reviews,
        max_team_size=args.max_team
    )

    if args.json:
        print(json.dumps(games, indent=2, ensure_ascii=False))
        return

    total = len(games)
    solo_count = sum(1 for g in games if g["team_size"] == 1)
    solo_pct = (solo_count / total * 100) if total > 0 else 0
    total_sales = sum(g["estimated_sales"] for g in games)

    print(f"\n[+] 成功筛选出 {total} 款爆款微型独立游戏:")
    print(f"    - 单人开发作品 (Solo Dev): {solo_count} 款 ({solo_pct:.1f}%)")
    print(f"    - 2-3 人微型团队作品:       {total - solo_count} 款")
    print(f"    - 累计预估总销量:           {total_sales / 1_000_000:.1f}M 套 (Boxleiter 40x 模型)\n")

    print(f"{'AppID':<9} | {'团队':<8} | {'好评率':<7} | {'预估销量':<12} | {'游戏名称':<26} | {'开发者'}")
    print("-" * 85)
    for g in games[:10]:
        t_label = f"{g['team_size']}人(Solo)" if g['team_size'] == 1 else f"{g['team_size']}人团队"
        print(f"{g['appid']:<9} | {t_label:<8} | {g['positive_rate']:>5.1f}% | {g['estimated_sales']:>10,} | {g['title'][:25]:<26} | {', '.join(g['developers'])[:20]}")
    if total > 10:
        print(f"... 以及另外 {total - 10} 款符合条件的游戏")

    print(f"\n[*] 正在渲染单文件交互式看板 -> {args.out} ...")
    out_path = generate_dashboard_html(games, output_file=args.out)
    print(f"[✔] 导出成功! 您可以直接用任意浏览器双击打开: {out_path}\n")


if __name__ == "__main__":
    main()
