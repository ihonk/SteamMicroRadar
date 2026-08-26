import React, { useState } from "react";
import { Terminal, Search, Sparkles, CheckCircle2, AlertTriangle, Play, HelpCircle } from "lucide-react";
import { AnalysisResult } from "../types";
import { clientSideAnalyzeText } from "../data/pythonCodeData";

export const AnalyzerView: React.FC = () => {
  const [mode, setMode] = useState<"text" | "appid">("text");

  // Text test state
  const [devInput, setDevInput] = useState("LocalThunk");
  const [pubInput, setPubInput] = useState("Playstack");
  const [descInput, setDescInput] = useState(
    "Balatro is a poker roguelike where you play illegal poker hands. Created entirely by solo developer LocalThunk over 2.5 years."
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  // AppID test state
  const [appIdInput, setAppIdInput] = useState("2379780");
  const [appIdOutput, setAppIdOutput] = useState<string | null>(null);
  const [isAppIdLoading, setIsAppIdLoading] = useState(false);

  const sampleCases = [
    {
      title: "《Balatro》- 单人开发 (Solo)",
      dev: "LocalThunk",
      pub: "Playstack",
      desc: "Balatro is a poker roguelike. Created entirely by solo developer LocalThunk over 2.5 years.",
      appid: 2379780
    },
    {
      title: "《Tiny Glade》- 双人团队 (Duo)",
      dev: "Pounce Light",
      pub: "Pounce Light",
      desc: "Tiny Glade is a small relaxing game about doodling castles. Developed by a two-person team (Anastasia Opara and Tomasz Stachowiak).",
      appid: 2198150
    },
    {
      title: "《Chained Together》- 3人团队 (Trio)",
      dev: "Anegar Games",
      pub: "Anegar Games",
      desc: "From the depths of hell, climb chained with your friends. Made by a 3-person indie developer team from Turkey.",
      appid: 2881650
    },
    {
      title: "《大中型团队RPG》- 排除非微型游戏",
      dev: "MegaCorp Studios",
      pub: "Big Publisher",
      desc: "Our passionate studio team of 45 veteran game developers crafted this massive open world RPG.",
      appid: 0
    }
  ];

  const handleAnalyzeText = async () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    try {
      const res = await fetch("/api/analyze-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          developers: devInput,
          publishers: pubInput,
          description: descInput
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setAnalysisResult(data.result);
          return;
        }
      }
      // If API fails or 404 (GitHub Pages static host), run client-side engine
      const clientRes = clientSideAnalyzeText(devInput, pubInput, descInput);
      setAnalysisResult(clientRes);
    } catch (e: any) {
      // Run client-side analysis engine fallback
      const clientRes = clientSideAnalyzeText(devInput, pubInput, descInput);
      setAnalysisResult(clientRes);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyzeAppId = async () => {
    if (!appIdInput.trim()) return;
    setIsAppIdLoading(true);
    setAppIdOutput(null);
    try {
      const res = await fetch(`/api/analyze-appid?appid=${appIdInput.trim()}`);
      const data = await res.json();
      if (data.success) {
        setAppIdOutput(data.output);
      } else {
        setAppIdOutput("Error: " + (data.error || "Steam API 请求失败"));
      }
    } catch (e: any) {
      setAppIdOutput("Exception: " + e.message);
    } finally {
      setIsAppIdLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#1a1d24] border border-[#2d323c] rounded-xl p-5 relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-bold text-[#66c0f4] mb-1">
            <Terminal className="w-4 h-4" />
            <span>MODULE 2: 团队规模分析器沙盒 (TEAM SIZE ANALYZER SANDBOX)</span>
          </div>
          <h2 className="text-xl font-bold text-[#e9eaeb] tracking-tight">
            Steam 商店元数据与文本证据链智能挖掘引擎
          </h2>
          <p className="text-xs text-[#8b929a] mt-1.5 leading-relaxed">
            结合【知名独立制作人知识库】+【中英文多层正则挖掘】+【实体排他统计】三大算法，自动从 Steam 商店
            About The Game、开发者署名等海量杂乱文本中抽取出最精准的核心团队人数依据。
          </p>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="flex items-center gap-2 border-b border-[#2d323c] pb-3">
        <button
          onClick={() => setMode("text")}
          className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors ${
            mode === "text"
              ? "bg-[#2d323c] text-white font-semibold"
              : "text-[#8b929a] hover:text-white bg-[#1a1d24] border border-[#2d323c]"
          }`}
        >
          📝 文本与元数据正则测试 (Regex & NLP Text Sandbox)
        </button>
        <button
          onClick={() => setMode("appid")}
          className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors ${
            mode === "appid"
              ? "bg-[#2d323c] text-white font-semibold"
              : "text-[#8b929a] hover:text-white bg-[#1a1d24] border border-[#2d323c]"
          }`}
        >
          🎮 Steam 实时 AppID 扫描 (Live AppID Inspection)
        </button>
      </div>

      {/* Quick Test Presets */}
      <div className="bg-[#1a1d24] border border-[#2d323c] rounded-xl p-3.5">
        <span className="text-xs text-[#8b929a] font-medium mr-2">快速填充测试用例:</span>
        <div className="inline-flex flex-wrap gap-2 mt-1 sm:mt-0">
          {sampleCases.map((sc, i) => (
            <button
              key={i}
              onClick={() => {
                setDevInput(sc.dev);
                setPubInput(sc.pub);
                setDescInput(sc.desc);
                if (sc.appid) setAppIdInput(String(sc.appid));
              }}
              className="text-[11px] bg-[#101218] hover:bg-[#22272f] border border-[#2d323c] text-[#e9eaeb] px-2.5 py-1 rounded-md transition-colors"
            >
              {sc.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Sandbox Area */}
      {mode === "text" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Form */}
          <div className="lg:col-span-7 space-y-4 bg-[#1a1d24] border border-[#2d323c] rounded-xl p-5">
            <h3 className="text-sm font-bold text-[#e9eaeb] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#66c0f4]" /> 输入游戏元数据与商店文本
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-[#8b929a] block mb-1">
                  开发者 (Developers 字段)
                </label>
                <input
                  type="text"
                  value={devInput}
                  onChange={(e) => setDevInput(e.target.value)}
                  placeholder="例如: LocalThunk"
                  className="w-full bg-[#101218] border border-[#2d323c] text-xs text-[#e9eaeb] rounded-lg px-3 py-2 outline-none focus:border-[#66c0f4]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#8b929a] block mb-1">
                  发行商 (Publishers 字段)
                </label>
                <input
                  type="text"
                  value={pubInput}
                  onChange={(e) => setPubInput(e.target.value)}
                  placeholder="例如: Playstack"
                  className="w-full bg-[#101218] border border-[#2d323c] text-xs text-[#e9eaeb] rounded-lg px-3 py-2 outline-none focus:border-[#66c0f4]"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#8b929a] block mb-1">
                商店描述 / 致谢致辞 (About the Game / Credits Text)
              </label>
              <textarea
                rows={5}
                value={descInput}
                onChange={(e) => setDescInput(e.target.value)}
                placeholder="粘贴 Steam 商店详情中的介绍文本..."
                className="w-full bg-[#101218] border border-[#2d323c] text-xs text-[#e9eaeb] rounded-lg p-3 outline-none focus:border-[#66c0f4] font-mono leading-relaxed placeholder:text-[#8b929a]"
              />
            </div>

            <button
              onClick={handleAnalyzeText}
              disabled={isAnalyzing}
              className="w-full flex items-center justify-center gap-2 bg-[#66c0f4] hover:bg-[#a3dcff] text-[#0b0e14] font-bold text-xs py-2.5 rounded-lg transition-colors shadow-md cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              {isAnalyzing ? "正在运行 Python 正则挖掘..." : "立即执行团队规模判定 (Run Analyzer)"}
            </button>
          </div>

          {/* Right Result Card */}
          <div className="lg:col-span-5 bg-[#1a1d24] border border-[#2d323c] rounded-xl p-5 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#e9eaeb] mb-3 flex items-center justify-between">
                <span>判定结果 (Analysis Output)</span>
                {analysisResult && (
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded font-bold ${
                      analysisResult.is_micro
                        ? "bg-[#10b98122] text-[#10b981] border border-[#10b98144]"
                        : "bg-[#f43f5e22] text-[#f43f5e] border border-[#f43f5e44]"
                    }`}
                  >
                    {analysisResult.is_micro ? "符合 ≤3人 微型独立条件" : "不符合微型标准 (>3人)"}
                  </span>
                )}
              </h3>

              {analysisResult ? (
                <div className="space-y-4">
                  {/* Big Metric Badge */}
                  <div className="bg-[#101218] border border-[#2d323c] rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-[#8b929a]">预估核心研发人数</span>
                      <div className="text-3xl font-extrabold text-[#e9eaeb] mt-0.5 font-mono">
                        {analysisResult.team_size}{" "}
                        <span className="text-sm font-normal text-[#8b929a]">
                          人 {analysisResult.team_size === 1 ? "(Solo)" : "团队"}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-[#8b929a]">置信度评级</span>
                      <div
                        className={`text-sm font-bold mt-1 flex items-center gap-1.5 justify-end ${
                          analysisResult.confidence === "High"
                            ? "text-[#10b981]"
                            : analysisResult.confidence === "Medium"
                            ? "text-[#f59e0b]"
                            : "text-[#8b929a]"
                        }`}
                      >
                        <span
                          className={`inline-block w-2 h-2 rounded-full ${
                            analysisResult.confidence === "High"
                              ? "bg-[#10b981] shadow-[0_0_8px_#10b981]"
                              : "bg-[#f59e0b] shadow-[0_0_8px_#f59e0b]"
                          }`}
                        />
                        <span>{analysisResult.confidence === "High" ? "高置信度 (High)" : "中置信度 (Medium)"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Evidence Breakdown */}
                  <div>
                    <h4 className="text-xs font-semibold text-[#8b929a] mb-1.5">🎯 匹配到的关键证据链:</h4>
                    <div className="space-y-1.5">
                      {analysisResult.evidence.map((ev, idx) => (
                        <div
                          key={idx}
                          className="bg-[#101218] border border-[#2d323c] rounded-lg p-2.5 text-xs text-[#e9eaeb] flex items-start gap-2"
                        >
                          <CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0 mt-0.5" />
                          <span>{ev}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-[#101218] border border-[#2d323c] rounded-xl p-8 text-center text-[#8b929a] text-xs">
                  <HelpCircle className="w-8 h-8 mx-auto mb-2 opacity-50 text-[#66c0f4]" />
                  点击左侧按钮，即可触发 `team_analyzer.py` 的多维正则提取与证据追溯。
                </div>
              )}
            </div>

            <div className="text-[11px] text-[#8b929a] border-t border-[#2d323c] pt-3 mt-4">
              支持匹配中英文关键词：<code className="text-[#66c0f4]">solo dev</code>, <code className="text-[#66c0f4]">made by 1 person</code>, <code className="text-[#66c0f4]">team of 2</code>, <code className="text-[#66c0f4]">单人开发</code>, <code className="text-[#66c0f4]">二人团队</code> 等 30+ 种模式。
            </div>
          </div>
        </div>
      ) : (
        /* AppID Mode */
        <div className="bg-[#1a1d24] border border-[#2d323c] rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-[#e9eaeb] flex items-center gap-2">
            <Search className="w-4 h-4 text-[#66c0f4]" /> 实时在线拉取 Steam Store API 并进行深度审计
          </h3>

          <div className="flex gap-3 max-w-xl">
            <input
              type="number"
              value={appIdInput}
              onChange={(e) => setAppIdInput(e.target.value)}
              placeholder="输入 Steam AppID (如 2379780)..."
              className="flex-1 bg-[#101218] border border-[#2d323c] text-xs text-[#e9eaeb] rounded-lg px-3 py-2.5 outline-none focus:border-[#66c0f4]"
            />
            <button
              onClick={handleAnalyzeAppId}
              disabled={isAppIdLoading}
              className="bg-[#66c0f4] hover:bg-[#a3dcff] text-[#0b0e14] font-bold text-xs px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
            >
              {isAppIdLoading ? "正在请求 Steam API..." : "查询并分析"}
            </button>
          </div>

          {appIdOutput && (
            <div className="mt-4">
              <span className="text-xs font-semibold text-[#8b929a] block mb-1">Python CLI 终端返回结果:</span>
              <pre className="bg-[#101218] border border-[#2d323c] rounded-lg p-4 font-mono text-xs text-[#66c0f4] overflow-x-auto whitespace-pre-wrap leading-relaxed">
                {appIdOutput}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
