import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Sparkles,
  BookOpen,
  AlertTriangle,
  RotateCcw,
  Scale,
  ExternalLink
} from 'lucide-react';
import { ChatMessage, AppLanguage, User } from '../types.ts';
import { startSpeechRecognition, speakWithBrowser, stopSpeaking, playGeminiAudio } from '../utils/audio.ts';

interface ChatbotViewProps {
  language: AppLanguage;
  currentUser: User;
  initialQuery?: string;
}

export const ChatbotView: React.FC<ChatbotViewProps> = ({
  language,
  currentUser,
  initialQuery = '',
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text:
        language === 'hi'
          ? 'नमस्ते! मैं आपका स्मार्ट विधिक सहायक हूँ। आप मुझसे भारतीय न्याय संहिता (BNS 2023), नागरिक सुरक्षा संहिता (BNSS), साक्ष्य अधिनियम (BSA), संविधान, एफआईआर प्रक्रिया या उपभोक्ता अधिकारों के बारे में कोई भी प्रश्न हिंदी या अंग्रेजी में पूछ सकते हैं।'
          : 'Welcome to Smart Legal Assistant. I am grounded in the Bharatiya Nyaya Sanhita (BNS 2023), BNSS procedural codes, BSA evidence law, and the Constitution of India. Ask any legal question, request comparative IPC/BNS analysis, or clarify your statutory rights.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      citations: ['BNS 2023', 'BNSS 2023', 'Constitution of India'],
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const recognitionRef = useRef<{ stop: () => void } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPills = [
    'Explain Section 103 BNS vs IPC 302',
    'What is Zero FIR under Section 173 BNSS?',
    'What are my rights if arrested by police?',
    'How to report cyber financial fraud within golden hour?',
    'What is Section 318 BNS for cheating and 420 IPC?',
    'Explain Article 21 Right to Privacy and Personal Liberty',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    if (initialQuery) {
      handleSendMessage(initialQuery);
    }
  }, [initialQuery]);

  const handleSendMessage = async (queryText = input) => {
    const textToSend = queryText.trim();
    if (!textToSend || loading) return;

    setInput('');

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const historyPayload = messages.slice(-6).map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        content: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          role: currentUser.role,
          language,
          conversationHistory: historyPayload,
          userId: currentUser.id,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const assistantMsg: ChatMessage = {
          id: data.chatId || `ast-${Date.now()}`,
          sender: 'assistant',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          citations: data.citations || [],
          retrievedSources: data.retrievedSources || [],
        };
        setMessages(prev => [...prev, assistantMsg]);
      } else {
        throw new Error('Server returned an error');
      }
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: 'I encountered an issue retrieving legal provisions. Please check your connection and try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  // Voice Input (Speech-to-Text)
  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      setIsRecording(true);
      const rec = startSpeechRecognition(
        transcript => {
          setInput(prev => (prev ? `${prev} ${transcript}` : transcript));
          setIsRecording(false);
        },
        err => {
          console.warn('Speech recognition warning:', err);
          setIsRecording(false);
        },
        language === 'hi' ? 'hi' : 'en'
      );
      recognitionRef.current = rec;
    }
  };

  // Voice Output (TTS)
  const handleToggleVoice = async (msg: ChatMessage) => {
    if (activeAudioId === msg.id) {
      stopSpeaking();
      setActiveAudioId(null);
      return;
    }

    setActiveAudioId(msg.id);

    try {
      // First try Gemini high-fidelity TTS endpoint
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: msg.text,
          language: language === 'hi' ? 'hi' : 'en',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.audioBase64) {
          await playGeminiAudio(data.audioBase64, data.mimeType);
          setActiveAudioId(null);
          return;
        }
      }
      // Fallback to browser SpeechSynthesis
      speakWithBrowser(msg.text, language === 'hi' ? 'hi' : 'en');
    } catch (err) {
      speakWithBrowser(msg.text, language === 'hi' ? 'hi' : 'en');
    } finally {
      setTimeout(() => setActiveAudioId(null), 8000);
    }
  };

  const handleCopy = (msg: ChatMessage) => {
    navigator.clipboard.writeText(msg.text);
    setCopiedId(msg.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    setMessages([messages[0]]);
    stopSpeaking();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[550px] max-w-5xl mx-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 px-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/90">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Smart Legal AI Chat</span>
              <span className="text-[10px] px-2 py-0.2 rounded-full font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                BNS RAG
              </span>
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Grounded in 2023 Criminal Codes, Constitution &amp; Special Acts
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleClear}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs transition cursor-pointer flex items-center gap-1"
            title="Reset Conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map(msg => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${
                  isUser
                    ? 'bg-indigo-600 text-white'
                    : 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                }`}
              >
                {isUser ? 'You' : <Scale className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div className="space-y-1.5 max-w-[85%]">
                <div
                  className={`p-4 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-slate-700/60'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Citations and Controls for Assistant */}
                {!isUser && (
                  <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-[11px] text-slate-400">
                    {/* Citations Badges */}
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1">
                        <BookOpen className="w-3 h-3 text-indigo-500" />
                        <span className="font-semibold text-slate-500">Sources:</span>
                        {msg.citations.map((cite, i) => (
                          <span
                            key={i}
                            className="px-1.5 py-0.2 rounded bg-slate-200/80 dark:bg-slate-700/80 text-slate-700 dark:text-slate-300 text-[10px]"
                          >
                            {cite}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Actions: Copy & Listen */}
                    <div className="flex items-center gap-1.5 ml-auto">
                      <button
                        onClick={() => handleToggleVoice(msg)}
                        className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition cursor-pointer"
                        title={activeAudioId === msg.id ? 'Stop voice' : 'Listen with Gemini voice'}
                      >
                        {activeAudioId === msg.id ? (
                          <VolumeX className="w-3.5 h-3.5 text-rose-500" />
                        ) : (
                          <Volume2 className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        onClick={() => handleCopy(msg)}
                        className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition cursor-pointer"
                        title="Copy message"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3 max-w-3xl">
            <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-950 flex items-center justify-center text-purple-600">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-3.5 rounded-2xl rounded-tl-none bg-slate-100 dark:bg-slate-800 text-xs text-slate-500 flex items-center gap-2">
              <span>Retrieving statutory legal codes and formulating grounded answer...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Query Pills */}
      {messages.length < 3 && (
        <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="text-[11px] font-semibold text-slate-400 mb-1.5">Suggested Queries:</div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {suggestedPills.map((pill, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(pill)}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] border border-slate-200 dark:border-slate-700 hover:border-indigo-400 whitespace-nowrap transition cursor-pointer"
              >
                {pill}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Input Bar */}
      <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          {/* Voice Input Button */}
          <button
            type="button"
            onClick={toggleRecording}
            className={`p-2.5 rounded-xl transition cursor-pointer ${
              isRecording
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
            title={isRecording ? 'Listening (Click to stop)' : 'Speak query via Microphone'}
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Text Input Field */}
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={
              isRecording
                ? 'Listening to speech in Hindi or English...'
                : language === 'hi'
                ? 'कानूनी सवाल पूछें (उदा: धारा 103 BNS क्या है? या साइबर फ्रॉड होने पर क्या करें?)...'
                : 'Ask any legal question (e.g. Can police refuse to file an FIR?)...'
            }
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition disabled:opacity-40 flex items-center gap-1.5 cursor-pointer"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="mt-2 text-[10px] text-center text-slate-400 flex items-center justify-center gap-1">
          <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0" />
          <span>Information provided is for educational & awareness purposes and does not constitute formal legal counsel.</span>
        </div>
      </div>
    </div>
  );
};
