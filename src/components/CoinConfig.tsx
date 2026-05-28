import React, { useState } from "react";
import { CoinConfig } from "../types";
import { Coins, Settings, Shield, Award, Cpu, FileText, Zap } from "lucide-react";

interface Props {
  onInitialize: (config: CoinConfig) => void;
  currentConfig: CoinConfig | null;
}

const PRESET_ICONS = [
  { char: "🪙", label: "عملة كلاسيكية" },
  { char: "💎", label: "أندلس / ألماس" },
  { char: "۞", label: "نجمة ثمانية" },
  { char: "⚡", label: "برق رقمي" },
  { char: "🌟", label: "نجم متألق" },
  { char: "👑", label: "سلطة ملكية" },
  { char: "🚀", label: "انطلاق سريع" },
  { char: "🌴", label: "بركة ونمو" },
  { char: "🦁", label: "قوة الأسد" },
  { char: "🧿", label: "عين الحكمة" },
];

const PRESET_COLORS = [
  { class: "text-amber-400 font-bold hover:scale-105 transition-transform", displayClass: "bg-amber-500", label: "الذهبي البراق", value: "text-amber-400" },
  { class: "text-emerald-400 font-bold hover:scale-105 transition-transform", displayClass: "bg-emerald-500", label: "الأخضر الزمردي", value: "text-emerald-400" },
  { class: "text-cyan-400 font-bold hover:scale-105 transition-transform", displayClass: "bg-cyan-500", label: "الأزرق النيوني", value: "text-cyan-400" },
  { class: "text-indigo-400 font-bold hover:scale-105 transition-transform", displayClass: "bg-indigo-505", label: "البنفسجي الملكي", value: "text-indigo-400" },
  { class: "text-rose-400 font-bold hover:scale-105 transition-transform", displayClass: "bg-rose-500", label: "الياقوتي الأحمر", value: "text-rose-400" },
];

