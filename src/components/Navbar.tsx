import React from "react";
import { LayoutDashboard, TrendingUp, Terminal, FileCode, Download, RefreshCw } from "lucide-react";

interface NavbarProps {
  activeTab: "dashboard" | "insights" | "analyzer" | "code";
  setActiveTab: (tab: "dashboard" | "insights" | "analyzer" | "code") => void;
  onRefreshData?: () => void;
  isRefreshing?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onRefreshData,
  isRefreshing
}) => {
  return (
    <header className="border-b border-[#2d323c] bg-[#101218] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Left: Branding */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-[#66c0f4] to-[#1b2838] border border-[#2d323c] flex items-center justify-center shadow-sm">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-[#e9eaeb] tracking-tight">
                Steam Micro-Indie <span className="text-[#66c0f4]">Radar</span>
              </h1>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-[#1a1d24] border border-[#2d323c] text-[#8b929a]">
                v2.5.0
              </span>
            </div>
            <p className="text-xs text-[#8b929a] hidden sm:block">
              2023-2026 近3年 · 核心团队 ≤ 3 人 · 销量 ≥ 10 万套 (评测 ≥ 2500)
            </p>
          </div>
        </div>

        {/* Center: Tabs */}
        <nav className="flex items-center gap-1.5 bg-[#1a1d24] p-1 rounded-lg border border-[#2d323c]">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === "dashboard"
                ? "bg-[#2d323c] text-white shadow-sm font-semibold"
                : "text-[#8b929a] hover:text-[#e9eaeb] hover:bg-[#22272f]"
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            数据看板
          </button>

          <button
            onClick={() => setActiveTab("insights")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === "insights"
                ? "bg-[#2d323c] text-white shadow-sm font-semibold"
                : "text-[#8b929a] hover:text-[#e9eaeb] hover:bg-[#22272f]"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-[#66c0f4]" />
            爆款分类与研报
          </button>

          <button
            onClick={() => setActiveTab("analyzer")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === "analyzer"
                ? "bg-[#2d323c] text-white shadow-sm font-semibold"
                : "text-[#8b929a] hover:text-[#e9eaeb] hover:bg-[#22272f]"
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            团队规模判定测试
          </button>

          <button
            onClick={() => setActiveTab("code")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === "code"
                ? "bg-[#2d323c] text-white shadow-sm font-semibold"
                : "text-[#8b929a] hover:text-[#e9eaeb] hover:bg-[#22272f]"
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            Python 源码与架构
          </button>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {onRefreshData && (
            <button
              onClick={onRefreshData}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 text-xs text-[#8b929a] hover:text-white bg-[#1a1d24] hover:bg-[#2d323c] border border-[#2d323c] px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              title="重新运行 Python 流水线拉取数据"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-[#66c0f4]" : ""}`} />
              <span className="hidden md:inline">{isRefreshing ? "分析中..." : "重新运行"}</span>
            </button>
          )}

          <a
            href="/api/download-dashboard"
            download="steam_micro_indies_dashboard.html"
            className="flex items-center gap-1.5 text-xs font-semibold bg-[#10b981] hover:bg-[#059669] text-[#0b0e14] px-3.5 py-1.5 rounded-lg shadow-sm transition-all cursor-pointer"
            title="下载 100% 独立的单文件 HTML 看板 (双击即开，零外部依赖)"
          >
            <Download className="w-3.5 h-3.5" />
            <span>导出独立 HTML</span>
          </a>
        </div>
      </div>
    </header>
  );
};
