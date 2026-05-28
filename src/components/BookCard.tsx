import React from 'react';
import { Book } from '../types';
import { Star, Lock, BookOpen, Clock } from 'lucide-react';

interface BookCardProps {
  key?: string | number;
  book: Book;
  isSubscribed: boolean;
  onSelect: (book: Book) => void;
  onUnlock: () => void;
}

export default function BookCard({ book, isSubscribed, onSelect, onUnlock }: BookCardProps) {
  const isLocked = book.isPremium && !isSubscribed;

  const handleCardClick = () => {
    if (isLocked) {
      onUnlock();
    } else {
      onSelect(book);
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white rounded-xl border border-slate-150/80 hover:border-slate-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer overflow-hidden group flex flex-col h-full font-sans"
      id={`book-card-${book.id}`}
    >
      {/* Visual Book Cover container with 3D shadow depth */}
      <div className="relative p-6 bg-slate-50 flex items-center justify-center shrink-0">
        
        {/* Soft atmospheric backlight representing pages depth */}
        <div className="absolute inset-0 bg-radial from-slate-200/50 via-slate-50 to-slate-50 opacity-100" />
        
        {/* 3D-like book rendering with binding spine */}
        <div className="relative group-hover:scale-105 transition-transform duration-300 shadow-xl rounded-lg overflow-hidden w-36 aspect-[3/4] flex flex-col justify-between p-4 bg-gradient-to-br select-none z-10">
          
          {/* Cover background gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${book.coverColor} z-0`} />
          
          {/* Subtle bind paper accent lines on left side (spine) */}
          <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-black/15 z-10 border-r border-white/5" />
          <div className="absolute left-2.5 top-0 bottom-0 w-1 bg-white/10 z-10" />

          {/* Label logo top corner */}
          <div className={`text-[9px] uppercase tracking-widest font-mono font-bold ${book.coverTextColor}/60 text-right z-10`}>
            RESUMO COGNITIVO
          </div>

          {/* Book title and author on front cover */}
          <div className="space-y-1 z-10 mt-auto">
            <h4 className={`text-sm md:text-base font-serif font-extrabold tracking-tight ${book.coverTextColor} line-clamp-3 leading-snug`}>
              {book.title}
            </h4>
            <div className="h-0.5 w-6 bg-white/30 rounded" />
            <p className={`text-[10px] uppercase tracking-wide font-medium ${book.coverTextColor}/85 pt-1 truncate`}>
              {book.author}
            </p>
          </div>
        </div>

        {/* Premium badge indicator floating on card image */}
        {book.isPremium && (
          <div 
            className={`absolute top-4 right-4 px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-sm z-20 ${
              isSubscribed 
                ? 'bg-indigo-100/90 text-indigo-800 border border-indigo-200' 
                : 'bg-amber-100/90 text-amber-800 border border-amber-200 animate-pulse'
            }`}
          >
            {isSubscribed ? (
              <>
                <BookOpen className="w-3 h-3 text-indigo-600" />
                <span>Premium Ativo</span>
              </>
            ) : (
              <>
                <Lock className="w-3 h-3 text-amber-600" />
                <span>Premium Ultra</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Card Metadata info column */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category Pill Tag */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] bg-slate-100 border border-slate-200 text-slate-500 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              {book.category}
            </span>
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="text-xs font-bold text-slate-700">{book.rating.toFixed(1)}</span>
            </div>
          </div>

          <h3 className="font-serif font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 text-base leading-tight">
            {book.title}
          </h3>
          <p className="text-slate-400 text-xs mb-3 truncate">Escrito por {book.author}</p>
          
          <p className="text-slate-600 text-xs leading-relaxed line-clamp-2 mb-4">
            {book.description}
          </p>
        </div>

        {/* Access Button / Metadata layout */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium font-mono">
            <Clock className="w-3.5 h-3.5" />
            <span>{book.readTimeMin} min</span>
          </div>

          {isLocked ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUnlock();
              }}
              className="text-xs font-semibold px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg shadow-sm shadow-amber-500/10 hover:scale-102 transition-all flex items-center gap-1"
              id={`btn-unlock-${book.id}`}
            >
              <Lock className="w-3 h-3" />
              Assinar Plano
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect(book);
              }}
              className="text-xs font-semibold px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm shadow-indigo-600/10 hover:scale-102 transition-all flex items-center gap-1"
              id={`btn-read-${book.id}`}
            >
              <BookOpen className="w-3 h-3" />
              Ler Resumo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
