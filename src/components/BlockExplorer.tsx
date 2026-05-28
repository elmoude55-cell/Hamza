import React, { useState, useEffect, useRef } from "react";
import { Block, Transaction, CoinConfig } from "../types";
import { calculateHash, isValidHash } from "../blockchainUtils";
import { Cpu, Server, Layers, Link, ShieldAlert, Award, Play, AlertCircle, HelpCircle, RefreshCcw, ThumbsUp, Lock, Unlock, Clock } from "lucide-react";

interface Props {
  blocks: Block[];
  pendingTransactions: Transaction[];
  config: CoinConfig;
  onBlockMined: (block: Block) => void;
  lastMinedTime: number;
  onUpdateMinedTime: (time: number) => void;
  isSubscribed: boolean;
  onRequestSubscribe: () => void;
}

export default function BlockExplorerComponent({
  blocks,
  pendingTransactions,
  config,
  onBlockMined,
  lastMinedTime,
  onUpdateMinedTime,
  isSubscribed,
  onRequestSubscribe,
}: Props) {
  const [isMining, setIsMining] = useState(false);
  const [miningNonce, setMiningNonce] = useState(0);
  const [miningHash, setMiningHash] = useState("");
  const [hashesCount, setHashesCount] = useState(0);
  const [searchHistory, setSearchHistory] = useState<{nonce: number, hash: string}[]>([]);
  
  // 12-Hour Cooldown control configurations & override for instant developer QA
  const [bypassCooldown, setBypassCooldown] = useState(false);
  const [timeLeftStr, setTimeLeftStr] = useState("");

  const activeCooldownMs = 12 * 60 * 60 * 1000; // 12 Hours Cooldown
  const secondsAllowed = lastMinedTime + activeCooldownMs;
  const isCooldownActive = !bypassCooldown && Date.now() < secondsAllowed;

  useEffect(() => {
    const updateTimer = () => {
      const remainingMs = secondsAllowed - Date.now();
      if (remainingMs <= 0 || bypassCooldown) {
        setTimeLeftStr("");
      } else {
        const hours = Math.floor(remainingMs / (1000 * 60 * 60));
        const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);
        setTimeLeftStr(`${hours} ساعة و ${minutes} دقيقة و ${seconds} ثانية`);
      }
    };
    
    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [lastMinedTime, bypassCooldown]);

  const miningTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Stop mining if config changes or component unmounts
  useEffect(() => {
    return () => {
      if (miningTimerRef.current) {
        clearInterval(miningTimerRef.current);
      }
    };
  }, []);

  const handleStartMining = () => {
    if (!isSubscribed) {
      onRequestSubscribe();
      return;
    }

    if (isCooldownActive) {
      alert(`الرجاء انتظار خطوة الحماية من تكرار التعدين (تأمين 12 ساعة)! متبقي: ${timeLeftStr}`);
      return;
    }

    if (isMining) {
      // Pause
      if (miningTimerRef.current) clearInterval(miningTimerRef.current);
      setIsMining(false);
      return;
    }

    setIsMining(true);
    setHashesCount(0);
    setSearchHistory([]);

    const previousBlock = blocks[blocks.length - 1];
    const previousHash = previousBlock ? previousBlock.hash : "0".repeat(64);
    const nextIndex = blocks.length;
    const nextTimestamp = new Date().toLocaleTimeString("ar-SA", { hour12: false });

    // Prepend a Coinbase Transaction for the miner reward
    const coinbaseTx: Transaction = {
      id: `cb-${Date.now()}`,
      sender: "جائزة تعدين الكتلة (Coinbase)",
      recipient: "المطور (أنت)",
      amount: config.blockReward,
      timestamp: nextTimestamp,
    };

    const blockTransactions = [coinbaseTx, ...pendingTransactions];
    let currentNonce = 0;

    // Fast simulation loop (updates state every 30ms so users can see the hashing power!)
    miningTimerRef.current = setInterval(() => {
      // Run several hashes per frame for speed
      let found = false;
      let finalHash = "";
      let finalNonce = 0;
      
      const batchSize = 15; // Calculate 15 hashes per frame to avoid lag but keep it super fast
      const localHistory: {nonce: number, hash: string}[] = [];

      for (let i = 0; i < batchSize; i++) {
        const testNonce = currentNonce + i;
        const hash = calculateHash(
          nextIndex,
          nextTimestamp,
          blockTransactions,
          testNonce,
          previousHash
        );

        if (i < 3) {
          localHistory.push({ nonce: testNonce, hash });
        }

        if (isValidHash(hash, config.difficulty)) {
          found = true;
          finalHash = hash;
          finalNonce = testNonce;
          break;
        }
      }

      currentNonce += batchSize;
      setMiningNonce(currentNonce);
      setHashesCount((prev) => prev + batchSize);
      
      if (localHistory.length > 0) {
        setSearchHistory((prev) => [...localHistory.slice(0, 3), ...prev].slice(0, 5));
      }

      if (found) {
        if (miningTimerRef.current) clearInterval(miningTimerRef.current);
        setIsMining(false);
        setMiningHash(finalHash);

        const newBlock: Block = {
          index: nextIndex,
          timestamp: new Date().toLocaleString("ar-SA"),
          transactions: blockTransactions,
          nonce: finalNonce,
          hash: finalHash,
          previousHash,
        };

        onBlockMined(newBlock);
      }
    }, 40);
  };

  // Instant simulation of Block generation for Proof of Stake & Authority
  const handleInstantForge = () => {
    if (!isSubscribed) {
      onRequestSubscribe();
      return;
    }

    if (isCooldownActive) {
      alert(`الرجاء انتظار خطوة الحماية من تكرار التوثيق (تأمين 12 ساعة)! متبقي: ${timeLeftStr}`);
      return;
    }

    const previousBlock = blocks[blocks.length - 1];
    const previousHash = previousBlock ? previousBlock.hash : "0".repeat(64);
    const nextIndex = blocks.length;
    const nextTimestamp = new Date().toLocaleString("ar-SA");

    // Add validator reward tx
    const forgeRewardTx: Transaction = {
      id: `reward-${Date.now()}`,
      sender: config.consensus === "Proof of Stake" ? "مكافأة تجميد الحصص (Staking)" : "مكافأة مدقق السلطة (Validator)",
      recipient: "المطور (أنت)",
      amount: config.blockReward,
      timestamp: new Date().toLocaleTimeString("ar-SA"),
    };

    const blockTransactions = [forgeRewardTx, ...pendingTransactions];
    const finalHash = calculateHash(nextIndex, nextTimestamp, blockTransactions, 888, previousHash);

    const newBlock: Block = {
      index: nextIndex,
      timestamp: nextTimestamp,
      transactions: blockTransactions,
      nonce: 888, // Constant nonce representation
      hash: "000" + finalHash.substring(3), // Ensure beautiful block visual representation
      previousHash,
    };

    onBlockMined(newBlock);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="block-explorer-grid">
      {/* Miner Console & Pending Mempool */}
      <div className="lg:col-span-4 space-y-6" id="miner-console">
        {/* Miner Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden" id="mining-status-card">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="flex items-center gap-2 mb-4" id="miner-header">
            <Cpu className="w-5 h-5 text-amber-500 animate-pulse" />
            <h3 className="font-bold text-white text-lg font-sans">
              {config.consensus === "Proof of Work" ? "وحدة تعدين كتل الشبكة (Miner)" : "خدمة صياغة وتوثيق الكتل"}
            </h3>
          </div>

          {config.consensus === "Proof of Work" ? (
            <div className="space-y-4" id="pow-panel">
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                تقوم الآلية الآن بحل اللغز التشفيري المطلوب (Proof of Work). الشبكة تبحث عن هاش تبدأ أحرفه بـ{" "}
                <span className="text-amber-400 font-mono font-bold">{"0".repeat(config.difficulty)}</span> (درجة الصعوبة: {config.difficulty}).
              </p>

              {/* Real-time Mining Dashboard */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3" id="hashes-statistics">
                <div className="flex justify-between items-center text-xs" id="stat-hashes">
                  <span className="text-slate-500">معدل التجربة (Hashes):</span>
                  <span className="text-amber-400 font-mono font-bold">{hashesCount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-xs" id="stat-nonce">
                  <span className="text-slate-500">رقم النونص الحالي (Nonce):</span>
                  <span className="text-amber-400 font-mono">{miningNonce}</span>
                </div>
                <div className="space-y-1" id="stat-active-hash">
                  <div className="text-slate-500 text-[10px] flex justify-between">
                    <span>الهاش الجاري التحقق منه:</span>
                    {isMining && <span className="text-emerald-400 animate-pulse">جاري البحث...</span>}
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 break-all leading-tight bg-slate-900/60 p-2 rounded border border-slate-800/80">
                    {searchHistory[0]?.hash || "بانتظار بدء عملية التعدين..."}
                  </div>
                </div>
              </div>

              {/* Action */}
              <button
                id="btn-trigger-mining"
                onClick={handleStartMining}
                className={`w-full py-3 px-4 rounded-xl font-bold font-sans transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  isMining
                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30"
                    : isCooldownActive
                    ? "bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed"
                    : "bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-md"
                }`}
              >
                {isMining ? (
                  <>
                    <RefreshCcw className="w-4 h-4 animate-spin text-rose-300" />
                    <span>إيقاف محاكاة التعدين مؤقتاً</span>
                  </>
                ) : isCooldownActive ? (
                  <>
                    <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>قفل تأمين التعدين نشط 🔒</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-slate-950" />
                    <span>بدء تعدين كتلة جديدة (Mine)</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-4" id="pos-poa-panel">
              <div className="p-3 bg-teal-500/10 rounded-xl border border-teal-500/20 text-xs text-teal-300 flex items-start gap-2" id="pos-info">
                <AlertCircle className="w-4.5 h-4.5 shrink-0 text-teal-400" />
                <p className="leading-relaxed">
                  نظراً لتحديد آلية <strong className="font-bold">{config.consensus === "Proof of Stake" ? "إثبات الحصة" : "إثبات السلطة"}</strong>، لا تحتاج الشبكة إلى تعدين طاقة معقّد. يتم توثيق وتأكيد الكتلة فوراً بالتوقيع الرقمي للمدققين المعتمدين.
                </p>
              </div>

              <button
                id="btn-forge-block"
                onClick={() => handleInstantForge()}
                className={`w-full font-bold py-3 px-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer font-sans ${
                  isCooldownActive
                    ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-705"
                    : "bg-teal-400 hover:bg-teal-500 text-slate-950"
                }`}
              >
                {isCooldownActive ? (
                  <>
                    <Clock className="w-4 h-4 text-teal-400" />
                    <span>قفل التوثيق نشط 🔒</span>
                  </>
                ) : (
                  <>
                    <Server className="w-4 h-4" />
                    <span>صياغة وتأكيد الكتلة مباشرة ⚡</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Cooldown Information and Quick Bypass Toggle Panel */}
          {lastMinedTime > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-850 space-y-2 text-right">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-500 font-sans">توقيت العملية السابقة:</span>
                <span className="text-slate-300 font-mono">{new Date(lastMinedTime).toLocaleTimeString("ar-SA")}</span>
              </div>
              
              {isCooldownActive ? (
                <div className="text-[11px] p-2 bg-amber-500/5 rounded-lg border border-amber-500/10 text-amber-300 flex items-center gap-1.5 font-sans justify-end">
                  <Clock className="w-3.5 h-3.5 animate-spin text-amber-500 shrink-0" />
                  <span>تعدين واحد كل 12 ساعة. متبقي: {timeLeftStr}</span>
                </div>
              ) : (
                <div className="text-[11px] p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20 text-emerald-300 flex items-center gap-1.5 font-sans justify-end animate-pulse">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                  <span>الشبكة مهيئة للتعدين الحر والسك الفوري!</span>
                </div>
              )}

              {/* Instant QA Skip Lever */}
              <div className="flex items-center justify-between text-[10px] bg-slate-950 p-2 rounded-lg border border-slate-850">
                <span className="text-slate-400 font-sans font-bold">🧪 تخطي مؤقت الـ 12 ساعة للتجربة:</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bypassCooldown}
                    onChange={(e) => setBypassCooldown(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-amber-400 peer-checked:after:bg-slate-900"></div>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Mempool Container */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6" id="mempool-card">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
              <Layers className="w-4.5 h-4.5 text-blue-400" />
              الميمبول المعلق (Mempool)
            </h4>
            <span className="text-xs bg-blue-500/10 text-blue-300 px-2 py-1 rounded-full border border-blue-500/20">
              {pendingTransactions.length} معاملات معلقة
            </span>
          </div>

          <p className="text-xs text-slate-400 mb-4 leading-relaxed font-sans">
            هذه معاملات مرسلة بانتظار إدراجها بالكتلة القادمة للحصول على التأكيد النهائي للبلوكشين.
          </p>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1" id="mempool-list">
            {pendingTransactions.length === 0 ? (
              <div className="text-center py-6 bg-slate-950 rounded-xl border border-dashed border-slate-850 text-xs text-slate-500 font-sans" id="empty-mempool">
                مستودع الميمبول فارغ حالياً. قم بإجراء معاملات جديدة من لوحة التداول لإرسالها هنا!
              </div>
            ) : (
              pendingTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="bg-slate-950/80 p-3 rounded-lg border border-slate-850 text-xs text-slate-300 space-y-1 text-right relative hover:border-slate-800 transition-all font-sans"
                >
                  <div className="flex justify-between text-slate-400 text-[10px]">
                    <span className="text-slate-500 truncate max-w-[80px]">ID: {tx.id.slice(0, 10)}</span>
                    <span>{tx.timestamp}</span>
                  </div>
                  <div className="flex justify-between items-center py-0.5">
                    <span className="font-semibold text-white truncate max-w-[85px]">من: {tx.sender}</span>
                    <span className="font-bold font-mono text-nowrap flex items-center gap-1">
                      <span className="text-blue-400">+{tx.amount}</span>
                      <span className={`${config.iconColor || "text-amber-400"}`}>{config.iconSymbol || "🪙"}</span>
                      <span className="text-[9px] text-slate-500 font-sans">{config.symbol}</span>
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate text-left">
                    إلى: {tx.recipient}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Block Explorer Feed */}
      <div className="lg:col-span-8 flex flex-col" id="blockchain-feed">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col flex-1" id="block-list-card">
          <div className="flex items-center justify-between mb-5" id="explorer-header">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-teal-400" />
              <h3 className="font-bold text-white text-lg font-sans">مستكشف كتل البلوكشين (Blockchain Explorer)</h3>
            </div>
            <div className="text-xs text-slate-400">
              إجمالي الكتل: <span className="text-teal-400 font-bold font-mono">{blocks.length}</span>
            </div>
          </div>

          {/* Timeline representation */}
          <div className="space-y-5 overflow-y-auto flex-1 max-h-[580px] pl-2 pr-1" id="block-explorer-timeline">
            {blocks.slice().reverse().map((block, index, arr) => {
              const isGenesis = block.index === 0;
              const isHashValid = isGenesis || isValidHash(block.hash, config.difficulty);
              return (
                <div key={block.index} className="relative tracking-wide" id={`block-timeline-item-${block.index}`}>
                  {/* Vertical linking line */}
                  {index < arr.length - 1 && (
                    <div className="absolute right-6 top-12 bottom-0 w-0.5 bg-dashed bg-slate-800 -z-0"></div>
                  )}

                  <div className="bg-slate-950/90 rounded-xl border border-slate-850 p-4 relative z-14 hover:border-teal-500/30 transition-all hover:shadow-lg hover:shadow-teal-500/5 duration-300 flex flex-col md:flex-row gap-4" id={`block-card-${block.index}`}>
                    {/* Block Info Emblem */}
                    <div className="flex md:flex-col items-center justify-between md:justify-center p-3.5 bg-slate-900 rounded-xl border border-slate-800 text-center shrink-0 min-w-[100px] gap-2">
                      <div className="p-2 bg-teal-500/10 text-teal-400 rounded-lg">
                        <Layers className="w-5 h-5" />
                      </div>
                      <div className="text-right md:text-center">
                        <div className="text-[10px] text-slate-500 font-sans">الكتلة (Block)</div>
                        <div className="text-lg font-bold font-mono text-white">#{block.index}</div>
                      </div>
                    </div>

                    {/* Cryptographic Hashes Details */}
                    <div className="flex-1 space-y-2 text-right">
                      <div className="flex flex-wrap justify-between items-center text-xs text-slate-400 pb-1.5 border-b border-slate-900">
                        <span className="text-[10px] bg-slate-900 text-slate-400 px-2 py-0.5 rounded border border-slate-800 font-mono">
                          NONCE: {block.nonce}
                        </span>
                        <span className="text-slate-500 text-[10px] pb-1 md:pb-0">{block.timestamp}</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs" id="block-hashes-row">
                        <div className="bg-slate-900/45 p-3 rounded-xl border border-slate-905/70 font-mono relative overflow-hidden flex flex-col justify-between">
                          <div className="flex items-center justify-between mb-1.5" id={`hash-meta-${block.index}`}>
                            <span className="text-slate-500 block text-[9px] font-sans">هاش الكتلة (Hash):</span>
                            {/* Validation Lock Badge Indicator */}
                            <span className={`px-2 py-0.5 rounded-full text-[9px] flex items-center gap-1 font-sans font-semibold border ${
                              isHashValid
                                ? "bg-emerald-500/12 text-emerald-400 border-emerald-500/20 shadow-sm shadow-emerald-500/5"
                                : "bg-rose-500/12 text-rose-400 border-rose-500/20 shadow-sm shadow-rose-500/5"
                            }`}>
                              {isHashValid ? (
                                <>
                                  <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
                                  <span>هاش صالح</span>
                                </>
                              ) : (
                                <>
                                  <Unlock className="w-3 h-3 text-rose-400 shrink-0" />
                                  <span>تعدين غير كافي</span>
                                </>
                              )}
                            </span>
                          </div>
                          <span className={`${isHashValid ? "text-teal-400" : "text-rose-400"} break-all text-[11px] block text-left font-mono font-medium`} title={block.hash}>
                            {block.hash}
                          </span>
                        </div>
                        <div className="bg-slate-900/45 p-3 rounded-xl border border-slate-905/70 font-mono flex flex-col justify-between">
                          <span className="text-slate-500 block text-[9px] font-sans mb-1.5">الهاش السابق (Prev Hash):</span>
                          <span className="text-slate-400 break-all text-[11px] block text-left font-mono" title={block.previousHash}>
                            {block.previousHash}
                          </span>
                        </div>
                      </div>

                      {/* Included Transactions */}
                      <div className="pt-2" id="block-transactions-section">
                        <div className="text-[10px] text-slate-500 font-semibold mb-1">
                          المعاملات المضمّنة بالكتلة ({block.transactions.length}):
                        </div>
                        <div className="grid grid-cols-1 gap-1.5" id="txs-grid">
                          {block.transactions.map((tx) => (
                            <div
                              key={tx.id}
                              className="bg-slate-900/30 px-3 py-1.5 rounded text-[11px] border border-slate-900/40 flex justify-between items-center hover:bg-slate-900/50 transition-colors font-sans"
                            >
                              <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                                <span className="text-slate-300 truncate max-w-[130px]" title={tx.sender}>
                                  من: {tx.sender}
                                </span>
                              </div>
                              <div className="text-left font-bold font-mono flex items-center gap-1 text-[11px]">
                                <span className="text-teal-400">+{tx.amount}</span>
                                <span className={`${config.iconColor || "text-amber-400"}`}>{config.iconSymbol || "🪙"}</span>
                                <span className="text-[9px] text-slate-500 font-sans">{config.symbol}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
