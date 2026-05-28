import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, MessageSquare } from 'lucide-react';
import { Book, BookReview } from '../types';

interface ReviewSectionProps {
  book: Book;
  reviews: BookReview[];
  onAddReview: (review: BookReview) => void;
}

export default function ReviewSection({ book, reviews, onAddReview }: ReviewSectionProps) {
  const [userName, setUserName] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  // Filter reviews matching current book
  const bookReviews = reviews.filter(rev => rev.bookId === book.id);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!userName.trim()) {
      setFormError('Por favor, informe seu nome.');
      return;
    }
    if (!comment.trim() || comment.length < 5) {
      setFormError('Por favor, escreva um comentário com pelo menos 5 caracteres.');
      return;
    }

    const newReview: BookReview = {
      id: `rev-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      bookId: book.id,
      userName: userName,
      rating: rating,
      comment: comment,
      date: new Date().toLocaleDateString('pt-BR')
    };

    onAddReview(newReview);
    setUserName('');
    setComment('');
    setRating(5);
    setFormSuccess(true);

    setTimeout(() => {
      setFormSuccess(false);
    }, 3000);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-150/80 p-6 md:p-8 shadow-sm font-sans" id="reviews-widget-container">
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
        <MessageSquare className="w-5 h-5 text-indigo-500" />
        <h3 className="font-serif font-bold text-slate-900 text-lg">Avaliações de Leitores ({bookReviews.length})</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Column: Historical lists */}
        <div className="space-y-4">
          {bookReviews.length === 0 ? (
            <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <p className="text-sm text-slate-400">Nenhuma avaliação deste resumo ainda.</p>
              <p className="text-xs text-slate-400 mt-1">Seja o primeiro a deixar suas opiniões abaixo!</p>
            </div>
          ) : (
            <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-1">
              {bookReviews.map((rev) => (
                <div 
                  key={rev.id} 
                  className="p-4 rounded-xl bg-slate-50/50 border border-slate-100 space-y-2 text-xs"
                  id={`review-${rev.id}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm leading-tight">{rev.userName}</h4>
                      <span className="text-[10px] text-slate-400">{rev.date}</span>
                    </div>
                    
                    {/* Stars render */}
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3 h-3 ${
                            i < rev.rating 
                              ? 'text-amber-400 fill-amber-400' 
                              : 'text-slate-200'
                          }`} 
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-600 leading-normal italic text-sm">
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Give feedback form */}
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
          <h4 className="font-bold text-slate-800 text-sm mb-3.5">Deixe seu Review</h4>
          
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Seu Nome</label>
              <input
                type="text"
                placeholder="Ex: Amanda Silva"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all font-sans"
                id="input-review-author"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Sua Nota: {rating} / 5</label>
              <div className="flex items-center gap-1.5 py-1">
                {Array.from({ length: 5 }).map((_, i) => {
                  const starValue = i + 1;
                  const filled = starValue <= (hoveredRating ?? rating);
                  return (
                    <button
                      key={i}
                      type="button"
                      onMouseEnter={() => setHoveredRating(starValue)}
                      onMouseLeave={() => setHoveredRating(null)}
                      onClick={() => setRating(starValue)}
                      className="text-slate-300 hover:text-amber-400 focus:outline-none transition-transform active:scale-95"
                    >
                      <Star className={`w-6 h-6 ${filled ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Comentário ou Insights</label>
              <textarea
                rows={3}
                placeholder="Compartilhe como este resumo ajudou seu fluxo ou quais lições principais gostou."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all font-sans resize-none"
                id="input-review-comment"
              />
            </div>

            {formError && (
              <p className="text-red-500 text-xs font-medium">{formError}</p>
            )}

            <AnimatePresence>
              {formSuccess && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-emerald-100 text-emerald-800 text-xs px-3 py-1.5 rounded-lg font-medium"
                >
                  Sucesso! Avaliação publicada na lista.
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg text-xs shadow-md shadow-indigo-600/10 active:scale-[0.98] transition-all"
              id="btn-submit-review"
            >
              Publicar Feedback
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