export default function CoinConfigComponent({ onInitialize, currentConfig }: Props) {
  const [name, setName] = useState(currentConfig?.name || "ريال ثريا");
  const [symbol, setSymbol] = useState(currentConfig?.symbol || "TRY");
  const [consensus, setConsensus] = useState<CoinConfig["consensus"]>(
    currentConfig?.consensus || "Proof of Work"
  );
  const [totalSupply, setTotalSupply] = useState(currentConfig?.totalSupply || 100000000);
  const [blockReward, setBlockReward] = useState(currentConfig?.blockReward || 50);
  const [difficulty, setDifficulty] = useState(currentConfig?.difficulty || 2);
  const [description, setDescription] = useState(
    currentConfig?.description || "عملة رقمية لا مركزية لتسهيل المدفوعات السريعة ودعم الابتكار التقني."
  );
  const [iconSymbol, setIconSymbol] = useState(currentConfig?.iconSymbol || "🪙");
  const [iconColor, setIconColor] = useState(currentConfig?.iconColor || "text-amber-400");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onInitialize({
      name,
      symbol: symbol.toUpperCase().trim(),
      consensus,
      totalSupply,
      blockReward,
      difficulty,
      description,
      iconSymbol,
      iconColor,
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden" id="coin-config-container">
      {/* Glow Decorative Background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex items-center gap-3 mb-6" id="config-header">
        <div className="p-2.5 bg-gradient-to-br from-teal-400 to-blue-500 rounded-xl text-slate-900 shadow-md">
          <Coins className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white font-sans">معمارية وتصميم العملة الرقمية</h2>
          <p className="text-xs text-slate-400">حدد المعايير الأساسية لسك عملتك الرقمية وتوزيع رموزها الاقتصادية</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" id="coin-config-form">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Coin Name */}
          <div className="space-y-1.5" id="group-name">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-teal-400" />
              اسم العملة الرقمية (مثلاً: ريـال ثريا):
            </label>
            <input
              id="coin-name-input"
              type="text"
              required
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-teal-500 rounded-lg p-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all placeholder:text-slate-600"
              placeholder="مثال: عملة البركة"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Symbol */}
          <div className="space-y-1.5" id="group-symbol">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-teal-400" />
              رمز العملة (Ticker):
            </label>
            <input
              id="coin-symbol-input"
              type="text"
              required
              maxLength={6}
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-teal-500 rounded-lg p-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all uppercase placeholder:text-slate-600"
              placeholder="مثال: BRK"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
            />
          </div>

          {/* Brand Icon Symbol */}
          <div className="space-y-1.5 md:col-span-2 bg-slate-950/40 p-4 rounded-xl border border-slate-800/60" id="group-icon-picker">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1 flex-1">
                <label className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                  <span className={`text-lg p-1 rounded ${iconColor}`}>{iconSymbol}</span>
                  اختر رمز/أيقونة العملة الرقمية الفريد:
                </label>
                <span className="text-xs text-slate-500 block">
                  سيتم استخدام هذا الرمز/الحرف المميز في جميع أنحاء الشبكة (المعاملات، المحفظة، الكتل، والأسعار).
                </span>
                
                {/* Preset Icons Grid */}
                <div className="flex flex-wrap gap-2 pt-2" id="preset-icons-grid">
                  {PRESET_ICONS.map((preset) => (
                    <button
                      key={preset.char}
                      id={`preset-icon-btn-${preset.char}`}
                      type="button"
                      onClick={() => setIconSymbol(preset.char)}
                      className={`text-xl p-2.5 rounded-lg border transition-all cursor-pointer hover:bg-slate-900 ${
                        iconSymbol === preset.char
                          ? "border-teal-500 bg-teal-500/10 scale-110 shadow-lg shadow-teal-500/10"
                          : "border-slate-800 bg-slate-950/80"
                      }`}
                      title={preset.label}
                    >
                      {preset.char}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Icon Entry */}
              <div className="space-y-1.5 w-full md:w-44" id="custom-icon-entry">
                <label className="text-[11px] font-medium text-slate-400 block">أو اكتب رمزاً مخصصاً (حرف أو إيموجي):</label>
                <input
                  id="custom-coin-icon-input"
                  type="text"
                  maxLength={4}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-lg p-2.5 text-center text-white text-base focus:outline-none transition-all placeholder:text-slate-700 font-bold"
                  placeholder="مثال: ۞"
                  value={iconSymbol}
                  onChange={(e) => setIconSymbol(e.target.value.substring(0, 4))}
                />
              </div>
            </div>
          </div>

          {/* Brand Visual Identity Color */}
          <div className="space-y-1.5 md:col-span-2 bg-slate-950/40 p-4 rounded-xl border border-slate-800/60" id="group-color-picker">
            <label className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
              <span className={`w-3.5 h-3.5 rounded-full inline-block ${iconColor.replace("text-", "bg-")}`}></span>
              اختر الهوية البصرية واللون المضيء (Theme Glow):
            </label>
            <span className="text-xs text-slate-500 block">
              سيشكل هذا اللون المظهر العام لواجهة المحاكاة والتحليلات البيانية الذكية لعملتك.
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2" id="preset-colors-grid">
              {PRESET_COLORS.map((preset) => (
                <button
                  key={preset.value}
                  id={`preset-color-btn-${preset.value}`}
                  type="button"
                  onClick={() => setIconColor(preset.value)}
                  className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs text-right transition-all cursor-pointer ${
                    iconColor === preset.value
                      ? "border-slate-500 bg-slate-900 scale-[1.03] text-white"
                      : "border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-300"
                  }`}
                >
                  <span className={`w-3.5 h-3.5 rounded-full shrink-0 ${preset.displayClass}`}></span>
                  <span className="truncate font-sans">{preset.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Consensus Protocol */}
          <div className="space-y-1.5" id="group-consensus">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-blue-400" />
              آلية الإجماع والحوكمة (Consensus):
            </label>
            <select
              id="coin-consensus-select"
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-blue-500 rounded-lg p-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer"
              value={consensus}
              onChange={(e) => setConsensus(e.target.value as CoinConfig["consensus"])}
            >
              <option value="Proof of Work">إثبات العمل (Proof of Work - التعدين التنافسي)</option>
              <option value="Proof of Stake">إثبات الحصة (Proof of Stake - تجميد العملات مقابل أرباح)</option>
              <option value="Proof of Authority">إثبات السلطة (Proof of Authority - معتمد من حائزين)</option>
            </select>
          </div>

          {/* Total Supply */}
          <div className="space-y-1.5" id="group-supply">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              إجمالي المعروض الكلي (Max Supply):
            </label>
            <input
              id="coin-supply-input"
              type="number"
              required
              min={100}
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-teal-500 rounded-lg p-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all"
              value={totalSupply}
              onChange={(e) => setTotalSupply(Number(e.target.value))}
            />
          </div>

          {/* Block Reward */}
          <div className="space-y-1.5" id="group-reward">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-teal-400" />
              مكافأة تعدين الكتلة (Block Reward):
            </label>
            <input
              id="coin-reward-input"
              type="number"
              required
              min={0}
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-teal-500 rounded-lg p-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all"
              value={blockReward}
              onChange={(e) => setBlockReward(Number(e.target.value))}
            />
          </div>

          {/* Mining Difficulty */}
          <div className="space-y-1.5" id="group-difficulty">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-1.5">
              <Settings className="w-4 h-4 text-purple-400" />
              درجة صعوبة التعدين البدئية:
            </label>
            <div className="flex items-center gap-3" id="diff-slider-container">
              <input
                id="coin-difficulty-range"
                type="range"
                min={1}
                max={4}
                className="w-full accent-teal-400 cursor-pointer"
                value={difficulty}
                onChange={(e) => setDifficulty(Number(e.target.value))}
              />
              <span className="text-teal-400 font-bold bg-teal-500/10 px-3 py-1.5 rounded-lg border border-teal-500/20 text-xs text-nowrap">
                {difficulty} (تحتاج {difficulty} أصفار بالهاش)
              </span>
            </div>
          </div>
        </div>

        {/* Description/Goal */}
        <div className="space-y-1.5 animate-fadeIn" id="group-desc">
          <label className="text-sm font-medium text-slate-300 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-blue-400" />
            رسالة العملة وهدف المشروع (المدقّق الذكي سيقرأ هذا لتوجيهك):
          </label>
          <textarea
            id="coin-desc-input"
            rows={3}
            className="w-full bg-slate-950/80 border border-slate-800 focus:border-blue-500 rounded-lg p-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600 resize-none"
            placeholder="اشرح الغرض من عملتك والمشكلة التي تحلها لتوليد مراجعة اقتصادية متقدمة من الذكاء الاصطناعي..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Mint Button */}
        <div className="pt-3" id="action-mint-container">
          <button
            id="btn-mint-currency"
            type="submit"
            className="w-full bg-gradient-to-r from-teal-500 via-emerald-500 to-blue-500 hover:opacity-90 text-slate-950 font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg hover:shadow-teal-500/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Zap className="w-5 h-5 fill-slate-950" />
            <span className="font-sans">سك العملة الرقمية وبدء الشبكة الحية 🚀</span>
          </button>
        </div>
      </form>
    </div>
  );
}
