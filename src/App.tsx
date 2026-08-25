import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { DashboardView } from "./components/DashboardView";
import { InsightsView } from "./components/InsightsView";
import { AnalyzerView } from "./components/AnalyzerView";
import { CodeView } from "./components/CodeView";
import { DetailModal } from "./components/DetailModal";
import { SteamGame } from "./types";
import { Loader2 } from "lucide-react";
import staticFallbackGames from "./staticGames.json";

export default function App() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "insights" | "analyzer" | "code">("dashboard");
  const [games, setGames] = useState<SteamGame[]>(staticFallbackGames as SteamGame[]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [selectedGame, setSelectedGame] = useState<SteamGame | null>(null);

  const fetchGames = async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);
    try {
      const url = showRefresh ? "/api/games?refresh=true" : "/api/games";
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }
      const data = await res.json();
      if (data.success && Array.isArray(data.games) && data.games.length > 0) {
        setGames(data.games);
      }
    } catch (e) {
      console.warn("API load failed, utilizing pre-bundled dataset fallback:", e);
      // Fallback is already initialized in state
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0e14] text-[#e9eaeb] flex flex-col selection:bg-[#66c0f4]/30 selection:text-white font-sans">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onRefreshData={() => fetchGames(true)}
        isRefreshing={isRefreshing}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-28 space-y-4">
            <Loader2 className="w-9 h-9 text-[#66c0f4] animate-spin" />
            <p className="text-sm text-[#8b929a] font-medium">
              正在运行 Steam 数据流水线与微型独立团队分析器...
            </p>
          </div>
        ) : (
          <>
            {activeTab === "dashboard" && (
              <DashboardView games={games} onSelectGame={(g) => setSelectedGame(g)} />
            )}
            {activeTab === "insights" && (
              <InsightsView games={games} onSelectGame={(g) => setSelectedGame(g)} />
            )}
            {activeTab === "analyzer" && <AnalyzerView />}
            {activeTab === "code" && <CodeView />}
          </>
        )}
      </main>

      {/* Detail Modal */}
      <DetailModal game={selectedGame} onClose={() => setSelectedGame(null)} />

      {/* Footer */}
      <footer className="border-t border-[#2d323c] bg-[#101218] py-4 text-center text-xs text-[#8b929a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-wrap items-center justify-between gap-2">
          <span>Steam Micro-Indie Radar © 2026 · 数据基于 Steam Store API 与 Boxleiter 40x 销量估算</span>
          <div className="flex items-center gap-4 text-[#8b929a]">
            <span>系统状态: <strong className="text-[#10b981] font-semibold">在线运行中</strong></span>
            <span className="font-mono text-[11px]">v2.5.0-stable</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
