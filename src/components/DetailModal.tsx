import React from "react";
import { SteamGame } from "../types";
import { X, ExternalLink, User, Users, ShieldCheck, Tag } from "lucide-react";

interface DetailModalProps {
  game: SteamGame | null;
  onClose: () => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({ game, onClose }) => {
  if (!game) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#1a1d24] border border-[#2d323c] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-black/90 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner with Close Button */}
        <div className="relative h-56 bg-[#0b0e14]">
          <img
            src={game.header_image}
            alt={game.title}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-[#0b0e14]/80 border border-[#2d323c] text-white flex items-center justify-center hover:bg-[#22272f] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Title & Badges */}
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-[#e9eaeb] tracking-tight">{game.title}</h2>
              <div className="text-xs text-[#8b929a] mt-0.5">
                开发者: {game.developers.join(", ")} | 发行商: {game.publishers.join(", ")} | AppID: {game.appid}
              </div>
            </div>

            <div>
              {game.team_size === 1 ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-[#10b98122] border border-[#10b98144] text-[#10b981]">
                  <User className="w-3.5 h-3.5" /> 1人 Solo Dev
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-[#3b82f622] border border-[#3b82f644] text-[#3b82f6]">
                  <Users className="w-3.5 h-3.5" /> {game.team_size}人 微型团队
                </span>
              )}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-3 bg-[#101218] p-3.5 rounded-xl border border-[#2d323c] text-xs">
            <div>
              <span className="text-[#8b929a] block text-[11px]">发售日期</span>
              <strong className="text-[#e9eaeb]">{game.release_date}</strong>
            </div>
            <div>
              <span className="text-[#8b929a] block text-[11px]">Steam 评测</span>
              <strong className="text-[#e9eaeb]">
                {game.reviews_count.toLocaleString()} 条 ({game.positive_rate}% 好评)
              </strong>
            </div>
            <div>
              <span className="text-[#8b929a] block text-[11px]">预估销量 (40x 模型)</span>
              <strong className="text-[#66c0f4] font-mono">~{game.estimated_sales.toLocaleString()} 份</strong>
            </div>
          </div>

          {/* Evidence Chain */}
          <div>
            <h4 className="text-xs font-bold text-[#8b929a] mb-1.5 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#10b981]" /> 团队规模判定证据链 (Evidence Trace):
            </h4>
            <div className="bg-[#101218] border border-[#2d323c] rounded-xl p-3.5 space-y-1.5">
              {game.evidence && game.evidence.length > 0 ? (
                game.evidence.map((ev, idx) => (
                  <div key={idx} className="text-xs text-[#e9eaeb] flex items-start gap-2">
                    <span className="text-[#10b981]">•</span>
                    <span>{ev}</span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-[#8b929a]">通过开发者独立署名与公开元数据推断</div>
              )}
            </div>
          </div>

          {/* Tags */}
          {game.tags && game.tags.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-[#8b929a] mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#66c0f4]" /> 标签与类别:
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {game.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#101218] border border-[#2d323c] text-[#8b929a]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-[#8b929a] mb-1.5">📖 游戏简介:</h4>
            <p className="text-xs text-[#8b929a] leading-relaxed bg-[#101218] p-3 rounded-lg border border-[#2d323c]">
              {game.description || "暂无详细简介"}
            </p>
          </div>

          {/* Action Links */}
          <div className="flex gap-3 pt-2">
            <a
              href={`https://store.steampowered.com/app/${game.appid}/`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-[#66c0f4] hover:bg-[#a3dcff] text-[#0b0e14] font-bold text-xs py-2.5 rounded-xl transition-colors shadow-md"
            >
              <span>前往 Steam 商店页</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href={`https://steamdb.info/app/${game.appid}/`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-1.5 bg-[#101218] hover:bg-[#22272f] border border-[#2d323c] text-[#e9eaeb] text-xs px-4 py-2.5 rounded-xl transition-colors"
            >
              <span>SteamDB 详情</span>
              <ExternalLink className="w-3 h-3 text-[#8b929a]" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
