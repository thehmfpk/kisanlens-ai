import React, { useState, useRef } from 'react';
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  RefreshCw,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  MessageSquare,
  Zap,
  Sprout,
  Droplets,
  Layers,
  CloudSun,
  Store,
} from 'lucide-react';
import { ChatMessage, FarmProfile, Language } from '../types';
import { DEMO_VOICE_REPLIES } from '../data/pakistanAgriData';
import { generateLocalVoiceReply } from '../services/localAgriEngine';

interface VoiceKisanModuleProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  demoMode: boolean;
  farmProfile: FarmProfile;
  onRecordActivity: (title: string, subtitle: string, isDemo: boolean) => void;
}

export const VoiceKisanModule: React.FC<VoiceKisanModuleProps> = ({
  language,
  setLanguage,
  farmProfile,
  onRecordActivity,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      text:
        language === 'ur'
          ? 'السلام علیکم کسان بھائی! میں آواز کسان ہوں۔ آپ اردو، رومن اردو یا انگریزی میں بول کر یا لکھ کر کسی بھی فصل، سبزی، پھل، کھاد، پانی یا بیماری کے بارے میں سوال پوچھ سکتے ہیں۔'
          : 'Assalam-o-Alaikum! I am Voice Kisan. Ask any farming question about any crop, vegetable, orchard, soil, or pest in Urdu, Roman Urdu, or English.',
      structured: DEMO_VOICE_REPLIES.default,
      timestamp: new Date().toISOString(),
      isDemo: false,
      model: 'Voice Kisan Instant AI',
    },
  ]);

  const [inputText, setInputText] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [autoSpeak, setAutoSpeak] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const recognitionRef = useRef<unknown>(null);

  const samplePrompts = [
    {
      category: 'crop',
      title: 'گندم کی کنگی اور پیلاہٹ',
      subtitle: 'Wheat Leaf Rust & Yellowing (Urdu)',
      text: 'میری گندم کے پتے پیلے ہو رہے ہیں اور نچلے حصے میں نارنجی دھبے ہیں، مجھے کیا کرنا چاہیے؟',
      lang: 'ur' as Language,
      icon: Sprout,
    },
    {
      category: 'crop',
      title: 'Tamatar & Mirch Leaf Curl',
      subtitle: 'Eco-Friendly Pest Control (Roman Urdu)',
      text: 'Mere tamatar aur mirch ke podon ke pattay mur rahe hain aur safed makhi hai, iska eco-friendly ilaj kya hai?',
      lang: 'roman' as Language,
      icon: Sprout,
    },
    {
      category: 'soil',
      title: 'DAP vs Split Urea Timing',
      subtitle: 'Fertilizer Efficiency (English)',
      text: 'When should I apply phosphatic fertilizer vs split urea in canal-irrigated wheat on alkaline loam soil?',
      lang: 'en' as Language,
      icon: Layers,
    },
    {
      category: 'water',
      title: 'کپاس اور گندم کی آبپاشی',
      subtitle: 'Critical Irrigation Timing (Urdu)',
      text: 'گندم کی گوبھ کے مرحلے پر پانی کب دینا چاہیے اور تیز ہوا میں کیا احتیاط کریں؟',
      lang: 'ur' as Language,
      icon: Droplets,
    },
    {
      category: 'weather',
      title: 'Barish aur Spray ka Waqt',
      subtitle: 'Weather & Spray Advisory (Roman Urdu)',
      text: 'Agar aglay 2 din barish ka imkan ho to kya abhi khad ya spray karna theek hai?',
      lang: 'roman' as Language,
      icon: CloudSun,
    },
    {
      category: 'market',
      title: 'Mandi Freight & Net Rate',
      subtitle: 'Harvest Selling Strategy (English)',
      text: 'How should I compare local village trader rates vs distant grain mandi prices per 40 kg maund?',
      lang: 'en' as Language,
      icon: Store,
    },
  ];

  const filteredPrompts =
    activeCategory === 'all'
      ? samplePrompts
      : samplePrompts.filter((p) => p.category === activeCategory);

  const toggleSpeechRecognition = () => {
    setSpeechError(null);
    const SpeechRecognitionConstructor =
      (window as unknown as { SpeechRecognition?: new () => unknown; webkitSpeechRecognition?: new () => unknown })
        .SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: new () => unknown }).webkitSpeechRecognition;

    if (!SpeechRecognitionConstructor) {
      setSpeechError(
        'Browser Speech Recognition is not supported in this browser window. Please use the text input or 1-click test cards below.'
      );
      return;
    }

    if (isListening && recognitionRef.current) {
      (recognitionRef.current as { stop: () => void }).stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognitionConstructor() as {
        lang: string;
        interimResults: boolean;
        maxAlternatives: number;
        onresult: (event: { results: { [key: number]: { [key: number]: { transcript: string } } } }) => void;
        onerror: (event: { error: string }) => void;
        onend: () => void;
        start: () => void;
      };

      recognition.lang = language === 'ur' ? 'ur-PK' : 'en-PK';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        const transcript = event.results?.[0]?.[0]?.transcript || '';
        if (transcript) {
          setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      recognition.onerror = (event) => {
        setSpeechError(`Microphone notice: ${event.error}. You can always type or tap a test question directly.`);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      setIsListening(true);
      recognition.start();
    } catch {
      setSpeechError('Could not start microphone capture. Please type your question below.');
      setIsListening(false);
    }
  };

  const speakReply = (text: string, langCode: 'ur-PK' | 'en-US') => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;
    utterance.rate = 0.95;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleSend = async (customText?: string, overrideLang?: Language) => {
    const query = (customText ?? inputText).trim();
    if (!query) return;

    const targetLang = overrideLang || language;
    if (!customText) setInputText('');

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    // Pre-compute instant local agronomy reply so if network takes >2.4s, farmer gets immediate answer without waiting
    const instantLocal = generateLocalVoiceReply({
      message: query,
      language: targetLang,
      farmProfile,
    });

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 2400);

    try {
      const response = await fetch('/api/voice-kisan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          message: query,
          language: targetLang,
          farmProfile,
          history: messages.slice(-3).map((m) => ({ role: m.role, text: m.text })),
        }),
      });
      window.clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data?.response) {
          const structured = data.response;
          const replyText =
            targetLang === 'en'
              ? structured.replyEnglish || structured.reply
              : targetLang === 'ur'
              ? structured.replyUrdu || structured.reply
              : structured.reply || structured.replyUrdu;

          const assistantMsg: ChatMessage = {
            id: `assistant-${Date.now()}`,
            role: 'assistant',
            text: replyText,
            structured,
            timestamp: new Date().toISOString(),
            isDemo: false,
            model: data.model || 'Gemini Voice Kisan AI (Low-Latency)',
          };
          setMessages((prev) => [...prev, assistantMsg]);
          onRecordActivity('Voice Kisan Query', query.slice(0, 48), false);
          if (autoSpeak) {
            speakReply(
              targetLang === 'en' ? structured.replyEnglish || replyText : structured.replyUrdu || replyText,
              targetLang === 'en' ? 'en-US' : 'ur-PK'
            );
          }
          setLoading(false);
          return;
        }
      }

      // Instant fallback if API returns non-200
      const replyText = targetLang === 'en' ? instantLocal.replyEnglish : instantLocal.replyUrdu;
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text: replyText,
        structured: instantLocal,
        timestamp: new Date().toISOString(),
        isDemo: false,
        model: 'Voice Kisan Instant Agronomy Engine',
      };
      setMessages((prev) => [...prev, assistantMsg]);
      onRecordActivity('Voice Kisan Query', query.slice(0, 48), false);
      if (autoSpeak) {
        speakReply(replyText, targetLang === 'en' ? 'en-US' : 'ur-PK');
      }
    } catch {
      window.clearTimeout(timeoutId);
      const replyText = targetLang === 'en' ? instantLocal.replyEnglish : instantLocal.replyUrdu;
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text: replyText,
        structured: instantLocal,
        timestamp: new Date().toISOString(),
        isDemo: false,
        model: 'Voice Kisan Instant Agronomy Engine',
      };
      setMessages((prev) => [...prev, assistantMsg]);
      onRecordActivity('Voice Kisan Query', query.slice(0, 48), false);
      if (autoSpeak) {
        speakReply(replyText, targetLang === 'en' ? 'en-US' : 'ur-PK');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E4E3DC] dark:border-[#1E2E24]">
        <div>
          <div className="text-xs font-medium text-[#1F7A4C] dark:text-[#34D399] flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" />
            <span>Module 05 · Low-Latency Multilingual Voice & Agronomy Assistant</span>
          </div>
          <h1 className="text-2xl font-bold text-[#123524] dark:text-[#F4F4F0] mt-1">
            Voice Kisan (آواز کسان)
          </h1>
          <p className="text-sm text-[#52525B] dark:text-[#A3B1A8] mt-1">
            Speak or type any question in Urdu (اردو), Roman Urdu, or English. Features low-latency responses, speech recognition, and audio readout.
          </p>
        </div>

        {/* Response Language Selector & Auto-Readout Toggle */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setAutoSpeak((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
              autoSpeak
                ? 'bg-[#1F7A4C] text-white border-[#1F7A4C]'
                : 'bg-[#F3F1EA] dark:bg-[#121D17] text-[#52525B] dark:text-[#A3B1A8] border-[#E4E3DC] dark:border-[#1E2E24]'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{autoSpeak ? 'Auto-Readout: ON' : 'Auto-Readout: OFF'}</span>
          </button>

          <div className="flex items-center gap-1 p-1 rounded-lg bg-[#F3F1EA] dark:bg-[#121D17] border border-[#E4E3DC] dark:border-[#1E2E24] text-xs">
            <button
              type="button"
              onClick={() => setLanguage('ur')}
              className={`px-2.5 py-1 rounded font-medium cursor-pointer ${
                language === 'ur'
                  ? 'bg-[#123524] text-white'
                  : 'text-[#52525B] dark:text-[#A3B1A8]'
              }`}
            >
              اردو (RTL)
            </button>
            <button
              type="button"
              onClick={() => setLanguage('roman')}
              className={`px-2.5 py-1 rounded font-medium cursor-pointer ${
                language === 'roman'
                  ? 'bg-[#123524] text-white'
                  : 'text-[#52525B] dark:text-[#A3B1A8]'
              }`}
            >
              Roman Urdu
            </button>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded font-medium cursor-pointer ${
                language === 'en'
                  ? 'bg-[#123524] text-white'
                  : 'text-[#52525B] dark:text-[#A3B1A8]'
              }`}
            >
              English
            </button>
          </div>

          {isSpeaking && (
            <button
              type="button"
              onClick={stopSpeaking}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-lg cursor-pointer"
            >
              <VolumeX className="w-3.5 h-3.5" />
              <span>Stop Audio</span>
            </button>
          )}
        </div>
      </div>

      {/* Interactive Domain Filter & 1-Click Visual Test Prompts */}
      <div className="rounded-xl border border-[#E4E3DC] dark:border-[#1E2E24] bg-white dark:bg-[#121D17] p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-[#123524] dark:text-[#F4F4F0]">
              Interactive Test Questions by Farming Domain (ایک کلک میں ٹیسٹ کریں)
            </h2>
            <p className="text-xs text-[#52525B] dark:text-[#A3B1A8]">
              Click any card below to test instant multilingual voice & text advisory across crops, water, soil, weather, and mandi.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {[
              { id: 'all', label: 'All Domains' },
              { id: 'crop', label: 'Crop Disease' },
              { id: 'soil', label: 'Soil & Khad' },
              { id: 'water', label: 'Irrigation' },
              { id: 'weather', label: 'Weather' },
              { id: 'market', label: 'Mandi' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-[#123524] text-white dark:bg-[#1F7A4C]'
                    : 'bg-[#FAF9F5] dark:bg-[#0B120E] text-[#52525B] dark:text-[#A3B1A8] border border-[#E4E3DC] dark:border-[#1E2E24]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredPrompts.map((p, idx) => {
            const Icon = p.icon;
            return (
              <button
                key={idx}
                type="button"
                disabled={loading}
                onClick={() => {
                  setLanguage(p.lang);
                  handleSend(p.text, p.lang);
                }}
                className="text-left p-3.5 rounded-lg border border-[#E4E3DC] dark:border-[#1E2E24] bg-[#FAF9F5] dark:bg-[#0B120E] hover:border-[#1F7A4C] dark:hover:border-[#34D399] transition-all group cursor-pointer flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-[#123524]/10 dark:bg-[#1F7A4C]/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-4 h-4 text-[#1F7A4C] dark:text-[#34D399]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-[#123524] dark:text-[#F4F4F0] group-hover:text-[#1F7A4C] dark:group-hover:text-[#34D399] truncate">
                    {p.title}
                  </div>
                  <div className="text-[11px] text-[#52525B] dark:text-[#A3B1A8] mb-1">
                    {p.subtitle}
                  </div>
                  <div className="text-xs text-[#18181B] dark:text-[#E4E3DC] line-clamp-2">
                    “{p.text}”
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Conversation Feed */}
      <div className="rounded-xl border border-[#E4E3DC] dark:border-[#1E2E24] bg-white dark:bg-[#121D17] p-6 space-y-6">
        <div className="space-y-5 max-h-[520px] overflow-y-auto pr-1">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            const isUrduText = /[\u0600-\u06FF]/.test(msg.text);

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div
                  dir={isUrduText ? 'rtl' : 'ltr'}
                  className={`max-w-3xl rounded-xl p-4 sm:p-5 border ${
                    isUser
                      ? 'bg-[#123524] text-white border-[#123524]'
                      : 'bg-[#FAF9F5] dark:bg-[#0B120E] text-[#18181B] dark:text-[#F4F4F0] border-[#E4E3DC] dark:border-[#1E2E24]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 text-[11px] opacity-80 mb-2">
                    <span className="font-semibold flex items-center gap-1.5">
                      <MessageSquare className="w-3 h-3" />
                      {isUser ? 'Farmer Question' : msg.model || 'Voice Kisan AI'}
                    </span>
                    <span className="font-mono tabular-nums">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-sm sm:text-base leading-relaxed">{msg.text}</p>

                  {/* Structured Next Steps & Bilingual Readout for Assistant Replies */}
                  {!isUser && msg.structured && (
                    <div className="mt-4 pt-4 border-t border-[#E4E3DC] dark:border-[#1E2E24] space-y-3 text-xs">
                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() => speakReply(msg.structured!.replyUrdu || msg.text, 'ur-PK')}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1F7A4C]/10 text-[#1F7A4C] dark:text-[#34D399] font-semibold hover:underline cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>اردو آواز سنیں (Read Urdu Aloud)</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => speakReply(msg.structured!.replyEnglish || msg.text, 'en-US')}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1F7A4C]/10 text-[#1F7A4C] dark:text-[#34D399] font-semibold hover:underline cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Read English Aloud</span>
                        </button>
                      </div>

                      {msg.structured.nextSteps && msg.structured.nextSteps.length > 0 && (
                        <div>
                          <div className="font-bold text-[#123524] dark:text-[#F4F4F0] mb-1.5 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#1F7A4C] dark:text-[#34D399]" />
                            <span>عملی اقدامات / Practical Next Steps:</span>
                          </div>
                          <ul className="space-y-1 text-[#52525B] dark:text-[#A3B1A8]">
                            {msg.structured.nextSteps.map((s, idx) => (
                              <li key={idx}>
                                {idx + 1}. {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {msg.structured.cautionNote && (
                        <div className="flex items-start gap-2 text-[#D97706] dark:text-amber-400 pt-1">
                          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                          <span>{msg.structured.cautionNote}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Speech Notice */}
        {speechError && (
          <div className="p-3 rounded-lg border border-amber-300 dark:border-amber-800 bg-amber-50/80 dark:bg-amber-950/40 text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{speechError}</span>
          </div>
        )}

        {/* Input Composer */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="pt-4 border-t border-[#E4E3DC] dark:border-[#1E2E24] flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
        >
          <button
            type="button"
            onClick={toggleSpeechRecognition}
            className={`inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-xs font-semibold border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              isListening
                ? 'bg-red-600 text-white border-red-600'
                : 'bg-[#F3F1EA] dark:bg-[#0B120E] text-[#123524] dark:text-[#F4F4F0] border-[#E4E3DC] dark:border-[#1E2E24] hover:border-[#1F7A4C]'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-4 h-4" />
                <span>Listening... Click to Stop</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 text-[#1F7A4C] dark:text-[#34D399]" />
                <span>Speak ({language === 'ur' ? 'اردو' : 'Voice'})</span>
              </>
            )}
          </button>

          <input
            type="text"
            dir={language === 'ur' ? 'rtl' : 'ltr'}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              language === 'ur'
                ? 'یہاں اپنا زرعی سوال اردو میں لکھیں...'
                : language === 'roman'
                ? 'Apna sawal Roman Urdu mein likhein (e.g. Gandum ko paani kab dein?)...'
                : 'Type your agricultural question in English, Urdu, or Roman Urdu...'
            }
            className="flex-1 px-4 py-3 text-sm rounded-lg border border-[#E4E3DC] dark:border-[#1E2E24] bg-[#FAF9F5] dark:bg-[#0B120E] text-[#18181B] dark:text-[#F4F4F0] focus:outline-2 focus:outline-[#1F7A4C]"
          />

          <button
            type="submit"
            disabled={loading || !inputText.trim()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-white bg-[#123524] hover:bg-[#1F7A4C] dark:bg-[#1F7A4C] disabled:opacity-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Responding...</span>
              </>
            ) : (
              <>
                <span>Ask Voice Kisan</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

