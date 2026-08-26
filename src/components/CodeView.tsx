import React, { useState, useEffect } from "react";
import { FileCode, Copy, Check, Download, Layers, ShieldCheck, Cpu } from "lucide-react";
import { PythonSourceFile } from "../types";
import { EMBEDDED_PYTHON_FILES } from "../data/pythonCodeData";

export const CodeView: React.FC = () => {
  const [files, setFiles] = useState<PythonSourceFile[]>(EMBEDDED_PYTHON_FILES);
  const [activeFileIndex, setActiveFileIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetch("/api/python-files")
      .then((res) => {
        if (!res.ok) throw new Error("API not available");
        return res.json();
      })
      .then((data) => {
        if (data.success && Array.isArray(data.files) && data.files.length > 0) {
          setFiles(data.files);
        }
      })
      .catch((e) => {
        // Fallback already in place from EMBEDDED_PYTHON_FILES
      });
  }, []);

  const handleCopy = () => {
    if (!files[activeFileIndex]) return;
    navigator.clipboard.writeText(files[activeFileIndex].content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const file = files[activeFileIndex];
    if (!file) return;
    const blob = new Blob([file.content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Architecture Flow Banner */}
      <div className="bg-[#1a1d24] border border-[#2d323c] rounded-xl p-5">
        <div className="flex items-center gap-2 text-xs font-bold text-[#66c0f4] mb-2">
          <Layers className="w-4 h-4" />
          <span>系统架构与模块设计 (SYSTEM ARCHITECTURE PIPELINE)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-3">
          <div className="bg-[#101218] border border-[#2d323c] rounded-lg p-3.5">
            <div className="text-xs font-bold text-[#66c0f4] mb-1 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" /> Module 1: fetcher.py
            </div>
            <p className="text-xs text-[#8b929a] leading-relaxed">
              • 近3年 (2023+) 与 Indie 标签初筛<br/>
              • 真实评测数 ≥ 2500 过滤<br/>
              • SQLite 缓存与防封频控 (Rate Limiter)
            </p>
          </div>

          <div className="bg-[#101218] border border-[#2d323c] rounded-lg p-3.5">
            <div className="text-xs font-bold text-[#10b981] mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Module 2: team_analyzer.py
            </div>
            <p className="text-xs text-[#8b929a] leading-relaxed">
              • 知名独立制作人知识库<br/>
              • 30+ 组中英文正则模式匹配<br/>
              • 置信度评估与证据链提取
            </p>
          </div>

          <div className="bg-[#101218] border border-[#2d323c] rounded-lg p-3.5">
            <div className="text-xs font-bold text-[#f59e0b] mb-1 flex items-center gap-1.5">
              <FileCode className="w-3.5 h-3.5" /> Module 3: html_exporter.py
            </div>
            <p className="text-xs text-[#8b929a] leading-relaxed">
              • 100% 独立单文件 HTML 渲染<br/>
              • Steam 极客暗黑主题 UI<br/>
              • 纯原生 JS 零依赖秒级交互
            </p>
          </div>
        </div>
      </div>

      {/* Code Viewer */}
      <div className="bg-[#1a1d24] border border-[#2d323c] rounded-xl overflow-hidden shadow-2xl">
        {/* Tab Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2 bg-[#101218] border-b border-[#2d323c] px-3 py-2">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {files.map((file, idx) => (
              <button
                key={file.name}
                onClick={() => setActiveFileIndex(idx)}
                className={`flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-md transition-colors ${
                  activeFileIndex === idx
                    ? "bg-[#2d323c] text-white border border-[#2d323c] font-bold shadow-sm"
                    : "text-[#8b929a] hover:text-white"
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>{file.name}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-xs text-[#8b929a] hover:text-white bg-[#1a1d24] hover:bg-[#2d323c] border border-[#2d323c] px-2.5 py-1 rounded-md transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3 h-3 text-[#10b981]" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? "已复制" : "复制代码"}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1 text-xs text-[#66c0f4] hover:text-white bg-[#1a1d24] hover:bg-[#2d323c] border border-[#2d323c] px-2.5 py-1 rounded-md transition-colors cursor-pointer"
            >
              <Download className="w-3 h-3" />
              <span>下载文件</span>
            </button>
          </div>
        </div>

        {/* File Description Bar */}
        {files[activeFileIndex] && (
          <div className="bg-[#101218] px-4 py-2 border-b border-[#2d323c] text-xs text-[#8b929a] flex items-center justify-between">
            <span>{files[activeFileIndex].description}</span>
            <span className="font-mono text-[11px] text-[#66c0f4]">{files[activeFileIndex].name}</span>
          </div>
        )}

        {/* Code Content */}
        <div className="p-4 bg-[#0b0e14] overflow-x-auto max-h-[600px] font-mono text-xs text-[#e9eaeb] leading-relaxed">
          {loading ? (
            <div className="py-8 text-center text-[#8b929a]">正在加载源码...</div>
          ) : (
            <pre>
              <code>{files[activeFileIndex]?.content || "// 文件内容为空"}</code>
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};
