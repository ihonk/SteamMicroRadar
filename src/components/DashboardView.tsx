import React, { useState, useMemo } from "react";
import { SteamGame } from "../types";
import { Search, User, Users, Star, DollarSign, ExternalLink, Table as TableIcon, LayoutGrid, CheckCircle2, AlertCircle } from "lucide-react";

interface DashboardViewProps {
  games: SteamGame[];
  onSelectGame: (game: SteamGame) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ games, onSelectGame }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [teamFilter, setTeamFilter] = useState<"all" | "1" | "2-3">("all");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("sales_desc");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // KPI Calculations based on full or filtered dataset
  const filteredGames = useMemo(() => {
    return games
      .filter((game) => {
        // Team size filter
        if (teamFilter === "1" && game.team_size !== 1) return false;
        if (teamFilter === "2-3" && (game.team_size < 2 || game.team_size > 3)) return false;

        // Year filter
        if (yearFilter !== "all") {
          const y = parseInt(yearFilter, 10);
          if (game.release_year !== y && !game.release_date.includes(yearFilter)) {
            return false;
          }
        }

        // Search query
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const title = (game.title || "").toLowerCase();
          const devs = (game.developers || []).join(" ").toLowerCase();
          const evidence = (game.evidence || []).join(" ").toLowerCase();
          const desc = (game.description || "").toLowerCase();
          if (!title.includes(q) && !devs.includes(q) && !evidence.includes(q) && !desc.includes(q)) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "sales_desc") return (b.estimated_sales || 0) - (a.estimated_sales || 0);
        if (sortBy === "reviews_desc") return (b.reviews_count || 0) - (a.reviews_count || 0);
        if (sortBy === "rating_desc") return (b.positive_rate || 0) - (a.positive_rate || 0);
        if (sortBy === "date_desc") return (b.release_date || "").localeCompare(a.release_date || "");
        if (sortBy === "team_asc") return (a.team_size || 1) - (b.team_size || 1);
        return 0;
      });
  }, [games, teamFilter, yearFilter, searchTerm, sortBy]);

  const totalFiltered = filteredGames.length;
  const soloCount = filteredGames.filter((g) => g.team_size === 1).length;
  const soloRatio = totalFiltered > 0 ? ((soloCount / totalFiltered) * 100).toFixed(1) : "0";
  const avgRating = totalFiltered > 0 ? (filteredGames.reduce((acc, g) => acc + (g.positive_rate || 0), 0) / totalFiltered).toFixed(1) : "0";
  const totalSales = filteredGames.reduce((acc, g) => acc + (g.estimated_sales || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top KPI Metric Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Hits */}
        <div className="bg-[#1a1d24] p-4 rounded-xl border border-[#2d323c]">
          <div className="text-[#8b929a] text-xs uppercase font-semibold mb-1">Qualified Hits</div>
          <div className="text-3xl font-bold text-[#e9eaeb] tracking-tight">{totalFiltered}</div>
          <div className="text-xs text-[#10b981] mt-1 font-medium">近3年 2023+ 发售 · 评测 ≥2.5k</div>
        </div>

        {/* Card 2: Solo Dev Ratio */}
        <div className="bg-[#1a1d24] p-4 rounded-xl border border-[#2d323c]">
          <div className="text-[#8b929a] text-xs uppercase font-semibold mb-1">Solo Dev Velocity</div>
          <div className="text-3xl font-bold text-[#e9eaeb] tracking-tight">{soloRatio}%</div>
          <div className="text-xs text-[#8b929a] mt-1">共 {soloCount} 款游戏为 1 人独立打造</div>
        </div>

        {/* Card 3: Avg Positive Rating */}
        <div className="bg-[#1a1d24] p-4 rounded-xl border border-[#2d323c]">
          <div className="text-[#8b929a] text-xs uppercase font-semibold mb-1">Avg. User Rating</div>
          <div className="text-3xl font-bold text-[#e9eaeb] tracking-tight">{avgRating}%</div>
          <div className="text-xs text-[#66c0f4] mt-1 font-medium">Steam 特别好评 / 好评如潮</div>
        </div>

        {/* Card 4: Total Estimated Sales */}
        <div className="bg-[#1a1d24] p-4 rounded-xl border border-[#2d323c]">
          <div className="text-[#8b929a] text-xs uppercase font-semibold mb-1">Est. Revenue / Sales</div>
          <div className="text-3xl font-bold text-[#e9eaeb] tracking-tight">
            {(totalSales / 1_000_000).toFixed(1)}M <span className="text-sm font-normal text-[#8b929a]">份</span>
          </div>
          <div className="text-xs text-[#8b929a] mt-1 font-mono">Boxleiter 40x 换算模型</div>
        </div>
      </section>

      {/* Control Panel: Search, Filters, Sorters, View Switcher */}
      <div className="bg-[#101218] border border-[#2d323c] rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Search Box */}
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-[#8b929a] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search games, devs, keywords..."
            className="w-full bg-[#1a1d24] border border-[#2d323c] focus:border-[#66c0f4] text-[#e9eaeb] text-xs rounded-lg pl-9 pr-3 py-2 outline-none transition-colors placeholder:text-[#8b929a]"
          />
        </div>

        {/* Quick Team Size Pills */}
        <div className="flex items-center gap-1.5 bg-[#1a1d24] p-1 rounded-lg border border-[#2d323c]">
          <button
            onClick={() => setTeamFilter("all")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              teamFilter === "all" ? "bg-[#2d323c] text-white font-semibold" : "text-[#8b929a] hover:text-white"
            }`}
          >
            Team: All
          </button>
          <button
            onClick={() => setTeamFilter("1")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              teamFilter === "1"
                ? "bg-[#10b98122] text-[#10b981] border border-[#10b98144] font-semibold"
                : "text-[#8b929a] hover:text-white"
            }`}
          >
            Solo Dev (1人)
          </button>
          <button
            onClick={() => setTeamFilter("2-3")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              teamFilter === "2-3"
                ? "bg-[#3b82f622] text-[#3b82f6] border border-[#3b82f644] font-semibold"
                : "text-[#8b929a] hover:text-white"
            }`}
          >
            Team (2-3人)
          </button>
        </div>

        {/* Year Filter */}
        <select
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          className="bg-[#1a1d24] border border-[#2d323c] text-xs text-[#e9eaeb] rounded-lg px-3 py-2 outline-none cursor-pointer hover:bg-[#22272f] transition-colors"
        >
          <option value="all">Release: 2023-2026</option>
          <option value="2023">Release: 2023</option>
          <option value="2024">Release: 2024</option>
          <option value="2025">Release: 2025</option>
          <option value="2026">Release: 2026</option>
        </select>

        {/* Sorter */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-[#1a1d24] border border-[#2d323c] text-xs text-[#e9eaeb] rounded-lg px-3 py-2 outline-none cursor-pointer hover:bg-[#22272f] transition-colors"
        >
          <option value="sales_desc">Sort: Est. Sales (高到低)</option>
          <option value="reviews_desc">Sort: Reviews Count (多到少)</option>
          <option value="rating_desc">Sort: Rating (好评率)</option>
          <option value="date_desc">Sort: Release Date (最新)</option>
          <option value="team_asc">Sort: Team Size (少到多)</option>
        </select>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-[#1a1d24] p-1 rounded-lg border border-[#2d323c]">
          <button
            onClick={() => setViewMode("table")}
            className={`p-1.5 rounded-md ${viewMode === "table" ? "bg-[#2d323c] text-white" : "text-[#8b929a] hover:text-white"}`}
            title="表格视图"
          >
            <TableIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded-md ${viewMode === "grid" ? "bg-[#2d323c] text-white" : "text-[#8b929a] hover:text-white"}`}
            title="卡片视图"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {filteredGames.length === 0 ? (
        <div className="bg-[#1a1d24] border border-[#2d323c] rounded-xl p-12 text-center text-[#8b929a]">
          <AlertCircle className="w-8 h-8 text-[#f59e0b] mx-auto mb-2 opacity-80" />
          <p className="text-sm font-medium text-[#e9eaeb]">没有找到符合当前筛选条件的微型独立游戏</p>
          <p className="text-xs text-[#8b929a] mt-1">请尝试清除搜索词或切换团队规模/年份筛选器</p>
        </div>
      ) : viewMode === "table" ? (
        /* High-Density Data Table matching Sophisticated Dark Spec */
        <div className="bg-[#1a1d24] border border-[#2d323c] rounded-xl overflow-hidden shadow-xl flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#22272f] text-[#8b929a] text-[11px] uppercase font-bold tracking-wider border-b border-[#2d323c]">
                  <th className="py-3.5 px-4 font-bold">Game & Developer</th>
                  <th className="py-3.5 px-4 font-bold whitespace-nowrap">Release</th>
                  <th className="py-3.5 px-4 font-bold text-center whitespace-nowrap">Reviews (%)</th>
                  <th className="py-3.5 px-4 font-bold text-right whitespace-nowrap">Est. Sales</th>
                  <th className="py-3.5 px-4 font-bold">Team Logic</th>
                  <th className="py-3.5 px-4 font-bold text-center">Confidence</th>
                  <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2d323c]">
                {filteredGames.map((game) => (
                  <tr
                    key={game.appid}
                    onClick={() => onSelectGame(game)}
                    className="hover:bg-[#22272f] cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-8 bg-[#0b0e14] rounded border border-[#2d323c] overflow-hidden flex-shrink-0">
                          <img
                            src={game.header_image}
                            alt={game.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div>
                          <div className="font-bold text-sm text-[#e9eaeb] group-hover:text-[#66c0f4] transition-colors line-clamp-1">
                            {game.title}
                          </div>
                          <div className="text-xs text-[#8b929a]">
                            {game.developers.join(", ")}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-[#8b929a] whitespace-nowrap">
                      {game.release_date}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="text-sm font-bold text-[#e9eaeb]">
                        {game.reviews_count >= 1000
                          ? `${(game.reviews_count / 1000).toFixed(0)}k`
                          : game.reviews_count}
                      </div>
                      <div className="text-[10px] text-[#10b981] font-medium">
                        {game.positive_rate}% Positive
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-sm text-[#66c0f4] whitespace-nowrap">
                      {game.estimated_sales.toLocaleString()}+
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap items-center gap-2">
                        {game.team_size === 1 ? (
                          <span className="px-2 py-0.5 bg-[#10b98122] text-[#10b981] border border-[#10b98144] text-[10px] font-bold rounded uppercase">
                            Solo Dev
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-[#3b82f622] text-[#3b82f6] border border-[#3b82f644] text-[10px] font-bold rounded uppercase">
                            Team ({game.team_size})
                          </span>
                        )}
                        <span className="text-[11px] text-[#8b929a] line-clamp-1 max-w-[200px]">
                          {game.evidence && game.evidence.length > 0 ? game.evidence[0] : "独立开发者署名推断"}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block w-2 h-2 rounded-full ${
                          game.confidence === "High"
                            ? "bg-[#10b981] shadow-[0_0_8px_#10b981]"
                            : "bg-[#f59e0b] shadow-[0_0_8px_#f59e0b]"
                        }`}
                        title={`置信度: ${game.confidence}`}
                      />
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <a
                        href={`https://store.steampowered.com/app/${game.appid}/`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-[#8b929a] hover:text-white bg-[#0b0e14] hover:bg-[#22272f] border border-[#2d323c] px-2.5 py-1 rounded-md transition-colors"
                      >
                        <span>Steam</span>
                        <ExternalLink className="w-3 h-3 text-[#66c0f4]" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t border-[#2d323c] bg-[#101218] px-6 py-3 flex items-center justify-between text-xs text-[#8b929a]">
            <div>Showing {filteredGames.length} curated micro-indie titles</div>
            <div className="flex gap-4">
              <span>Source: Steam Store API</span>
              <span>Pipeline: <strong className="text-[#10b981]">Active</strong></span>
            </div>
          </div>
        </div>
      ) : (
        /* Visual Cards Grid matching Sophisticated Dark Spec */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredGames.map((game) => (
            <div
              key={game.appid}
              onClick={() => onSelectGame(game)}
              className="bg-[#1a1d24] border border-[#2d323c] hover:border-[#66c0f4] rounded-xl overflow-hidden flex flex-col cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl shadow-black/40 group"
            >
              <div className="relative h-40 bg-[#0b0e14] overflow-hidden">
                <img
                  src={game.header_image}
                  alt={game.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute top-2.5 right-2.5">
                  {game.team_size === 1 ? (
                    <span className="px-2 py-0.5 bg-[#10b981] text-[#0b0e14] text-[10px] font-bold rounded uppercase shadow">
                      Solo Dev
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-[#3b82f6] text-white text-[10px] font-bold rounded uppercase shadow">
                      Team ({game.team_size})
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-bold text-[#e9eaeb] group-hover:text-[#66c0f4] transition-colors text-base line-clamp-1">
                    {game.title}
                  </h3>
                  <p className="text-xs text-[#8b929a] mt-0.5">
                    {game.developers.join(", ")} · {game.release_date}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-[#101218] p-2.5 rounded-lg border border-[#2d323c] text-xs">
                  <div>
                    <span className="text-[#8b929a] block text-[11px]">Steam 评测</span>
                    <strong className="text-[#e9eaeb] font-medium">
                      {game.reviews_count.toLocaleString()} ({game.positive_rate}%)
                    </strong>
                  </div>
                  <div>
                    <span className="text-[#8b929a] block text-[11px]">预估销量 (40x)</span>
                    <strong className="text-[#66c0f4] font-mono font-bold">~{game.estimated_sales.toLocaleString()}</strong>
                  </div>
                </div>

                <div className="text-xs p-2.5 rounded-lg bg-[#101218] border border-[#2d323c] text-[#8b929a] flex items-center justify-between">
                  <span className="line-clamp-1">💡 {game.evidence && game.evidence.length > 0 ? game.evidence[0] : "独立署名"}</span>
                  <span
                    className={`inline-block w-2 h-2 rounded-full shrink-0 ml-2 ${
                      game.confidence === "High"
                        ? "bg-[#10b981] shadow-[0_0_8px_#10b981]"
                        : "bg-[#f59e0b] shadow-[0_0_8px_#f59e0b]"
                    }`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
