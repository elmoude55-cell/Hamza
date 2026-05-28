import React, { useState, useEffect } from "react";
import { Block, CoinConfig, Transaction, NewsArticle, CoinAuditReport } from "./types";
import { getGenesisBlock } from "./blockchainUtils";
import CoinConfigComponent from "./components/CoinConfig";
import BlockExplorerComponent from "./components/BlockExplorer";
import {
  Coins,
  TrendingUp,
  TrendingDown,
  Wallet,
  Send,
  Layers,
  Cpu,
  Sparkles,
  RefreshCcw,
  Info,
  Lock,
  PlusCircle,
  Clock,
  Briefcase,
  Sliders,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  TrendingUp as TrendUpIcon
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

// Map selecting visual theme colors matching user brand selection
function getColorStyles(colorClass: string) {
  if (colorClass.includes("emerald")) {
    return {
      text: "text-emerald-400",
      border: "border-emerald-500/20 focus:border-emerald-500 hover:border-emerald-500/40",
      bg: "bg-emerald-500/10",
      badge: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
      glowHover: "hover:shadow-emerald-500/10",
      btn: "bg-emerald-400 hover:bg-emerald-500 text-slate-950",
      gradient: "from-emerald-500/20 via-slate-950 to-slate-950",
      borderGlow: "border-emerald-500/30",
      badgeStatic: "bg-emerald-500/10 text-emerald-300",
      gradientText: "bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400",
    };
  }
  if (colorClass.includes("cyan")) {
    return {
      text: "text-cyan-400",
      border: "border-cyan-500/20 focus:border-cyan-500 hover:border-cyan-500/40",
      bg: "bg-cyan-500/10",
      badge: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
      glowHover: "hover:shadow-cyan-500/10",
      btn: "bg-cyan-400 hover:bg-cyan-500 text-slate-950",
      gradient: "from-cyan-500/20 via-slate-950 to-slate-950",
      borderGlow: "border-cyan-500/30",
      badgeStatic: "bg-cyan-500/10 text-cyan-300",
      gradientText: "bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-400",
    };
  }
  if (colorClass.includes("indigo")) {
    return {
      text: "text-indigo-400",
      border: "border-indigo-500/20 focus:border-indigo-500 hover:border-indigo-500/40",
      bg: "bg-indigo-500/10",
      badge: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
      glowHover: "hover:shadow-indigo-500/10",
      btn: "bg-indigo-400 hover:bg-indigo-500 text-slate-950",
      gradient: "from-indigo-500/20 via-slate-950 to-slate-950",
      borderGlow: "border-indigo-500/30",
      badgeStatic: "bg-indigo-500/10 text-indigo-300",
      gradientText: "bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400",
    };
  }
  if (colorClass.includes("rose")) {
    return {
      text: "text-rose-400",
      border: "border-rose-500/20 focus:border-rose-500 hover:border-rose-500/40",
      bg: "bg-rose-500/10",
      badge: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
      glowHover: "hover:shadow-rose-500/10",
      btn: "bg-rose-400 hover:bg-rose-500 text-slate-950",
      gradient: "from-rose-500/20 via-slate-950 to-slate-950",
      borderGlow: "border-rose-500/30",
      badgeStatic: "bg-rose-500/10 text-rose-300",
      gradientText: "bg-gradient-to-r from-rose-400 via-pink-400 to-red-400",
    };
  }
  // Default is amber (Gold)
  return {
    text: "text-amber-400",
    border: "border-amber-500/20 focus:border-amber-500 hover:border-amber-500/40",
    bg: "bg-amber-500/10",
    badge: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    glowHover: "hover:shadow-amber-500/10",
    btn: "bg-amber-400 hover:bg-amber-500 text-slate-950",
    gradient: "from-amber-500/20 via-slate-950 to-slate-950",
    borderGlow: "border-amber-500/30",
    badgeStatic: "bg-amber-500/10 text-amber-300",
    gradientText: "bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400",
  };
}

export default function App() {
  const [config, setConfig] = useState<CoinConfig>({
    name: "ريال ثريا",
    symbol: "TRY",
    consensus: "Proof of Work",
    totalSupply: 100000000,
    blockReward: 50,
    difficulty: 2,
    description: "عملة رقمية لا مركزية لتسهيل المدفوعات السريعة في جميع أنحاء العالم العربي.",
    iconSymbol: "۞",
    iconColor: "text-cyan-400"
  });

  const [blocks, setBlocks] = useState<Block[]>([getGenesisBlock()]);
  const [pendingTransactions, setPendingTransactions] = useState<Transaction[]>([]);
  const [marketPrice, setMarketPrice] = useState<number>(1.25);
  const [priceHistory, setPriceHistory] = useState<{ time: string; price: number }[]>([
    { time: "12:00", price: 1.00 },
    { time: "13:00", price: 1.05 },
    { time: "14:00", price: 1.10 },
    { time: "15:00", price: 1.08 },
    { time: "16:00", price: 1.20 },
    { time: "17:00", price: 1.25 },
  ]);

  const [circulatingSupply, setCirculatingSupply] = useState<number>(1000); // starts with genesis block
  const [wallets, setWallets] = useState<Record<string, number>>({
    "المطور (أنت)": 1000,
    "محفظة علي": 300,
    "محفظة سارة": 150,
    "المستثمر التأسيسي": 2500,
  });

  const [newWalletName, setNewWalletName] = useState<string>("");
  const [newWalletBalance, setNewWalletBalance] = useState<number>(100);

  // Send Transaction Inputs
  const [txSender, setTxSender] = useState<string>("المطور (أنت)");
  const [txRecipient, setTxRecipient] = useState<string>("محفظة علي");
  const [txAmount, setTxAmount] = useState<number>(10);
  const [txError, setTxError] = useState<string | null>(null);
  const [txSuccess, setTxSuccess] = useState<boolean>(false);

  // AI intelligence states
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [auditReport, setAuditReport] = useState<CoinAuditReport | null>(null);
  const [loadingNews, setLoadingNews] = useState<boolean>(false);
  const [loadingAudit, setLoadingAudit] = useState<boolean>(false);

  // Premium & 12h Mining Cooldown states
  const [isSubscribed, setIsSubscribed] = useState<boolean>(() => {
    return localStorage.getItem("app_subscribed") === "true";
  });
  const [showSubscriptionModal, setShowSubscriptionModal] = useState<boolean>(false);
  const [lastMinedTime, setLastMinedTime] = useState<number>(() => {
    return Number(localStorage.getItem("last_mined_time") || "0");
  });
  const [processingSubscription, setProcessingSubscription] = useState<boolean>(false);
  const [subCardNumber, setSubCardNumber] = useState<string>("");
  const [subCardExpiry, setSubCardExpiry] = useState<string>("");
  const [subCardCVC, setSubCardCVC] = useState<string>("");

  const updateSubscribedStatus = (val: boolean) => {
    setIsSubscribed(val);
    if (val) {
      localStorage.setItem("app_subscribed", "true");
    } else {
      localStorage.removeItem("app_subscribed");
    }
  };

  const updateLastMinedTime = (time: number) => {
    setLastMinedTime(time);
    localStorage.setItem("last_mined_time", String(time));
  };

  const style = getColorStyles(config.iconColor);

  // Process a newly mined block
  const handleBlockMined = (newBlock: Block) => {
    // Determine the miner's reward recipient
    const coinbaseReward = config.blockReward;

    // Adjust wallet balances
    setWallets((current) => {
      const next = { ...current };
      newBlock.transactions.forEach((tx) => {
        // Debiting sender
        if (
          tx.sender !== "نظام الشبكة (Genesis)" &&
          tx.sender !== "جائزة تعدين الكتلة (Coinbase)" &&
          tx.sender !== "مكافأة تجميد الحصص (Staking)" &&
          tx.sender !== "مكافأة مدقق السلطة (Validator)"
        ) {
          next[tx.sender] = (next[tx.sender] || 0) - tx.amount;
        }
        // Crediting recipient
        next[tx.recipient] = (next[tx.recipient] || 0) + tx.amount;
      });
      return next;
    });

    // Add block
    setBlocks((prev) => [...prev, newBlock]);

    // Clear mempool of transactions included in this block
    setPendingTransactions((prev) =>
      prev.filter((ptx) => !newBlock.transactions.some((btx) => btx.id === ptx.id))
    );

    // Update circulating supply
    setCirculatingSupply((prev) => prev + coinbaseReward);

    // Fluctuating Price and updating graph state
    setMarketPrice((prevPrice) => {
      const positiveTrend = Math.random() > 0.4; // 60% chance of gain on mining success!
      const fluctuation = (Math.random() * 12 + 1) / 100; // 1% to 13%
      const multiplier = positiveTrend ? 1 + fluctuation : 1 - fluctuation;
      const nextPrice = Math.max(0.01, parseFloat((prevPrice * multiplier).toFixed(4)));

      setPriceHistory((history) => {
        const nextTime = new Date().toLocaleTimeString("ar-SA", { hour12: false });
        return [...history, { time: nextTime, price: nextPrice }].slice(-12);
      });

      return nextPrice;
    });

    // Smart spec news refresh triggers on block success to give cool organic simulated content!
    triggerAiNewsUpdate();

    // Save mining cooldown timestamp
    updateLastMinedTime(Date.now());
  };

  // Trigger Gemini news update
  const triggerAiNewsUpdate = async () => {
    setLoadingNews(true);
    try {
      const response = await fetch("/api/gemini/market-news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coinName: config.name,
          coinSymbol: config.symbol,
          consensus: config.consensus,
          price: marketPrice,
          marketCap: Math.floor(circulatingSupply * marketPrice),
          trend: "صاعد",
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setNews(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingNews(false);
    }
  };

  // Trigger Gemini tokenomics audit report
  const triggerAiAuditReport = async (cfg: CoinConfig = config) => {
    setLoadingAudit(true);
    try {
      const response = await fetch("/api/gemini/coin-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coinName: cfg.name,
          coinSymbol: cfg.symbol,
          consensus: cfg.consensus,
          supply: cfg.totalSupply,
          blockReward: cfg.blockReward,
          difficulty: cfg.difficulty,
          description: cfg.description,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setAuditReport(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAudit(false);
    }
  };

  // Start initialization of a custom Coin Settings
  const handleInitializeCoin = (newConfig: CoinConfig) => {
    if (!isSubscribed) {
      setShowSubscriptionModal(true);
      return;
    }
    setConfig(newConfig);
    // Restart blockchain
    const genesisReward = 1000;
    const initialTx: Transaction = {
      id: "tx-genesis-" + Date.now(),
      sender: "نظام الشبكة (Genesis)",
      recipient: "المطور (أنت)",
      amount: genesisReward,
      timestamp: new Date().toLocaleTimeString("ar-SA"),
    };
    
    const initialBlock: Block = {
      index: 0,
      timestamp: new Date().toLocaleString("ar-SA"),
      transactions: [initialTx],
      nonce: 0,
      hash: "000" + Math.random().toString(16).substring(2, 63),
      previousHash: "0000000000000000000000000000000000000000000000000000000000000000",
    };

    setBlocks([initialBlock]);
    setPendingTransactions([]);
    setCirculatingSupply(genesisReward);
    setMarketPrice(1.0);
    setPriceHistory([
      { time: "البداية", price: 1.0 }
    ]);
    
    // Setup default wallets
    setWallets({
      "المطور (أنت)": genesisReward,
      "محفظة علي": 300,
      "محفظة سارة": 150,
      "المستثمر التأسيسي": 2500,
    });

    setTxSender("المطور (أنت)");
    setTxRecipient("محفظة علي");

    // Fetch dynamic insights
    triggerAiNewsUpdate();
    triggerAiAuditReport(newConfig);
  };

  // Send custom transaction
  const handlePerformTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSubscribed) {
      setShowSubscriptionModal(true);
      return;
    }
    setTxError(null);
    setTxSuccess(false);

    const senderBalance = wallets[txSender] || 0;
    if (senderBalance < txAmount) {
      setTxError(`عذراً! رصيد "${txSender}" غير كافٍ. الرصيد المتاح هو ${senderBalance} ${config.symbol}.`);
      return;
    }

    if (txSender === txRecipient) {
      setTxError("لا يمكن إرسال المعاملات إلى نفس المحفظة المرسلة!");
      return;
    }

    const newTx: Transaction = {
      id: `tx-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      sender: txSender,
      recipient: txRecipient,
      amount: txAmount,
      timestamp: new Date().toLocaleTimeString("ar-SA", { hour12: false }),
    };

    setPendingTransactions((prev) => [...prev, newTx]);
    setTxSuccess(true);
    setTxAmount(10); // reset amount
  };

  // Add customized wallet account
  const handleAddWallet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWalletName.trim()) return;
    setWallets((prev) => ({
      ...prev,
      [newWalletName.trim()]: Number(newWalletBalance),
    }));
    setNewWalletName("");
    setNewWalletBalance(100);
  };

  // Setup first data loading trigger
  useEffect(() => {
    triggerAiNewsUpdate();
    triggerAiAuditReport();
  }, []);

  const totalMarketCap = circulatingSupply * marketPrice;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-slate-950" id="main-web3-container" dir="rtl">
      {/* Upper Brand Header */}
      <header className="bg-slate-900/60 border-b border-slate-900 sticky top-0 backdrop-blur-md z-40 transition-colors" id="portal-header">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className={`p-3 rounded-2xl ${style.bg} border ${style.borderGlow} flex items-center justify-center text-3xl font-bold`}>
              {config.iconSymbol}
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2">
                <span className={`text-2xl font-black ${style.text}`}>{config.name}</span>
                <span className="text-xs font-mono font-bold bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                  {config.symbol}
                </span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold animate-pulse">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                  نشط حياً
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans">بوابة سك وإدارة ومحاكاة العملات الرقمية المستقلة على البلوكشين</p>
            </div>
          </div>

          {/* Quick Stats & Subscription Status Widget */}
          <div className="flex flex-wrap items-center gap-3" id="header-billing-cooldown">
            <button
              id="header-sub-badge"
              onClick={() => setShowSubscriptionModal(true)}
              className={`text-xs px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                isSubscribed
                  ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 hover:bg-emerald-500/15"
                  : "bg-amber-400 hover:bg-amber-500 text-slate-950 hover:scale-105 active:scale-95 duration-200"
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${!isSubscribed ? "animate-spin text-slate-950" : "text-emerald-400"}`} />
              <span>{isSubscribed ? "عضوية مفعلة ($1 مدى الحياة) ✨" : "تفعيل ترخيص التطبيق ($1) 🔒"}</span>
            </button>

            <div className="flex items-center gap-2.5 bg-slate-950 p-2.5 rounded-xl border border-slate-900" id="header-quick-ticker">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shrink-0"></span>
              <span className="text-xs text-slate-500 font-medium">سعر الصرف المباشر:</span>
              <span className={`text-xs font-bold font-mono ${style.text}`}>
                ${marketPrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dynamic View Grid */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-6 w-full space-y-6" id="app-body">
        
        {/* Dynamic Theme Glow Banner */}
        <div className={`relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br ${style.gradient} border ${style.borderGlow} shadow-2xl transition-all duration-500`} id="brand-splash-banner">
          <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 text-right">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400 animate-bounce" />
                <h1 className="text-xl md:text-2xl font-extrabold text-white">
                  محاكاة حية لاقتصاد رموز العملة <span className={style.gradientText}>{config.name}</span>
                </h1>
              </div>
              <p className="text-sm text-slate-300 max-w-2xl leading-relaxed font-sans">
                {config.description} عملتك الرقمية تم سكّها بنجاح مع إمداد أقصى يبلغ {config.totalSupply.toLocaleString()} {config.symbol}، وتعتمد في تشغيلها وحوكمتها على بروتوكول <strong className="text-teal-400 font-bold">{config.consensus}</strong> بدقة تشفيرية مثالية.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <button
                id="btn-re-audit"
                onClick={() => triggerAiAuditReport(config)}
                className="bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800 text-xs px-4 py-2.5 rounded-xl transition-all font-sans flex items-center gap-1.5 cursor-pointer"
              >
                <Cpu className="w-4 h-4 text-blue-400" />
                <span>إعادة التدقيق المالي</span>
              </button>
              <button
                id="btn-fake-market-update"
                onClick={triggerAiNewsUpdate}
                className="bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800 text-xs px-4 py-2.5 rounded-xl transition-all font-sans flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCcw className="w-4 h-4 text-teal-400" />
                <span>تحديث الأخبار والأسعار</span>
              </button>
            </div>
          </div>
        </div>

        {/* Global Financial Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" id="market-metrics-grid">
          {/* Card 1: Price Action */}
          <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between hover:border-slate-700 transition-all duration-300" id="card-price-action">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-slate-400 font-medium">سعر الصرف مقابل الدولار ($)</p>
                <h3 className={`text-2xl font-black font-mono mt-1 ${style.text}`}>
                  ${marketPrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                </h3>
              </div>
              <div className={`p-2 rounded-xl ${style.bg} ${style.text}`}>
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-4 leading-none font-sans">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
              <span>يتغير الياً مع كل قالب كتل (Block) يتم تعدينه</span>
            </div>
          </div>

          {/* Card 2: Market Capitalization */}
          <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between hover:border-slate-700 transition-all duration-300" id="card-market-cap">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-slate-400 font-medium">القيمة السوقية الكلية (Cap)</p>
                <h3 className="text-2xl font-black font-mono mt-1 text-white">
                  ${totalMarketCap.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                </h3>
              </div>
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                <Coins className="w-5 h-5" />
              </div>
            </div>
            <div className="text-[11px] text-slate-500 mt-4 font-sans">
              الأسعار حية مضروبة بالإمداد الحقيقي المتداول
            </div>
          </div>

          {/* Card 3: Circulating Float */}
          <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between hover:border-slate-700 transition-all duration-300" id="card-circulating-supply">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-slate-400 font-medium">الإمداد المتداول حالياً</p>
                <h3 className="text-2xl font-black font-mono mt-1 text-white flex items-center gap-1.5">
                  <span>{circulatingSupply.toLocaleString()}</span>
                  <span className={`text-base ${style.text}`}>{config.symbol}</span>
                </h3>
              </div>
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                <Layers className="w-5 h-5" />
              </div>
            </div>
            <div className="text-[11px] text-slate-500 mt-4 font-sans justify-between flex">
              <span>الحد الأقصى:</span>
              <span className="text-slate-400 font-mono">{config.totalSupply.toLocaleString()}</span>
            </div>
          </div>

          {/* Card 4: Consensus Mechanism */}
          <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between hover:border-slate-700 transition-all duration-300" id="card-block-index">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-slate-400 font-medium">سلسلة الكتل المقيدة</p>
                <h3 className="text-2xl font-black font-mono mt-1 text-white">
                  {blocks.length} كتل (Blocks)
                </h3>
              </div>
              <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
                <Cpu className="w-5 h-5" />
              </div>
            </div>
            <div className="text-[11px] mt-4 font-sans flex justify-between items-center text-slate-500">
              <span>آلية الأمن:</span>
              <span className="text-emerald-400 font-bold text-xs">{config.consensus}</span>
            </div>
          </div>
        </div>

        {/* Central Dashboard: Chart, Wallet & Trading console */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="dashboard-core-row">
          
          {/* Chart & AI Speculative Feed (8 Columns on Large screen) */}
          <div className="lg:col-span-8 space-y-6" id="chart-and-news-panel">
            {/* Chart Block */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6" id="price-chart-card">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-white text-base font-sans">تذبذبات سعر الصرف المباشر</h3>
                  <p className="text-xs text-slate-400">محاكاة فورية لمخطط الرسم البياني لأسعار {config.symbol} بالدولار</p>
                </div>
                <div className={`px-2.5 py-1 text-xs rounded-full font-bold ${style.badgeStatic} flex items-center gap-1 font-sans`}>
                  <TrendUpIcon className="w-3.5 h-3.5" />
                  <span>تداول نشط</span>
                </div>
              </div>

              {/* Chart container */}
              <div className="h-64 cursor-crosshair" id="recharts-wrapper">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={priceHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} domain={["auto", "auto"]} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b", borderRadius: "10px", color: "#fff", textAlign: "right" }}
                      labelClassName="text-slate-500 font-mono text-[10px]"
                    />
                    <Line
                      type="monotone"
                      dataKey="price"
                      name="السعر ($)"
                      stroke={config.iconColor.includes("amber") ? "#fbbf24" : config.iconColor.includes("emerald") ? "#34d399" : config.iconColor.includes("cyan") ? "#22d3ee" : config.iconColor.includes("indigo") ? "#818cf8" : "#fb7185"}
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* AI Expert Speculative Breaking News */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6" id="ai-news-feed-card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-gradient-to-br from-amber-400 via-teal-500 to-blue-500 rounded-lg text-slate-950">
                    <Sparkles className="w-4 h-4 fill-slate-950" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">غرفة الأخبار والتحليلات التنبؤية (Speculative News)</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <p className="text-xs text-slate-450">أخبار عاجلة ومحاكاة ذكية لحركة السوق</p>
                      {news.length > 0 && (
                        news[0].isFallback ? (
                          <span className="bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded text-[10px] font-semibold font-sans">
                            وضع محاكاة محلي احتياطي ⚙️
                          </span>
                        ) : (
                          <span className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-semibold font-sans">
                            اتصال ذكي حي بنموذج Gemini 🟢
                          </span>
                        )
                      )}
                      {news.length > 0 && news[0].isCached && (
                        <span className="bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2 py-0.5 rounded text-[10px] font-semibold font-sans">
                          مسترجع من المؤقت ⚡
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {loadingNews && (
                  <span className="flex items-center gap-1.5 text-xs text-teal-400 font-sans">
                    <RefreshCcw className="w-3.5 h-3.5 animate-spin" />
                    جاري التوليد...
                  </span>
                )}
              </div>

              {news.length === 0 ? (
                <div className="text-center py-10 bg-slate-950/50 rounded-xl border border-dashed border-slate-850 text-slate-400 text-xs font-sans">
                  لا توجد تقارير عاجلة حالياً. سيقوم الذكاء الاصطناعي بنشر الأخبار والتأثير فور تعدين كتل جديدة، أو انقر على "تحديث الأخبار".
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="news-grid">
                  {news.map((item, id) => {
                    const isPositive = item.impact.includes("إيجابي");
                    const isSevere = item.impact.includes("جداً");
                    return (
                      <div
                        key={id}
                        className="bg-slate-950/80 p-4 rounded-xl border border-slate-850 hover:border-slate-800 transition-all duration-300 flex flex-col justify-between"
                        id={`news-card-${id}`}
                      >
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-[10px]" id="news-tagline">
                            <span className={`px-2 py-0.5 rounded-full font-bold ${
                              isPositive 
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                                : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                            }`}>
                              {item.impact}
                            </span>
                            <span className="text-slate-500">{new Date().toLocaleDateString("ar-SA")}</span>
                          </div>

                          <h4 className="font-bold text-white text-xs leading-snug line-clamp-2">
                            {item.title}
                          </h4>
                          <p className="text-[11px] text-slate-400 leading-relaxed font-sans line-clamp-4">
                            {item.content}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-slate-900 flex justify-between items-center mt-3 text-xs" id="news-footer">
                          <span className="text-slate-500 text-[10px]">التحرك السعري المتوقع:</span>
                          <span className={`font-mono font-bold ${isPositive ? "text-emerald-400" : "text-rose-400"}`}>
                            {item.priceChangeForecast}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Sandbox Peer-to-Peer Ledger & Wallet (4 Columns on Large screen) */}
          <div className="lg:col-span-4 space-y-6" id="wallet-trading-panel">
            {/* Direct P2P Transfer Console */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6" id="p2p-transfer-card">
              <div className="flex items-center gap-2 mb-3">
                <Send className="w-5 h-5 text-teal-400" />
                <h3 className="font-bold text-white text-base">بوابة تداول وإرسال المعاملات</h3>
              </div>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed font-sans">
                قم بمحاكاة التحويلات اللامركزية بين المحافظ وحسابات الشبكة. المعاملات ستذهب للميمبل بانتظار إدراجها بالكتل.
              </p>

              <form onSubmit={handlePerformTransfer} className="space-y-4" id="p2p-form">
                {/* Sender Address */}
                <div className="space-y-1" id="input-sender">
                  <label className="text-xs text-slate-400 block font-sans">محفظة المرسل:</label>
                  <select
                    id="select-tx-sender"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all cursor-pointer"
                    value={txSender}
                    onChange={(e) => setTxSender(e.target.value)}
                  >
                    {Object.keys(wallets).map((name) => (
                      <option key={name} value={name}>
                        {name} ({wallets[name].toLocaleString()} {config.symbol})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Recipient Address */}
                <div className="space-y-1" id="input-recipient">
                  <label className="text-xs text-slate-400 block font-sans">محفظة المستلم:</label>
                  <select
                    id="select-tx-recipient"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all cursor-pointer"
                    value={txRecipient}
                    onChange={(e) => setTxRecipient(e.target.value)}
                  >
                    {Object.keys(wallets).map((name) => (
                      <option key={name} value={name}>
                        {name} ({wallets[name].toLocaleString()} {config.symbol})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Amount */}
                <div className="space-y-1" id="input-amount">
                  <label className="text-xs text-slate-400 block font-sans">الكمية المراد تحويلها:</label>
                  <div className="relative">
                    <input
                      id="input-tx-amount"
                      type="number"
                      min={1}
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all pr-2.5 pl-12"
                      value={txAmount}
                      onChange={(e) => setTxAmount(Number(e.target.value))}
                    />
                    <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-500 font-mono">
                      {config.symbol}
                    </span>
                  </div>
                </div>

                {/* Action Feedback alerts */}
                {txError && (
                  <div className="p-2.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs rounded-lg flex items-start gap-1.5 font-sans" id="tx-error-alert">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>{txError}</span>
                  </div>
                )}
                {txSuccess && (
                  <div className="p-2.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs rounded-lg flex items-start gap-1.5 font-sans" id="tx-success-alert">
                    <Sparkles className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>تمت صياغة المعاملة بنجاح وإرسالها للميمبول المعلق تحت الإعداد. وعليك بدء التعدين لتأكيدها!</span>
                  </div>
                )}

                <button
                  id="btn-submit-transfer"
                  type="submit"
                  className={`w-full text-slate-950 font-bold py-2.5 px-4 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer font-sans ${style.btn}`}
                >
                  <Send className="w-3.5 h-3.5 fill-slate-950" />
                  <span>توقيع وبث المعاملة رقمياً 🖊️</span>
                </button>
              </form>
            </div>

            {/* Simulated Wallets Management Console */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6" id="wallets-list-card">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-blue-400" />
                  <h3 className="font-bold text-white text-base">دفتر حسابات ومحافظ الشبكة</h3>
                </div>
              </div>

              <div className="space-y-2.5 overflow-y-auto max-h-56 pr-1 mb-4" id="wallets-timeline">
                {Object.entries(wallets).map(([name, balance]) => (
                  <div
                    key={name}
                    className="flex justify-between items-center bg-slate-950 p-2.5 rounded-xl border border-slate-900 text-xs text-right font-sans"
                  >
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-slate-900 rounded-lg text-slate-400 border border-slate-800 flex items-center justify-center">
                        <Wallet className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="font-semibold text-white block">{name}</span>
                        <span className="text-[10px] text-slate-500 font-mono">Address: @{name.replace(/\s+/g, "")}</span>
                      </div>
                    </div>
                    <div className="text-left font-mono font-black text-white flex items-center gap-1">
                      <span>{balance.toLocaleString()}</span>
                      <span className={style.text}>{config.iconSymbol}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Custom Address form */}
              <form onSubmit={handleAddWallet} className="pt-3 border-t border-slate-850/60 flex gap-2" id="add-wallet-form">
                <input
                  id="input-new-wallet-name"
                  type="text"
                  required
                  placeholder="اسم محفظة جديد..."
                  className="bg-slate-950 border border-slate-800 text-xs p-2.5 rounded-xl focus:outline-none focus:border-teal-500 flex-1"
                  value={newWalletName}
                  onChange={(e) => setNewWalletName(e.target.value)}
                />
                <input
                  id="input-new-wallet-balance"
                  type="number"
                  min={0}
                  className="bg-slate-950 border border-slate-800 text-xs p-2.5 rounded-xl w-16 text-center focus:outline-none focus:border-teal-500"
                  value={newWalletBalance}
                  onChange={(e) => setNewWalletBalance(Number(e.target.value))}
                  title="الرصيد الافتتاحي"
                />
                <button
                  id="btn-add-wallet"
                  type="submit"
                  className="bg-slate-800 hover:bg-slate-750 text-white border border-slate-700 text-xs p-2.5 rounded-xl block cursor-pointer"
                  title="إنشاء حساب جديد"
                >
                  <PlusCircle className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* AI Advanced Tokenomics Audit Review Panel */}
        {auditReport && (
          <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden" id="ai-audit-panel-card">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-800/60">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-xl text-slate-950 shadow-md">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white font-sans">التقرير والتدقيق المالي الذكي (AI Audit Report)</h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <p className="text-xs text-slate-400">تقييم شامل لحوكمة واقتصاد عملتك {config.name}</p>
                    {auditReport.isFallback ? (
                      <span className="bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded text-[10px] font-semibold font-sans">
                        تقييم محاكي احتياطي ⚙️
                      </span>
                    ) : (
                      <span className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-semibold font-sans">
                        تدقيق حوكمة جاري بنموذج Gemini 🟢
                      </span>
                    )}
                    {auditReport.isCached && (
                      <span className="bg-sky-500/10 text-sky-455 border border-sky-500/20 px-2 py-0.5 rounded text-[10px] font-semibold font-sans">
                        محفوظ ⚡
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Dynamic Score badge */}
              <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-850 self-end md:self-center" id="audit-score-container">
                <span className="text-[10px] text-slate-500 font-sans">التقييم العام للمشروع (Score):</span>
                <span className={`text-lg font-black font-mono ${style.text}`}>{auditReport.score}%</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="audit-details-grid">
              {/* Tokenomics Score & Inflation info */}
              <div className="space-y-2 text-right bg-slate-950/40 p-4 rounded-xl border border-slate-850" id="audit-deflation-review">
                <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${style.text.replace("text-", "bg-")}`}></span>
                  صحة الاقتصاد والتضخم:
                </h4>
                <div className="text-[11px] font-semibold text-slate-400">
                  تقييم الاقتصاد الرمزي: <span className={`${style.text} font-bold`}>{auditReport.tokenomicsRating}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans mt-2">
                  {auditReport.inflationReview}
                </p>
              </div>

              {/* Security Audit */}
              <div className="space-y-2 text-right bg-slate-950/40 p-4 rounded-xl border border-slate-850" id="audit-security-review">
                <h4 className="font-bold text-white text-xs flex items-center gap-1.5 text-blue-400">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  تدقيق الأمان وسرعة الإجماع:
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  {auditReport.securityAudit}
                </p>
              </div>

              {/* Advisory recommendations */}
              <div className="space-y-2 text-right bg-slate-950/40 p-4 rounded-xl border border-slate-850" id="audit-tips">
                <h4 className="font-bold text-white text-xs flex items-center gap-1.5 text-amber-400">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  نصائح وتوصيات استشارية ذكية:
                </h4>
                <ul className="space-y-1.5 list-disc pr-3 text-[11px] text-slate-400 leading-relaxed font-sans" id="tips-bullets">
                  {auditReport.advisoryTips.map((tip, id) => (
                    <li key={id} className="text-slate-300">
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Blockchain Ledger and Live Mining Loop (BlockExplorerComponent integration) */}
        <div className="pt-4" id="blockchain-ledger-explorer-section">
          <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/60 mb-5 text-right flex flex-col md:flex-row md:items-center justify-between gap-4" id="ledger-headline">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className={`p-1 bg-slate-950 rounded ${style.text}`}>{config.iconSymbol}</span>
                تعدين وإجماع سلسلة الكتل (Blockchain Ledger)
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed max-w-2xl font-sans mt-1">
                الكتل هي العظام الصلبة في جسد البلوكشين. محاكاة التعدين الآتية ستقوم بحل خوارزميات صعبة تشفيرياً لربط الكتل ببعضها عبر الهاشات والتحقق من صحتها وتوزيع مكافأة {config.blockReward} {config.symbol}.
              </p>
            </div>
            <div className="flex gap-2">
              <span className="text-xs bg-slate-950 text-slate-400 border border-slate-800 px-3 py-1.5 rounded-lg font-bold font-sans">
                صعوبة التعدين الحالية: <span className="text-teal-400 font-mono font-bold">{config.difficulty}</span>
              </span>
              <span className="text-xs bg-slate-950 text-slate-400 border border-slate-800 px-3 py-1.5 rounded-lg font-bold font-sans">
                المعاملات المعلقة (Mempool): <span className="text-blue-400 font-mono font-bold">{pendingTransactions.length}</span>
              </span>
            </div>
          </div>

          <BlockExplorerComponent
            blocks={blocks}
            pendingTransactions={pendingTransactions}
            config={config}
            onBlockMined={handleBlockMined}
            lastMinedTime={lastMinedTime}
            onUpdateMinedTime={updateLastMinedTime}
            isSubscribed={isSubscribed}
            onRequestSubscribe={() => setShowSubscriptionModal(true)}
          />
        </div>

        {/* Interactive Custom Coin Creator (سك عملة جديدة) */}
        <div className="pt-6 border-t border-slate-900" id="minting-creator-panel">
          <div className="bg-slate-950/40 p-6 rounded-2xl border border-slate-900 mb-6 text-right">
            <h3 className="text-lg font-bold text-white mb-2">هل ترغب في إعادة سك عملة رقمية بهوية واسم آخر مخصص؟</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              واجهة تصميم اقتصاد الكتل أدناه تتيح لك إعادة برمجة معايير شبكتك بالكامل لتغيير الاسم، والمد المعروض، وتغيير الأيقونة، واللون المضيء حسب رغبتك في أي وقت!
            </p>
          </div>

          <CoinConfigComponent onInitialize={handleInitializeCoin} currentConfig={config} />
        </div>
      </main>

      {/* Premium Subscription Checkout Modal (1 Dollar) */}
      {showSubscriptionModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-55 flex items-center justify-center p-4 animate-fade-in" id="subscription-modal-wrapper" style={{ direction: "rtl" }}>
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative" id="subscription-modal-card">
            {/* Ambient gold glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Modal Header */}
            <div className="p-6 pb-4 border-b border-slate-850 text-right relative">
              <button
                onClick={() => setShowSubscriptionModal(false)}
                className="absolute top-6 left-6 text-slate-400 hover:text-white bg-slate-805/40 hover:bg-slate-800 p-1.5 rounded-full transition-all cursor-pointer text-xs font-mono font-bold"
                id="close-sub-modal"
              >
                ✕
              </button>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="p-2 bg-amber-500/10 text-amber-300 rounded-xl border border-amber-500/20">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <h3 className="text-lg font-bold text-white font-sans">بوابة تفعيل الترخيص والاشتراك</h3>
              </div>
              <p className="text-xs text-slate-400 font-sans">قم بتنشيط ترخيص العمل والسك اللامحدود مقابل 1$ فقط مدى الحياة!</p>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-right">
              {/* Pricing Tag */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-500 font-bold">باقة المطور اللامحدودة (Founder Plan)</div>
                  <div className="text-xs text-slate-330 font-semibold font-sans mt-0.5">وصول دائم، بدون تجديد شهري</div>
                </div>
                <div className="text-left">
                  <span className="text-2xl font-black text-amber-400 font-mono">$1.00</span>
                  <span className="text-[10px] text-slate-500 block">دفع لمرة واحدة</span>
                </div>
              </div>

              {/* Error if trying unsupported things */}
              <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/15 text-[11px] text-indigo-300 flex items-start gap-2 leading-relaxed">
                <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>
                  <strong>المزايا المتاحة بعد الاشتراك:</strong> فتح خدمات التعدين (Mining 12h)، سك عملات مخصصة جديدة، وتحويل العملات بحرية بين المحافظ اللامركزية وتوليد التقارير المالية المتقدمة.
                </span>
              </div>

              {/* Payment Details Form */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 font-semibold block">رقم البطاقة الائتمانية</label>
                  <input
                    type="text"
                    placeholder="4000 1234 5678 9010"
                    value={subCardNumber}
                    onChange={(e) => setSubCardNumber(e.target.value.replace(/[^0-9 ]/g, ""))}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-amber-500 font-mono text-left"
                    maxLength={19}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3" style={{ direction: "ltr" }}>
                  <div className="space-y-1 text-right">
                    <label className="text-[11px] text-slate-400 font-semibold block">الرمز السري (CVC)</label>
                    <input
                      type="password"
                      placeholder="123"
                      value={subCardCVC}
                      onChange={(e) => setSubCardCVC(e.target.value.replace(/[^0-9]/g, ""))}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-amber-500 text-center font-mono"
                      maxLength={3}
                    />
                  </div>
                  <div className="space-y-1 text-right">
                    <label className="text-[11px] text-slate-400 font-semibold block">تاريخ الانتهاء</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={subCardExpiry}
                      onChange={(e) => setSubCardExpiry(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-amber-500 text-center font-mono"
                      maxLength={5}
                    />
                  </div>
                </div>
              </div>

              {/* Quick Simulator Auto-Fill Link */}
              <button
                type="button"
                onClick={() => {
                  setSubCardNumber("4000 9876 5432 1011");
                  setSubCardExpiry("12/29");
                  setSubCardCVC("999");
                }}
                className="w-full py-1.5 px-3 bg-slate-950 hover:bg-slate-850 rounded-xl text-[10px] text-amber-300 border border-amber-500/10 font-bold transition-all text-center cursor-pointer"
              >
                💳 تعبئة تلقائية سريعة ببطاقة المطور للتجربة الفورية
              </button>

              {/* Submit Button */}
              <button
                onClick={() => {
                  if (!subCardNumber || !subCardExpiry || !subCardCVC) {
                    alert("الرجاء ملء تفاصيل بطاقة الدفع للتفعيل.");
                    return;
                  }
                  setProcessingSubscription(true);
                  setTimeout(() => {
                    setProcessingSubscription(false);
                    updateSubscribedStatus(true);
                    setShowSubscriptionModal(false);
                  }, 1200);
                }}
                disabled={processingSubscription}
                className="w-full bg-amber-400 hover:bg-amber-500 disabled:bg-slate-800 text-slate-950 disabled:text-slate-500 py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/10 font-sans"
              >
                {processingSubscription ? (
                  <>
                    <RefreshCcw className="w-4 h-4 animate-spin text-slate-950" />
                    <span>جاري ترحيل ومعالجة الـ $1...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-slate-905" />
                    <span>تأكيد الدفع بالفيزا وتفعيل الترخيص مدى الحياة 🌿</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Aesthetic Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-6 mt-12 text-center text-xs text-slate-500 font-sans" id="app-footer">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p>بوابة ومحاكاة العملات المشفرة الذكية - جرى السك والتوزيع بنجاح.</p>
          <p className="text-[10px] text-slate-600">
            مدعوم بنموذج Google AI Studio ومبني بواسطة تقنية البلوكشين الذاتية المحاورة.
          </p>
        </div>
      </footer>
    </div>
  );
}
