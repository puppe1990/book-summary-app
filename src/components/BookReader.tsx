import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Play, Pause, Bookmark, Check, Volume2, 
  ChevronRight, Sparkles, Sliders, Type, VolumeX, FastForward
} from 'lucide-react';
import { Book, UserProgress } from '../types';

interface BookReaderProps {
  book: Book;
  onBack: () => void;
  progress: UserProgress;
  toggleFavorite: (bookId: string) => void;
  markAsRead: (bookId: string) => void;
}

const VOICES = [
  { id: 'v-1', name: 'Helena (Voz Humana)' },
  { id: 'v-2', name: 'Ricardo (Profissional)' },
  { id: 'v-3', name: 'Gabriel (Foco)' }
];

export default function BookReader({ book, onBack, progress, toggleFavorite, markAsRead }: BookReaderProps) {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md');
  const [fontFamily, setFontFamily] = useState<'sans' | 'serif'>('serif');
  
  // Audio Simulator States
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioSpeed, setAudioSpeed] = useState<number>(1.25);
  const [selectedVoice, setSelectedVoice] = useState(VOICES[0].id);
  const [showSettings, setShowSettings] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isBookmarked = progress.favoriteBooks.includes(book.id);
  const isCompleted = progress.readBooks.includes(book.id);

  // Auto clean audio timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Simulating audio timeline movement
  useEffect(() => {
    if (isPlayingAudio) {
      timerRef.current = setInterval(() => {
        setAudioProgress(prev => {
          if (prev >= 100) {
            setIsPlayingAudio(false);
            if (timerRef.current) clearInterval(timerRef.current);
            return 100;
          }
          return prev + (0.5 * audioSpeed);
        });
      }, 300);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlayingAudio, audioSpeed]);

  const handleToggleAudio = () => {
    if (audioProgress >= 100) {
      setAudioProgress(0);
    }
    setIsPlayingAudio(!isPlayingAudio);
  };

  const handleResetAudio = () => {
    setAudioProgress(0);
    setIsPlayingAudio(false);
  };

  const activeChapter = book.chapters[activeChapterIndex] || book.chapters[0];

  // Font Size class resolution
  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'sm': return 'text-sm leading-relaxed';
      case 'lg': return 'text-lg leading-relaxed';
      case 'xl': return 'text-xl leading-relaxed';
      default: return 'text-base leading-relaxed';
    }
  };

  // Convert content with simulated markdown format to HTML snippets
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, index) => {
      if (line.startsWith('### ')) {
        return (
          <h4 key={index} className="text-lg font-bold text-slate-800 mt-6 mb-3 tracking-tight font-sans">
            {line.replace('### ', '')}
          </h4>
        );
      }
      if (line.startsWith('*   **')) {
        const parts = line.replace('*   **', '').split('**');
        return (
          <div key={index} className="flex gap-2.5 my-2 pl-2">
            <span className="text-indigo-500 font-bold">•</span>
            <p className="text-slate-600">
              <strong className="text-slate-800">{parts[0]}</strong>{parts.slice(1).join('')}
            </p>
          </div>
        );
      }
      if (line.startsWith('1.  **')) {
        const parts = line.replace('1.  **', '').split('**');
        return (
          <div key={index} className="flex gap-2.5 my-2 pl-2">
            <span className="text-indigo-500 font-bold font-mono">1.</span>
            <p className="text-slate-600">
              <strong className="text-slate-800">{parts[0]}</strong>{parts.slice(1).join('')}
            </p>
          </div>
        );
      }
      if (line.startsWith('2.  **')) {
        const parts = line.replace('2.  **', '').split('**');
        return (
          <div key={index} className="flex gap-2.5 my-2 pl-2">
            <span className="text-indigo-500 font-bold font-mono">2.</span>
            <p className="text-slate-600">
              <strong className="text-slate-800">{parts[0]}</strong>{parts.slice(1).join('')}
            </p>
          </div>
        );
      }
      if (line.startsWith('3.  **')) {
        const parts = line.replace('3.  **', '').split('**');
        return (
          <div key={index} className="flex gap-2.5 my-2 pl-2">
            <span className="text-indigo-500 font-bold font-mono">3.</span>
            <p className="text-slate-600">
              <strong className="text-slate-800">{parts[0]}</strong>{parts.slice(1).join('')}
            </p>
          </div>
        );
      }
      if (line.startsWith('4.  **')) {
        const parts = line.replace('4.  **', '').split('**');
        return (
          <div key={index} className="flex gap-2.5 my-2 pl-2">
            <span className="text-indigo-500 font-bold font-mono">4.</span>
            <p className="text-slate-600">
              <strong className="text-slate-800">{parts[0]}</strong>{parts.slice(1).join('')}
            </p>
          </div>
        );
      }
      if (line.startsWith('```')) {
        return null; // hide code sections or simplify
      }
      if (line.trim() === '') {
        return <div key={index} className="h-3" />;
      }
      return (
        <p key={index} className="text-slate-600 leading-relaxed mb-4">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-6 font-sans flex flex-col md:flex-row gap-6 items-start" id={`book-reader-${book.id}`}>
      
      {/* LEFT COLUMN: Sidebar Navigation & Audiobook Widget */}
      <div className="w-full md:w-80 shrink-0 space-y-5" id="reader-left-sidebar">
        {/* Back button */}
        <button 
          onClick={onBack}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-medium text-sm py-1"
          id="btn-back-catalog"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Catálogo
        </button>

        {/* Small Book Details Card */}
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <div className={`aspect-[3/4] w-32 mx-auto rounded-lg shadow-md bg-gradient-to-br ${book.coverColor} p-4 flex flex-col justify-between mb-4`}>
            <div className={`text-[9px] uppercase tracking-wider font-bold ${book.coverTextColor}/70 text-right`}>Smart Summary</div>
            <div className="space-y-1">
              <h4 className={`text-xs font-serif font-bold ${book.coverTextColor} line-clamp-3 leading-tight`}>{book.title}</h4>
              <p className={`text-[9px] ${book.coverTextColor}/80`}>{book.author}</p>
            </div>
          </div>

          <h3 className="font-bold text-slate-800 text-base leading-tight mb-1">{book.title}</h3>
          <p className="text-slate-400 text-xs mb-3">Escrito por {book.author}</p>
          
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs bg-slate-100 text-slate-600 py-0.5 px-2.5 rounded-full font-medium">
              {book.category}
            </span>
            <span className="text-xs text-slate-400">• {book.readTimeMin} min de leitura</span>
          </div>

          {/* Quick status bar */}
          <div className="border-t border-slate-100 pt-3 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Seu progresso da leitura:</span>
              <span className="font-semibold text-slate-700">
                {Math.round(((activeChapterIndex + 1) / book.chapters.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-indigo-600 h-full rounded-full transition-all duration-300" 
                style={{ width: `${((activeChapterIndex + 1) / book.chapters.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Simulated Smart Audio Player */}
        <div className="bg-slate-900 text-slate-100 rounded-xl p-5 shadow-lg border border-slate-800/80 relative overflow-hidden" id="audio-widget">
          {/* Subtle decoration light */}
          <div className="absolute -right-16 -bottom-16 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl" />

          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">Audio-Player Inteligente</span>
            </div>
            
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="text-slate-400 hover:text-slate-200 transition-colors"
              id="btn-toggle-audio-settings"
              aria-label="Configurações de áudio"
            >
              <Sliders className="w-4 h-4" />
            </button>
          </div>

          {/* Settings panel overlay inside audio widget */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-slate-800/90 rounded-lg p-3 mb-3 border border-slate-700/60 overflow-hidden space-y-2 text-xs"
              >
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1">Escolha o Narrador:</label>
                  <select
                    value={selectedVoice}
                    onChange={(e) => setSelectedVoice(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1 text-slate-200 font-medium focus:outline-none"
                  >
                    {VOICES.map(v => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1">Velocidade:</label>
                  <div className="flex gap-1.5">
                    {[1.0, 1.25, 1.5, 2.0].map(speed => (
                      <button
                        key={speed}
                        onClick={() => setAudioSpeed(speed)}
                        className={`flex-1 py-1 rounded border text-[10px] font-mono ${
                          audioSpeed === speed 
                            ? 'bg-indigo-600 border-indigo-500 text-white font-bold' 
                            : 'bg-slate-900 border-slate-700 hover:bg-slate-900/80 text-slate-400'
                        }`}
                      >
                        {speed.toFixed(2)}x
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-xs font-semibold line-clamp-1 text-slate-200 mb-0.5">{activeChapter.title}</p>
          <p className="text-[10px] text-slate-400 mb-4 flex items-center gap-1">
            <span>Voz selecionada:</span>
            <span className="text-indigo-400 font-medium">
              {VOICES.find(v => v.id === selectedVoice)?.name.split(' ')[0]}
            </span>
          </p>

          <div className="space-y-2">
            {/* Audio Timeline progress */}
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden relative cursor-pointer group" onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const nextPercentage = Math.min(Math.max((clickX / rect.width) * 100, 0), 100);
              setAudioProgress(nextPercentage);
            }}>
              <div 
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-150" 
                style={{ width: `${audioProgress}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[9px] text-slate-500 font-mono">
              <span>{Math.floor((audioProgress * book.readTimeMin * 60) / 100 / 60)}:{(Math.floor((audioProgress * book.readTimeMin * 60) / 100) % 60).toString().padStart(2, '0')}</span>
              <span>{book.readTimeMin}:00</span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <button
              onClick={handleResetAudio}
              className="text-slate-500 hover:text-slate-300 transition-colors p-1"
              title="Reiniciar áudio"
            >
              <VolumeX className="w-4 h-4" />
            </button>

            {/* Audio center control Play/Pause */}
            <button
              onClick={handleToggleAudio}
              className="w-11 h-11 bg-white hover:bg-indigo-50 text-slate-950 rounded-full flex items-center justify-center shadow-md active:scale-95 transition-all text-center"
              id="btn-play-pause-audio"
            >
              {isPlayingAudio ? (
                <Pause className="w-5 h-5 fill-slate-900 stroke-none ml-0" />
              ) : (
                <Play className="w-5 h-5 fill-slate-900 stroke-none ml-0.5" />
              )}
            </button>

            <button
              onClick={() => {
                setAudioProgress(prev => Math.min(prev + 10, 100));
              }}
              className="text-slate-500 hover:text-slate-300 transition-all p-1"
              title="Avançar 10 segundos"
            >
              <FastForward className="w-4 h-4" />
            </button>
          </div>

          {/* Equalizer simulation animation only if playing */}
          {isPlayingAudio && (
            <div className="flex items-end justify-center gap-1 h-5 mt-4">
              {[0.3, 0.7, 0.4, 0.8, 0.2, 0.9, 0.5, 0.3, 0.6].map((multiplier, i) => (
                <motion.div
                  key={i}
                  animate={{ height: ['4px', `${multiplier * 20}px`, '4px'] }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.8 + (i * 0.1),
                    ease: 'easeInOut'
                  }}
                  className="bg-indigo-500 w-1 rounded-full"
                />
              ))}
            </div>
          )}
        </div>

        {/* Chapters list navigation */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Capítulos ({book.chapters.length})</h4>
          </div>
          <div className="divide-y divide-slate-50">
            {book.chapters.map((chapter, i) => {
              const active = i === activeChapterIndex;
              return (
                <button
                  key={chapter.id}
                  onClick={() => {
                    setActiveChapterIndex(i);
                    // Reset audio simulation progress when switching chapters
                    setAudioProgress(0);
                    setIsPlayingAudio(false);
                  }}
                  className={`w-full text-left px-5 py-3.5 text-xs font-medium flex items-center justify-between transition-all ${
                    active 
                      ? 'bg-indigo-50 text-indigo-700' 
                      : 'text-slate-600 hover:bg-slate-50/60 hover:text-slate-950'
                  }`}
                  id={`chapter-nav-${i}`}
                >
                  <span className="line-clamp-2">{chapter.title}</span>
                  <ChevronRight className={`w-3.5 h-3.5 ${active ? 'text-indigo-600' : 'text-slate-300'}`} />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Interactive Text Reader */}
      <div className="flex-1 w-full bg-white rounded-xl border border-slate-150/80 shadow-sm flex flex-col" id="reader-right-content">
        
        {/* Top Control Bar (Font sizing, fontFamily, bookmarks, complete tracker) */}
        <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap gap-4 justify-between items-center bg-slate-50/50 rounded-t-xl" id="reader-top-bar">
          <div className="flex items-center gap-3">
            {/* Font Family selector */}
            <div className="flex border border-slate-200 rounded-lg p-0.5 bg-white shadow-sm">
              <button
                onClick={() => setFontFamily('sans')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  fontFamily === 'sans' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-800'
                }`}
                id="font-sans"
              >
                Sans
              </button>
              <button
                onClick={() => setFontFamily('serif')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  fontFamily === 'serif' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-800'
                }`}
                id="font-serif"
              >
                Serif
              </button>
            </div>

            {/* Font Size controls */}
            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5 shadow-sm">
              <span className="text-[10px] text-slate-400 font-bold px-2 uppercase">Alt</span>
              {(['sm', 'md', 'lg', 'xl'] as const).map(sz => (
                <button
                  key={sz}
                  onClick={() => setFontSize(sz)}
                  className={`w-7 h-7 rounded flex items-center justify-center font-bold text-xs uppercase transition-all ${
                    fontSize === sz ? 'bg-slate-100 text-indigo-700 font-extrabold' : 'text-slate-400 hover:text-slate-600'
                  }`}
                  id={`font-size-${sz}`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Bookmark toggle */}
            <button
              onClick={() => toggleFavorite(book.id)}
              className={`p-2 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all ${
                isBookmarked 
                  ? 'bg-amber-50 border-amber-200 text-amber-700 shadow-sm' 
                  : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
              id="btn-bookmark-reader"
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
              <span>{isBookmarked ? 'Salvo nos Favoritos' : 'Salvar Resumo'}</span>
            </button>

            {/* Complete tracking */}
            <button
              onClick={() => markAsRead(book.id)}
              className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isCompleted 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                  : 'bg-indigo-600 border-indigo-500 text-white hover:bg-indigo-700 shadow-sm active:translate-y-px'
              }`}
              id="btn-mark-completed"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{isCompleted ? 'Concluído ✓' : 'Marcar Concluído'}</span>
            </button>
          </div>
        </div>

        {/* Text Container */}
        <div className="p-6 md:p-10 flex-1 max-w-3xl mx-auto w-full">
          {/* Key takeaway indicator at chapter introduction */}
          {activeChapterIndex === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-indigo-50/60 border border-indigo-100/50 rounded-2xl p-5 mb-8 text-sm"
              id="takeaways-banner"
            >
              <h4 className="font-bold text-indigo-900 pb-2 flex items-center gap-1.5 leading-none">
                <Sparkles className="w-4.5 h-4.5 text-indigo-500 fill-indigo-200" />
                Lições e Liames Essenciais do Livro
              </h4>
              <ul className="space-y-2 mt-1">
                {book.takeaways.map((takeaway, i) => (
                  <li key={i} className="flex gap-2 text-slate-600 font-medium leading-relaxed">
                    <span className="text-indigo-500 font-bold font-mono">✦</span>
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Chapter headers */}
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-serif font-black tracking-tight text-slate-900">
              {activeChapter.title}
            </h2>
            <div className="h-1 w-12 bg-indigo-500 rounded mt-3" />
          </div>

          {/* Interactive render formatted content */}
          <div className={`${getFontSizeClass()} ${fontFamily === 'serif' ? 'font-serif' : 'font-sans'}`} id="reading-content-area">
            {renderFormattedContent(activeChapter.content)}
          </div>
        </div>

        {/* Bottom Navigator */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/30 flex justify-between rounded-b-xl">
          <button
            disabled={activeChapterIndex === 0}
            onClick={() => {
              setActiveChapterIndex(prev => prev - 1);
              setAudioProgress(0);
              setIsPlayingAudio(false);
            }}
            className="px-4 py-2 text-xs font-semibold border border-slate-200 rounded-lg text-slate-500 hover:text-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all bg-white"
            id="btn-prev-chapter"
          >
            Capítulo Anterior
          </button>

          {activeChapterIndex < book.chapters.length - 1 ? (
            <button
              onClick={() => {
                setActiveChapterIndex(prev => prev + 1);
                setAudioProgress(0);
                setIsPlayingAudio(false);
              }}
              className="px-4 py-2 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all shadow-sm"
              id="btn-next-chapter"
            >
              Próximo Capítulo
            </button>
          ) : (
            <button
              onClick={() => {
                markAsRead(book.id);
                onBack();
              }}
              className="px-4 py-2 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all shadow-sm shadow-emerald-600/10"
              id="btn-finish-reading"
            >
              Finalizar Resumo 📘
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
