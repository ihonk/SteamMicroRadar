import React, { useState } from "react";
import { SteamGame } from "../types";
import {
  Users,
  User,
  Sparkles,
  Gamepad2,
  TrendingUp,
  DollarSign,
  Compass,
  ArrowRight,
  ShieldCheck,
  Award,
  Layers,
  HeartHandshake,
  Dices,
  Coffee,
  Palette,
  Flame,
  Star
} from "lucide-react";

interface InsightsViewProps {
  games: SteamGame[];
  onSelectGame: (game: SteamGame) => void;
}

interface CategoryDefinition {
  id: string;
  name: string;
  enName: string;
  icon: any;
  color: string;
  badgeBg: string;
  description: string;
  keyFormula: string;
  gameAppIds: number[];
}

export const InsightsView: React.FC<InsightsViewProps> = ({ games, onSelectGame }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Define 5 Core Archetypes derived from the 21 filtered games
  const categories: CategoryDefinition[] = [
    {
      id: "coop",
      name: "社交联机与“开黑节目效果”类",
      enName: "Viral Co-op / Friendslop",
      icon: HeartHandshake,
      color: "#66c0f4",
      badgeBg: "bg-[#66c0f4]/15 text-[#66c0f4] border-[#66c0f4]/30",
      description:
        "利用近场语音(Proximity Chat)、基于物理的滑稽死亡、捉迷藏或连坐机制，天然适配 Twitch / YouTube / B站直播与短视频切片传播。美术偏低多边形或复古风格，90% 精力聚焦在网络同步与互动乐趣上。",
      keyFormula: "低门槛开黑 + 滑稽物理/社交连坐 + 直播自发病毒传播 + 轻量美术降本",
      gameAppIds: [1966720, 4704690, 4001890, 2881650], // Lethal Company, MECCHA CHAMELEON, How to Fish, Chained Together
    },
    {
      id: "rules",
      name: "规则驱动与微创新博弈类",
      enName: "Rules & Micro-Mechanics Deckbuilding",
      icon: Dices,
      color: "#f59e0b",
      badgeBg: "bg-[#f59e0b]/15 text-[#f59e0b] border-[#f59e0b]/30",
      description:
        "从大众熟悉的经典规则（德州扑克、俄罗斯轮盘、背包整理、找不同异常）做减法与机制突变。场景高度聚焦单屏或单一房间，以极其精密的数值与肉鸽反馈创造数百小时重玩价值。",
      keyFormula: "大众已有认知规则 + 机制变异与数值暴击 + 单场景极简制作 + 极高成瘾性",
      gameAppIds: [2379780, 2835570, 2427700, 2653790], // Balatro, Buckshot Roulette, Backpack Battles, The Exit 8
    },
    {
      id: "chill",
      name: "极简放置、治愈建造与微多任务类",
      enName: "Chill, Cozy & Desktop Idle",
      icon: Coffee,
      color: "#10b981",
      badgeBg: "bg-[#10b981]/15 text-[#10b981] border-[#10b981]/30",
      description:
        "主打“零压力(Zero-Stress)”与治愈感，无惩罚机制。通过技术/形态创新打破传统界面限制，如程序化无网格自由涂抹建筑，或首创屏幕底部多任务常驻伴侣挂机农场。",
      keyFormula: "零负反馈治愈 + 界面形态/程序化创新 + 现代人碎片化与多任务办公伴侣需求",
      gameAppIds: [2198150, 2666510], // Tiny Glade, Rusty's Retirement
    },
    {
      id: "auteur",
      name: "极致风格化单人叙事与动作类",
      enName: "Auteur-Style & Retro Precision",
      icon: Palette,
      color: "#a855f7",
      badgeBg: "bg-[#a855f7]/15 text-[#a855f7] border-[#a855f7]/30",
      description:
        "具备极其强烈的独立制作人作者印记(Auteur Style)。手绘逐帧狂气漫画风、全手绘炭笔素描多分支叙事、自研引擎物理光影银河城等，精准击中复古与硬核圈层的手感与审美。",
      keyFormula: "无可替代的美术/视听风格 + 极致打磨的操作手感 + 独特的悬疑/哲学世界观",
      gameAppIds: [2231450, 1989270, 813230, 2365810, 1996010], // Pizza Tower, Slay the Princess, Animal Well, Pseudoregalia, Crow Country
    },
    {
      id: "deepdive",
      name: "个人全能型深耕品类",
      enName: "Solo Hyper-Specialized Deep Dive",
      icon: Flame,
      color: "#ec4899",
      badgeBg: "bg-[#ec4899]/15 text-[#ec4899] border-[#ec4899]/30",
      description:
        "独狼制作人凭借在特定垂类数十年的狂热审美与技术积累，长期专注打磨单一题材（如中世纪写实拟真建造、二次元同人弹幕割草、极致手感肉鸽射击），细节与体量直逼甚至超越中型商业团队。",
      keyFormula: "垂直题材极致深耕 + 独狼全栈技术积累 + 社区早期长线透明开发与口碑沉淀",
      gameAppIds: [1363080, 2420510, 1966720, 2321470], // Manor Lords, HoloCure, etc.
    },
  ];

  // Helper to find games for category
  const getGamesForCategory = (cat: CategoryDefinition) => {
    return games.filter((g) => cat.gameAppIds.includes(g.appid));
  };

  // Team composition statistics
  const soloGames = games.filter((g) => g.team_size === 1);
  const duoGames = games.filter((g) => g.team_size === 2);
  const trioGames = games.filter((g) => g.team_size === 3);

  const totalSalesEstimated = games.reduce((acc, g) => acc + g.estimated_sales, 0);
  const avgPositiveRate = (
    games.reduce((acc, g) => acc + g.positive_rate, 0) / (games.length || 1)
  ).toFixed(1);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-[#1a1d24] border border-[#2d323c] rounded-xl p-6 relative overflow-hidden">
        <div className="max-w-4xl">
          <div className="flex items-center gap-2 text-xs font-bold text-[#66c0f4] mb-1.5 uppercase tracking-wider">
            <TrendingUp className="w-4 h-4" />
            <span>2023–2026 近3年微型独立游戏行业全景研报 (Market Insights & Taxonomy)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#e9eaeb] tracking-tight">
            爆款微型独立游戏（≤3人团队）分类归纳与成功驱动逻辑
          </h2>
          <p className="text-xs sm:text-sm text-[#8b929a] mt-2 leading-relaxed">
            基于当前雷达筛选出的 <strong className="text-white font-semibold">{games.length} 款</strong> 真实销量突破
            10 万至 1500 万套的现象级独立游戏，结合 Steam API 官方全语言评测、行业媒体报道与制作人公开访谈，梳理出 5 大成功玩法原型与开发协同模式。
          </p>
        </div>

        {/* Quick KPI stats in header */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-[#2d323c]">
          <div className="bg-[#101218] p-3 rounded-lg border border-[#2d323c]">
            <span className="text-[11px] text-[#8b929a] block">总分析爆款游戏</span>
            <span className="text-lg font-bold text-[#e9eaeb] font-mono">{games.length} 款</span>
          </div>
          <div className="bg-[#101218] p-3 rounded-lg border border-[#2d323c]">
            <span className="text-[11px] text-[#8b929a] block">单人开发 (Solo) 占比</span>
            <span className="text-lg font-bold text-[#10b981] font-mono">
              {((soloGames.length / (games.length || 1)) * 100).toFixed(1)}% ({soloGames.length}款)
            </span>
          </div>
          <div className="bg-[#101218] p-3 rounded-lg border border-[#2d323c]">
            <span className="text-[11px] text-[#8b929a] block">平均玩家好评率</span>
            <span className="text-lg font-bold text-[#66c0f4] font-mono">{avgPositiveRate}%</span>
          </div>
          <div className="bg-[#101218] p-3 rounded-lg border border-[#2d323c]">
            <span className="text-[11px] text-[#8b929a] block">累计总估算销量</span>
            <span className="text-lg font-bold text-[#f59e0b] font-mono">
              ~{(totalSalesEstimated / 1000000).toFixed(1)}M 套
            </span>
          </div>
        </div>
      </div>

      {/* Section 1: Five Core Gameplay Archetypes */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-[#e9eaeb] flex items-center gap-2">
              <Gamepad2 className="w-4 h-4 text-[#66c0f4]" /> 核心玩法与体验类型五大分类 (5 Gameplay Archetypes)
            </h3>
            <p className="text-xs text-[#8b929a] mt-0.5">
              点击下方分类卡片可筛选该类别下的代表作品，点击游戏可打开详细证据链与数据。
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#1a1d24] p-1 rounded-lg border border-[#2d323c]">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`text-xs px-3 py-1 rounded-md transition-colors ${
                selectedCategory === "all"
                  ? "bg-[#2d323c] text-white font-semibold"
                  : "text-[#8b929a] hover:text-white"
              }`}
            >
              全景展示
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`text-xs px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 ${
                  selectedCategory === c.id
                    ? "bg-[#2d323c] text-white font-semibold"
                    : "text-[#8b929a] hover:text-white"
                }`}
              >
                <span>{c.name.slice(0, 4)}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {categories
            .filter((cat) => selectedCategory === "all" || selectedCategory === cat.id)
            .map((cat, idx) => {
              const matchedGames = getGamesForCategory(cat);
              const CatIcon = cat.icon;
              return (
                <div
                  key={cat.id}
                  className="bg-[#1a1d24] border border-[#2d323c] rounded-xl p-5 hover:border-[#3b4350] transition-colors"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    {/* Left: Info */}
                    <div className="space-y-2.5 max-w-2xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                        >
                          <CatIcon className="w-4 h-4" />
                        </div>
                        <h4 className="text-sm font-bold text-[#e9eaeb]">{cat.name}</h4>
                        <span className="text-[11px] font-mono text-[#8b929a]">({cat.enName})</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${cat.badgeBg}`}>
                          收录 {matchedGames.length} 款代表作
                        </span>
                      </div>

                      <p className="text-xs text-[#8b929a] leading-relaxed">{cat.description}</p>

                      <div className="bg-[#101218] border border-[#2d323c] rounded-lg p-3 text-xs">
                        <span className="text-[#66c0f4] font-semibold">💡 核心成功公式：</span>
                        <span className="text-[#e9eaeb] ml-1">{cat.keyFormula}</span>
                      </div>
                    </div>

                    {/* Right: Featured Games Grid */}
                    <div className="lg:w-80 shrink-0">
                      <span className="text-[11px] font-semibold text-[#8b929a] block mb-2">
                        代表爆款作品 (点击可查看详情):
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                        {matchedGames.map((game) => (
                          <div
                            key={game.appid}
                            onClick={() => onSelectGame(game)}
                            className="bg-[#101218] hover:bg-[#161a22] border border-[#2d323c] hover:border-[#66c0f4]/50 rounded-lg p-2.5 flex items-center gap-3 cursor-pointer transition-all group"
                          >
                            <img
                              src={game.header_image}
                              alt={game.title}
                              className="w-14 h-8 object-cover rounded shrink-0 bg-[#0b0e14]"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-bold text-[#e9eaeb] group-hover:text-[#66c0f4] truncate transition-colors">
                                {game.title}
                              </div>
                              <div className="text-[10px] text-[#8b929a] flex items-center gap-2 mt-0.5">
                                <span>{game.team_size === 1 ? "1人(Solo)" : `${game.team_size}人团队`}</span>
                                <span>•</span>
                                <span className="text-[#10b981] font-mono">{game.positive_rate}% 好评</span>
                              </div>
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 text-[#8b929a] group-hover:text-white transition-colors" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Section 2: Team Size Structure Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3">
          <h3 className="text-base font-bold text-[#e9eaeb] flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-[#10b981]" /> 团队规模结构分析 (Solo vs. Duo vs. Trio)
          </h3>
          <p className="text-xs text-[#8b929a]">
            通过对 21 款爆款的研发组织形式分析，微型独立团队呈现出极高的结构规律性：
          </p>
        </div>

        {/* Solo Card */}
        <div className="bg-[#1a1d24] border border-[#2d323c] rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-md bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30">
                <User className="w-3.5 h-3.5" /> 1人 Solo Dev (独狼制作)
              </span>
              <span className="text-lg font-bold font-mono text-[#10b981]">
                {((soloGames.length / games.length) * 100).toFixed(0)}%
              </span>
            </div>
            <h4 className="text-sm font-bold text-[#e9eaeb] mb-1.5">全栈独狼 · 极速迭代 · 零沟通成本</h4>
            <p className="text-xs text-[#8b929a] leading-relaxed">
              <strong>核心优势：</strong>决策链为 0，程序/玩法一把抓，美术多使用现成资产或故意采用复古风格规避短板。
              在宣发层面，“单人开发”本身已成为 Steam 和社交媒体上最具自传播力与粉丝号召力的标签。
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#2d323c] text-[11px] text-[#8b929a]">
            代表作品: <span className="text-white">Lethal Company, Balatro, Manor Lords, 8番出口, MECCHA CHAMELEON</span>
          </div>
        </div>

        {/* Duo Card */}
        <div className="bg-[#1a1d24] border border-[#2d323c] rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-md bg-[#3b82f6]/15 text-[#3b82f6] border border-[#3b82f6]/30">
                <Users className="w-3.5 h-3.5" /> 2人 Duo Team (双人搭档)
              </span>
              <span className="text-lg font-bold font-mono text-[#3b82f6]">
                {((duoGames.length / games.length) * 100).toFixed(0)}%
              </span>
            </div>
            <h4 className="text-sm font-bold text-[#e9eaeb] mb-1.5">黄金组合：1位全职程序 + 1位美术/策划</h4>
            <p className="text-xs text-[#8b929a] leading-relaxed">
              <strong>核心优势：</strong>最具性价比与艺术上限的组织形态。多为夫妻档（Slay the Princess）、兄弟档（Crow Country）或长期密友（Pizza Tower、How to Fish）。一人负责底层工程与逻辑，一人负责视觉与内容。
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#2d323c] text-[11px] text-[#8b929a]">
            代表作品: <span className="text-white">Pizza Tower, Slay the Princess, Tiny Glade, Backpack Battles, How to Fish</span>
          </div>
        </div>

        {/* Trio Card */}
        <div className="bg-[#1a1d24] border border-[#2d323c] rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-md bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/30">
                <Layers className="w-3.5 h-3.5" /> 3人 Micro Studio (微型工作室)
              </span>
              <span className="text-lg font-bold font-mono text-[#f59e0b]">
                {((trioGames.length / games.length) * 100).toFixed(0)}%
              </span>
            </div>
            <h4 className="text-sm font-bold text-[#e9eaeb] mb-1.5">小作坊快速冲刺 · 具备完整3D工程底子</h4>
            <p className="text-xs text-[#8b929a] leading-relaxed">
              <strong>核心优势：</strong>程序、美术与关卡设计师明确分工。能在 6-12 个月内快速冲刺出一款具备成熟 3D 动作与多人联机架构的商业化完整游戏。
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#2d323c] text-[11px] text-[#8b929a]">
            代表作品: <span className="text-white">Chained Together, Deep Rock Galactic: Survivor</span>
          </div>
        </div>
      </div>

      {/* Section 3: Commercial Patterns & Key Takeaways */}
      <div className="bg-[#1a1d24] border border-[#2d323c] rounded-xl p-6">
        <h3 className="text-base font-bold text-[#e9eaeb] flex items-center gap-2 mb-4">
          <DollarSign className="w-4 h-4 text-[#f59e0b]" /> 商业定价策略与三大底层规律 (Commercial Takeaways)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#101218] border border-[#2d323c] rounded-lg p-4">
            <div className="text-xs font-bold text-[#66c0f4] mb-1">1. 定价精准卡位：低门槛快速破圈</div>
            <p className="text-xs text-[#8b929a] leading-relaxed">
              绝大部分爆款集中在 <strong>$2.99 ～ $14.99</strong>：
              <br />• <strong>$2.99 - $6.99 (冲动消费区)</strong>: 如《8番出口》、《Buckshot》、《How to Fish》，几乎无需犹豫即可下单；
              <br />• <strong>$9.99 - $14.99 (甜点区)</strong>: 如《Lethal Company》、《Balatro》，兼顾口碑与惊人的商业利润率。
            </p>
          </div>

          <div className="bg-[#101218] border border-[#2d323c] rounded-lg p-4">
            <div className="text-xs font-bold text-[#10b981] mb-1">2. 极高口碑护城河：平均好评 93.8%</div>
            <p className="text-xs text-[#8b929a] leading-relaxed">
              玩家对微型团队作品天然具备“情感宽容度”与“支持心态”。只要核心玩法独创且恶性 BUG 极少，极易形成 Steam 算法最喜欢的
              <strong>“好评如潮 (Overwhelmingly Positive)”</strong> 推荐飞轮。
            </p>
          </div>

          <div className="bg-[#101218] border border-[#2d323c] rounded-lg p-4">
            <div className="text-xs font-bold text-[#a855f7] mb-1">3. 开发者叙事：一人开发即是顶级宣发</div>
            <p className="text-xs text-[#8b929a] leading-relaxed">
              在游戏同质化的当下，<strong>“由一人在地下室耗时 2 年敲出”</strong> 的真实幕后故事比千万级广告更打动人。各大游戏媒体、B 站与 YouTube UP 主更乐意为这种“传奇独狼”免费背书。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
