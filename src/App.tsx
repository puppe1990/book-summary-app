import { useState, useEffect } from 'react';
import { 
  BookOpen, Search, Zap, Check, Bookmark, Sparkles, 
  Crown, Heart, TrendingUp, X, Award, Info, RefreshCw, Sun, Moon,
  Sliders, ChevronRight
} from 'lucide-react';
import { Book, SubscriptionState, UserProgress, BookReview } from './types';
import { BOOKS_DATA, CATEGORIES, MOCK_REVIEWS } from './booksData';
import SubscriptionModal from './components/SubscriptionModal';
import BookCard from './components/BookCard';
import BookReader from './components/BookReader';
import ReviewSection from './components/ReviewSection';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('knowledge_wall_dark_mode');
      if (stored) return stored === 'true';
    } catch (e) {
      console.warn('Error reading dark_mode from localStorage:', e);
    }
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem('knowledge_wall_dark_mode', String(isDarkMode));
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  // 1. Initial State Loaders (prevents re-render cycles)
  const [subscription, setSubscription] = useState<SubscriptionState>(() => {
    try {
      const stored = localStorage.getItem('sub_state');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Error reading sub_state from localStorage:', e);
    }
    return {
      isSubscribed: false,
      planId: null,
      billingCycle: null,
      expiresAt: null
    };
  });

  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const stored = localStorage.getItem('user_progress');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (!parsed.readLaterBooks) {
          parsed.readLaterBooks = [];
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Error reading user_progress from localStorage:', e);
    }
    return {
      readBooks: [],
      favoriteBooks: [],
      readLaterBooks: [],
      currentChapterIndexes: {}
    };
  });

  const [reviews, setReviews] = useState<BookReview[]>(() => {
    try {
      const stored = localStorage.getItem('book_reviews');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Error reading book_reviews from localStorage:', e);
    }
    return MOCK_REVIEWS;
  });

  // Main navigation and UI states
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeSuggestIndex, setActiveSuggestIndex] = useState<number>(-1);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [activeTab, setActiveTab] = useState<'all' | 'favorites' | 'completed' | 'read_later'>('all');
  
  // Simulated stats state (triggered on achievements)
  const [showStatsToast, setShowStatsToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Personal Reading Pace (PPM - Palavras por minuto) state
  const [readingPace, setReadingPace] = useState<number>(() => {
    try {
      const stored = localStorage.getItem('personal_reading_pace');
      if (stored) return Number(stored);
    } catch (e) {
      console.warn('Error reading personal_reading_pace from localStorage:', e);
    }
    return 200; // default PPM baseline matching standard speeds
  });

  useEffect(() => {
    localStorage.setItem('personal_reading_pace', String(readingPace));
  }, [readingPace]);

  // 2. State persistence effect triggered only on primitive state changes
  useEffect(() => {
    localStorage.setItem('sub_state', JSON.stringify(subscription));
  }, [subscription.isSubscribed, subscription.planId, subscription.billingCycle]);

  useEffect(() => {
    localStorage.setItem('user_progress', JSON.stringify(progress));
  }, [progress.readBooks.length, progress.favoriteBooks.length, progress.readLaterBooks?.length]);

  useEffect(() => {
    localStorage.setItem('book_reviews', JSON.stringify(reviews));
  }, [reviews.length]);

  useEffect(() => {
    setActiveSuggestIndex(-1);
  }, [searchQuery]);

  // Trigger quick success alerts
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowStatsToast(true);
    setTimeout(() => setShowStatsToast(false), 4500);
  };

  // 3. User Actions handlers
  const handleSubscribe = (newSub: SubscriptionState) => {
    setSubscription(newSub);
    triggerToast('Assinatura Premium ativada! Acesso irrestrito liberado ⚡');
  };

  const handleCancelSubscription = () => {
    if (window.confirm('Tem certeza de que deseja cancelar os benefícios do plano Premium? Suas anotações locais serão mantidas.')) {
      setSubscription({
        isSubscribed: false,
        planId: null,
        billingCycle: null,
        expiresAt: null
      });
      triggerToast('Assinatura cancelada. Você retornou ao plano gratuito.');
    }
  };

  const toggleFavorite = (bookId: string) => {
    const isFav = progress.favoriteBooks.includes(bookId);
    let updated: string[];
    if (isFav) {
      updated = progress.favoriteBooks.filter(id => id !== bookId);
      triggerToast('Removido dos favoritos.');
    } else {
      updated = [...progress.favoriteBooks, bookId];
      triggerToast('Salvo nos favoritos para consultar depois!');
    }
    setProgress(prev => ({
      ...prev,
      favoriteBooks: updated
    }));
  };

  const toggleReadLater = (bookId: string) => {
    const currentList = progress.readLaterBooks || [];
    const isSaved = currentList.includes(bookId);
    let updated: string[];
    if (isSaved) {
      updated = currentList.filter(id => id !== bookId);
      triggerToast('Removido de Ler Depois.');
    } else {
      updated = [...currentList, bookId];
      triggerToast('Salvo nos favoritos para ler depois! 📅');
    }
    setProgress(prev => ({
      ...prev,
      readLaterBooks: updated
    }));
  };

  const markAsRead = (bookId: string) => {
    const isCompleted = progress.readBooks.includes(bookId);
    let updated: string[];
    if (isCompleted) {
      updated = progress.readBooks.filter(id => id !== bookId);
      triggerToast('Remarcado como não concluído ainda.');
    } else {
      updated = [...progress.readBooks, bookId];
      triggerToast('Parabéns! Mais um resumo absorvido com sucesso! 📘');
    }
    setProgress(prev => ({
      ...prev,
      readBooks: updated
    }));
  };

  const handleAddReview = (newReview: BookReview) => {
    setReviews(prev => [newReview, ...prev]);
    triggerToast('Obrigado pela sua contribuição! Sua avaliação foi cadastrada.');
  };

  // Reset progress data helper
  const handleResetProgressData = () => {
    if (window.confirm('Deseja redefinir todo o progresso de leitura e favoritos?')) {
      setProgress({
        readBooks: [],
        favoriteBooks: [],
        readLaterBooks: [],
        currentChapterIndexes: {}
      });
      triggerToast('Histórico e progresso apagados com sucesso.');
    }
  };

  // 4. Computation (Filtering)
  const filteredBooks = BOOKS_DATA.filter(book => {
    // Category Match
    const matchesCategory = selectedCategory === 'Todos' || book.category === selectedCategory;
    
    // Search Query Match
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          book.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Tab Filter Match
    const matchesTab = 
      activeTab === 'all' ||
      (activeTab === 'favorites' && progress.favoriteBooks.includes(book.id)) ||
      (activeTab === 'completed' && progress.readBooks.includes(book.id)) ||
      (activeTab === 'read_later' && (progress.readLaterBooks || []).includes(book.id));

    return matchesCategory && matchesSearch && matchesTab;
  });

  // Stats calculation
  const totalReadCount = progress.readBooks.length;
  const estimatedHoursSaved = totalReadCount * 8.5; // average self-help book takes ~9 hours to read, summary takes 15 mins. Yes!

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col text-slate-800 dark:text-slate-100 selection:bg-indigo-100 dark:selection:bg-indigo-950/75 selection:text-indigo-900 dark:selection:text-indigo-200 transition-colors duration-300 font-sans">
      
      {/* GLOBAL TOAST ALERT */}
      {showStatsToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-slate-900 text-slate-100 px-5  py-4 rounded-xl shadow-2xl border border-slate-800 flex items-center justify-between gap-3 font-sans animate-bounce">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-indigo-400 shrink-0" />
            <span className="text-xs font-semibold leading-relaxed">{toastMessage}</span>
          </div>
          <button onClick={() => setShowStatsToast(false)} className="text-slate-400 hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* HEADER BAR */}
      <header className="sticky top-0 z-40 bg-slate-950 text-white border-b border-slate-900 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          
          {/* Logo */}
          <div 
            onClick={() => setSelectedBook(null)}
            className="flex items-center gap-2 cursor-pointer select-none"
            id="brand-logo"
          >
            <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-serif font-black text-lg tracking-tight block">Mural de Conhecimento</span>
              <span className="text-[9px] font-mono tracking-widest text-indigo-300 block">SÍNCOPE LEITORA</span>
            </div>
          </div>

          {/* Quick Header Stats */}
          <div className="hidden lg:flex items-center gap-6 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>Vocação: <strong>{totalReadCount} lidos</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Tempo Economizado: <strong>~{estimatedHoursSaved.toFixed(1)} horas</strong></span>
            </div>
          </div>

          {/* User Account / Premium Badge */}
          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle Button */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-slate-100 transition-all cursor-pointer flex items-center justify-center shadow-sm"
              title={isDarkMode ? "Ativar Modo Claro" : "Ativar Modo Escuro"}
              id="theme-toggle-btn"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400 fill-amber-400" /> : <Moon className="w-4 h-4 text-indigo-300" />}
            </button>

            {subscription.isSubscribed ? (
              <div className="flex items-center gap-2">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider flex items-center gap-1 shadow-sm border border-indigo-400/30">
                  <Crown className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300 animate-ping absolute opacity-30" />
                  <Crown className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
                  <span>PREMIUM ULTRA</span>
                </div>
                
                {/* Cancel mock link */}
                <button
                  onClick={handleCancelSubscription}
                  className="text-[10px] text-slate-400 hover:text-rose-400 transition-colors font-medium border-l border-slate-800 pl-3 py-1"
                  id="btn-cancel-subs"
                >
                  Sair do Premium
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsSubModalOpen(true)}
                className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-px transition-all flex items-center gap-1.5"
                id="btn-upgrade-header"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>Assinar Plano Premium</span>
              </button>
            )}
          </div>

        </div>
      </header>

      {/* RENDER ACTIVE BOOK READER STREAM */}
      {selectedBook ? (
        <main className="flex-1">
          {/* Back context banner */}
          <div className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 py-3.5 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 dark:text-slate-500 text-xs">Você está lendo:</span>
                <span className="font-serif font-bold text-slate-800 dark:text-slate-200 text-sm">{selectedBook.title}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedBook(null)}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                  id="btn-back-header"
                >
                  Fechar Leitor
                </button>
              </div>
            </div>
          </div>

          <BookReader 
            book={selectedBook}
            onBack={() => setSelectedBook(null)}
            progress={progress}
            toggleFavorite={toggleFavorite}
            markAsRead={markAsRead}
            readingPace={readingPace}
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 mt-4">
            <ReviewSection 
              book={selectedBook}
              reviews={reviews}
              onAddReview={handleAddReview}
            />
          </div>
        </main>
      ) : (
        /* RENDER CATALOG LANDING AND CONTROLS */
        <main className="flex-1 pb-16">
          
          {/* HERO BANNER SECTION (Shown to non-subscribed peers) */}
          {!subscription.isSubscribed && (
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white py-12 md:py-16 px-4 md:px-6 relative overflow-hidden" id="promo-hero-banner">
              {/* Background ambient spheres */}
              <div className="absolute -left-20 -top-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute right-10 -bottom-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold tracking-wide uppercase">
                  <Crown className="w-3.5 h-3.5" />
                  Plano Premium Ultra Liberado
                </div>
                
                <h1 className="text-3xl md:text-5xl font-serif font-extrabold tracking-tight leading-tight">
                  Leia os melhores livros em apenas 15 minutos.
                </h1>
                
                <p className="text-slate-300 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
                  Ganhe insights imediatos das maiores mentes de desenvolvimento pessoal, inteligência financeira, startups e marketing direto ao ponto. Resumos estruturados com áudio integrado.
                </p>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={() => setIsSubModalOpen(true)}
                    className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-amber-500/20 hover:scale-103 transition-all text-sm"
                  >
                    Comece Hoje com R$ 14,90/mês
                  </button>
                  <p className="text-slate-400 text-xs">
                    Cancele quando quiser • Garantia de reembolso de 7 dias
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* INTERNAL USER STATS OVERVIEW PANEL (Shown only if subscribed) */}
          {subscription.isSubscribed && (
            <div className="bg-gradient-to-b from-indigo-950 to-slate-900 text-white py-8 px-4 sm:px-6" id="welcome-premium-panel">
              <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-serif font-black tracking-tight flex items-center gap-2">
                      <span>Olá, Leitor Inteligente!</span>
                      <Sparkles className="w-6 h-6 text-amber-400 fill-amber-400" />
                    </h2>
                    <p className="text-indigo-200/80 text-xs md:text-sm mt-1">
                      Sua assinatura Premium está ativa e seu ritmo de evolução está acelerado. Próxima leitura recomendada abaixo!
                    </p>
                  </div>

                  {/* Dynamic stats dashboards */}
                  <div className="grid grid-cols-3 md:flex items-center gap-4 w-full md:w-auto">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
                      <div className="w-9 h-9 bg-indigo-500/20 rounded-lg flex items-center justify-center text-indigo-300 shrink-0">
                        <Heart className="w-4 h-4 fill-indigo-300" />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block leading-none">Favoritos</span>
                        <span className="text-xs md:text-sm font-bold font-mono text-slate-100">{progress.favoriteBooks.length} itens</span>
                      </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
                      <div className="w-9 h-9 bg-amber-500/20 rounded-lg flex items-center justify-center text-amber-300 shrink-0">
                        <Bookmark className="w-4 h-4 fill-amber-300" />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block leading-none">Ler Depois</span>
                        <span className="text-xs md:text-sm font-bold font-mono text-slate-100">{(progress.readLaterBooks || []).length} itens</span>
                      </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
                      <div className="w-9 h-9 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-300 shrink-0">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block leading-none">Concluídos</span>
                        <span className="text-xs md:text-sm font-bold font-mono text-slate-100">{progress.readBooks.length} resumos</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SEARCH, CATEGORY FILTERS, AND CONTROLS MURAL */}
          <div className="bg-white dark:bg-slate-900 border-b border-slate-200/85 dark:border-slate-800 sticky top-[73px] z-30 shadow-sm py-4 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                
                {/* Search field */}
                <div className="relative w-full lg:w-96" id="search-input-container">
                  <Search className="absolute left-3.5 top-3 w-4.5 h-4.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Pesquisar resumo por título ou autor..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => {
                      // small timeout to allow click handlers to process if clicked elsewhere
                      setTimeout(() => setIsSearchFocused(false), 200);
                    }}
                    onKeyDown={(e) => {
                      const list = BOOKS_DATA.filter(book => {
                        const q = searchQuery.toLowerCase().trim();
                        return book.title.toLowerCase().includes(q) || book.author.toLowerCase().includes(q);
                      }).slice(0, 5);

                      if (list.length === 0) return;

                      if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        setActiveSuggestIndex(prev => (prev + 1) % list.length);
                      } else if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        setActiveSuggestIndex(prev => (prev - 1 + list.length) % list.length);
                      } else if (e.key === 'Enter') {
                        e.preventDefault();
                        const targetIndex = activeSuggestIndex >= 0 ? activeSuggestIndex : 0;
                        if (list[targetIndex]) {
                          setSelectedBook(list[targetIndex]);
                          setSearchQuery('');
                          setIsSearchFocused(false);
                        }
                      } else if (e.key === 'Escape') {
                        setIsSearchFocused(false);
                      }
                    }}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 rounded-xl text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100/50 dark:focus:ring-indigo-950/50 transition-all font-sans"
                    id="search-input-catalog"
                    autoComplete="off"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setActiveSuggestIndex(-1);
                      }}
                      className="absolute right-3.5 top-3 text-sm text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
                    >
                      Limpar
                    </button>
                  )}

                  {/* PREDICTIVE AUTO-SUGGEST SLIDE-DOWN LIST */}
                  {isSearchFocused && searchQuery.trim().length > 0 && (() => {
                    const filteredSuggestions = BOOKS_DATA.filter(book => {
                      const q = searchQuery.toLowerCase().trim();
                      return book.title.toLowerCase().includes(q) || book.author.toLowerCase().includes(q);
                    }).slice(0, 5);

                    return (
                      <div className="absolute left-0 right-0 mt-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden z-50">
                        {filteredSuggestions.length > 0 ? (
                          <div className="flex flex-col max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                            <div className="px-3.5 py-1.5 bg-slate-50 dark:bg-slate-950/40 text-[10px] font-bold text-slate-400 dark:text-slate-550 tracking-wider uppercase flex justify-between items-center">
                              <span>Sugestões de Leitura</span>
                              <span className="text-[9px] font-mono lowercase font-normal text-slate-400 dark:text-slate-500">use ↑↓ e enter</span>
                            </div>
                            {filteredSuggestions.map((book, index) => {
                              const isHighlighted = index === activeSuggestIndex;
                              return (
                                <div
                                  key={book.id}
                                  onMouseDown={(e) => {
                                    // Use onMouseDown so it executes before onBlur fires on input! Very crucial.
                                    e.preventDefault();
                                    setSelectedBook(book);
                                    setSearchQuery('');
                                    setIsSearchFocused(false);
                                  }}
                                  onMouseEnter={() => setActiveSuggestIndex(index)}
                                  className={`flex items-center gap-3 p-3 transition-colors cursor-pointer text-left ${
                                    isHighlighted 
                                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-950 dark:text-slate-100 font-medium' 
                                      : 'hover:bg-slate-55 dark:hover:bg-slate-850/45 text-slate-700 dark:text-slate-200'
                                  }`}
                                  id={`search-suggest-item-${book.id}`}
                                >
                                  {/* Small book cover preview */}
                                  <div className={`w-7 h-9 flex-shrink-0 bg-gradient-to-br ${book.coverColor || 'from-indigo-505 to-purple-605'} rounded shadow-sm flex items-center justify-center p-1 relative`}>
                                    <span className="text-[5px] text-center font-bold text-slate-100 line-clamp-2 leading-tight uppercase font-sans">
                                      {book.title.slice(0, 10)}
                                    </span>
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5">
                                      <h4 className="text-xs font-semibold text-slate-800 dark:text-white truncate">
                                        {book.title}
                                      </h4>
                                      {book.isPremium && (
                                        <span className="text-[8px] bg-amber-500/15 border border-amber-550/20 text-amber-600 dark:text-amber-400 px-1 rounded font-bold uppercase shrink-0">
                                          Premium
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                                      {book.author}
                                    </p>
                                  </div>

                                  {/* Right Chevron indicating you can view the summary */}
                                  <div className={`text-slate-400 dark:text-slate-500 transition-transform ${isHighlighted ? 'text-indigo-600 dark:text-indigo-400 translate-x-0.5' : ''}`}>
                                    <ChevronRight className="w-3.5 h-3.5" />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="p-4 text-center text-xs text-slate-400 dark:text-slate-500 font-medium">
                            Nenhum resumo encontrado para "{searchQuery}"
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>

                {/* Sub-Filters Tabs (All, Favorites, Read Later, Completed) */}
                <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-950 p-0.5 rounded-xl border dark:border-slate-800/60 self-stretch lg:self-auto overflow-x-auto">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`flex-1 lg:flex-initial text-nowrap px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === 'all' 
                        ? 'bg-white dark:bg-slate-850 text-slate-900 dark:text-slate-100 shadow-sm font-bold' 
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    Todos Livros
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('favorites');
                      if (progress.favoriteBooks.length === 0) {
                        triggerToast('Você ainda não salvou resumos. Clique nas estrelas ou botões de salvar!');
                      }
                    }}
                    className={`flex-1 lg:flex-initial text-nowrap px-4 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      activeTab === 'favorites' 
                        ? 'bg-white dark:bg-slate-850 text-slate-900 dark:text-slate-100 shadow-sm font-bold' 
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${activeTab === 'favorites' ? 'fill-indigo-600 text-indigo-600' : ''}`} />
                    <span>Favoritos ({progress.favoriteBooks.length})</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('read_later');
                      if ((progress.readLaterBooks || []).length === 0) {
                        triggerToast('Sua lista de Ler Depois está vazia. Adicione livros clicando no ícone de marcador!');
                      }
                    }}
                    className={`flex-1 lg:flex-initial text-nowrap px-4 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      activeTab === 'read_later' 
                        ? 'bg-white dark:bg-slate-850 text-slate-900 dark:text-slate-100 shadow-sm font-bold' 
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${activeTab === 'read_later' ? 'fill-amber-500 text-amber-500' : ''}`} />
                    <span>Ler Depois ({(progress.readLaterBooks || []).length})</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('completed');
                      if (progress.readBooks.length === 0) {
                        triggerToast('Acesse um resumo e clique em Marcar Concluído para acompanhar seu progresso!');
                      }
                    }}
                    className={`flex-1 lg:flex-initial text-nowrap px-4 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      activeTab === 'completed' 
                        ? 'bg-white dark:bg-slate-850 text-slate-900 dark:text-slate-100 shadow-sm font-bold' 
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>Lidos ({progress.readBooks.length})</span>
                  </button>
                </div>

                {/* 3. Personal Reading Pace Slider Controls */}
                <div 
                  className="flex flex-col sm:flex-row sm:items-center gap-2.5 bg-slate-50 dark:bg-slate-950 p-2 text-xs rounded-xl border border-slate-150 dark:border-slate-800/80 w-full lg:w-auto shrink-0 transition-all font-sans"
                  id="reading-pace-slider-card"
                >
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 pl-1.5 pt-0.5">
                    <Sliders className="w-4 h-4 text-indigo-500 shrink-0" />
                    <div>
                      <span className="font-bold block leading-none">Ritmo Pessoal</span>
                      <span className="text-[9px] text-slate-450 dark:text-slate-500 block mt-0.5 whitespace-nowrap">
                        {readingPace <= 150 ? 'Leitura Focada 🧘' : readingPace <= 250 ? 'Ritmo Normal (Média) 📖' : readingPace <= 375 ? 'Leitura Dinâmica ⚡' : 'Super Veloz 🚀'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-grow sm:flex-initial pb-1 sm:pb-0 px-1.5">
                    <input 
                      type="range"
                      min="100"
                      max="500"
                      step="25"
                      value={readingPace}
                      onChange={(e) => {
                        const newPace = Number(e.target.value);
                        setReadingPace(newPace);
                      }}
                      className="accent-indigo-600 bg-slate-200 dark:bg-slate-800/80 h-1.5 rounded-lg cursor-pointer flex-grow lg:w-32 min-w-[100px]"
                      aria-label="Ritmo pessoal de leitura"
                    />
                    <div className="text-right shrink-0 min-w-[50px]">
                      <span className="font-bold font-mono text-slate-800 dark:text-slate-200 block text-xs">
                        {readingPace}
                      </span>
                      <span className="text-[8px] font-mono tracking-wider text-slate-400 uppercase block">
                        PPM
                      </span>
                    </div>
                  </div>
                </div>

              </div>
              
              {/* Category selector row */}
              <div className="flex items-center gap-1.5 mt-4 overflow-x-auto no-scrollbar pb-1">
                {CATEGORIES.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`text-nowrap px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      selectedCategory === category
                        ? 'bg-indigo-600 dark:bg-indigo-700 border-indigo-500 dark:border-indigo-600 text-white shadow-sm font-bold'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-350 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                    id={`filter-cat-${category.replace(/\s+/g, '-').toLowerCase()}`}
                  >
                    {category}
                  </button>
                ))}
              </div>

            </div>
          </div>

          {/* MAIN GRID DISPLAY */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
            
            {/* Title headers */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-serif font-black text-xl text-slate-900 dark:text-slate-100 tracking-tight">
                  {selectedCategory === 'Todos' ? 'Mural de Resumos' : `${selectedCategory}`}
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-500">Exibindo {filteredBooks.length} resumos de alta qualidade filtrados.</p>
              </div>

               {/* Reset stats buttons */}
              {(progress.readBooks.length > 0 || progress.favoriteBooks.length > 0) && (
                <button
                  onClick={handleResetProgressData}
                  className="text-xs text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 flex items-center gap-1 hover:underline"
                  id="btn-reset-progs"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Limpar Progresso</span>
                </button>
              )}
            </div>

            {filteredBooks.length === 0 ? (
              /* EMPTY FILTER FALLBACK */
              <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 max-w-lg mx-auto px-6">
                <Info className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <h4 className="font-serif font-bold text-slate-900 dark:text-slate-200 text-lg mb-1">Nenhum livro encontrado</h4>
                <p className="text-slate-500 dark:text-slate-400 text-xs mb-6">
                  Sua pesquisa ou filtro de aba atual não retornou resultados no momento. Tente expandir sua busca ou conferir seu catálogo completo.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('Todos');
                    setActiveTab('all');
                  }}
                  className="bg-indigo-600 dark:bg-indigo-700 text-white font-semibold text-xs py-2 px-4 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition"
                  id="btn-reset-filters-fallback"
                >
                  Redefinir Filtros
                </button>
              </div>
            ) : (
              /* GRID OF BOOK CARDS */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="catalog-books-grid">
                {filteredBooks.map((book) => (
                  <BookCard 
                    key={book.id}
                    book={book}
                    isSubscribed={subscription.isSubscribed}
                    onSelect={(b) => setSelectedBook(b)}
                    onUnlock={() => setIsSubModalOpen(true)}
                    readingPace={readingPace}
                    onToggleReadLater={toggleReadLater}
                    isInReadLater={(progress.readLaterBooks || []).includes(book.id)}
                  />
                ))}
              </div>
            )}

          </div>

        </main>
      )}

      {/* FOOTER COGNITIVES */}
      <footer className="bg-slate-900 text-slate-400 py-10 px-4 md:px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <div className="text-center md:text-left space-y-1">
            <p className="font-bold text-white font-serif">Mural de Conhecimento © 2026</p>
            <p className="text-slate-500 text-[11px]">Sua dose diária de pensamentos transformadores e evolução constante.</p>
          </div>
          <p className="text-slate-600">
            Assinatura simulada para fins de desenvolvimento. Nenhuma transação real de cartão de crédito será efetuada.
          </p>
        </div>
      </footer>

      {/* SUBSCRIPTION DIALOG CHECKOUT CARD */}
      <SubscriptionModal 
        isOpen={isSubModalOpen}
        onClose={() => setIsSubModalOpen(false)}
        onSubscribe={handleSubscribe}
      />

    </div>
  );
}
