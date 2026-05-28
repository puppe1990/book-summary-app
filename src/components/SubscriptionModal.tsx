import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X, CreditCard, ShieldCheck, Zap } from 'lucide-react';
import { SubscriptionPlan, SubscriptionState } from '../types';
import { PLANS } from '../booksData';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: (state: SubscriptionState) => void;
}

export default function SubscriptionModal({ isOpen, onClose, onSubscribe }: SubscriptionModalProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [selectedPlanId, setSelectedPlanId] = useState<string>('plan_pro');
  
  // Card local states
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  
  // Error state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  // Format inputs
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    // Add spaces every 4 digits
    const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    setCardNumber(formatted);
    if (errors.cardNumber) setErrors(prev => ({ ...prev, cardNumber: '' }));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    setCardExpiry(value);
    if (errors.cardExpiry) setErrors(prev => ({ ...prev, cardExpiry: '' }));
  };

  const handleCVVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 3);
    setCardCVV(value);
    if (errors.cardCVV) setErrors(prev => ({ ...prev, cardCVV: '' }));
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!cardName.trim()) {
      newErrors.cardName = 'Nome completo é obrigatório';
    } else if (cardName.trim().split(' ').length < 2) {
      newErrors.cardName = 'Digite nome e sobrenome';
    }

    const cleanNum = cardNumber.replace(/\s/g, '');
    if (cleanNum.length !== 16) {
      newErrors.cardNumber = 'Cartão de crédito deve conter 16 dígitos';
    }

    if (!cardExpiry || !/^\d{2}\/\d{2}$/.test(cardExpiry)) {
      newErrors.cardExpiry = 'Formato inválido (MM/AA)';
    } else {
      const [month, year] = cardExpiry.split('/').map(Number);
      if (month < 1 || month > 12) {
        newErrors.cardExpiry = 'Mês inválido';
      }
    }

    if (cardCVV.length !== 3) {
      newErrors.cardCVV = 'CVV inválido (3 dígitos)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Simulate server billing delay
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      
      // Call parent action after a visual success celebration
      setTimeout(() => {
        onSubscribe({
          isSubscribed: true,
          planId: selectedPlanId,
          billingCycle: billingCycle,
          expiresAt: new Date(Date.now() + (billingCycle === 'annual' ? 365 : 30) * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
          cardName: cardName,
          cardNumber: `**** **** **** ${cardNumber.slice(-4)}`
        });
        onClose();
      }, 2000);
    }, 1500);
  };

  const getCardBrand = () => {
    const firstDigit = cardNumber.replace(/\s/g, '')[0];
    if (firstDigit === '4') return 'Visa';
    if (firstDigit === '5') return 'Mastercard';
    if (firstDigit === '3') return 'American Express';
    return null;
  };

  const activePlan = PLANS.find(p => p.id === selectedPlanId) || PLANS[0];
  const priceToDisplay = billingCycle === 'annual' ? activePlan.priceAnnual : activePlan.priceMonthly;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        id="sub-modal-backdrop"
      />

      {/* Main Container */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row z-10 font-sans border border-slate-100 dark:border-slate-800 transition-colors duration-300"
        id="sub-modal-container"
      >
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors z-20 p-1 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full"
          id="btn-close-sub"
          aria-label="Minimizar assinatura"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left pane: Marketing and benefits */}
        <div className="md:w-1/2 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white p-8 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle background glow decorator */}
          <div className="absolute -left-20 -top-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-6">
              <Zap className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400" />
              MURAL DE CONHECIMENTO
            </div>
            
            <h3 className="text-2xl md:text-3xl font-serif font-bold tracking-tight mb-2">
              Transforme minutos livres em evolução profissional.
            </h3>
            <p className="text-slate-300 text-sm mb-8 leading-relaxed">
              Assine agora e tenha as lições críticas dos livros mais influentes sintetizadas de forma incrivelmente didática.
            </p>

            {/* Plan Selector buttons */}
            <div className="space-y-3 mb-8">
              {PLANS.map(plan => (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedPlanId === plan.id
                      ? 'bg-white/10 border-indigo-400 shadow-md'
                      : 'bg-white/5 border-transparent hover:bg-white/10'
                  }`}
                  id={`select-plan-${plan.id}`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        selectedPlanId === plan.id ? 'border-indigo-400 bg-indigo-500' : 'border-slate-500'
                      }`}>
                        {selectedPlanId === plan.id && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                      <span className="font-semibold text-sm">{plan.name}</span>
                    </div>
                    {plan.popular && (
                      <span className="bg-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Recomendado
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 leading-normal">{plan.tagline}</p>
                </div>
              ))}
            </div>

            {/* List features corresponding to active selected plan */}
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
              O que você recebe no {activePlan.name}:
            </h4>
            
            <ul className="space-y-2.5">
              {activePlan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-200">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-3 text-slate-400 text-xs">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Garantia de 7 dias de reembolso total sem perguntas burocráticas.</span>
          </div>
        </div>

        {/* Right pane: Checkout Form */}
        <div className="md:w-1/2 bg-white dark:bg-slate-900 p-8 flex flex-col justify-center relative transition-colors duration-300">
          <AnimatePresence mode="wait">
            {!success ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                key="form-step"
                className="flex flex-col h-full justify-between"
              >
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">Detalhes do Plano</h3>
                  
                  {/* Period selection slider or toggle */}
                  <div className="bg-slate-100 dark:bg-slate-950 p-1.5 rounded-xl border dark:border-slate-800/60 flex items-center justify-between mb-6">
                    <button
                      type="button"
                      onClick={() => setBillingCycle('monthly')}
                      className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                        billingCycle === 'monthly'
                          ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                      id="period-monthly"
                    >
                      Mensal
                    </button>
                    <button
                      type="button"
                      onClick={() => setBillingCycle('annual')}
                      className={`flex-1 py-2 text-xs font-semibold rounded-lg relative transition-all cursor-pointer ${
                        billingCycle === 'annual'
                          ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                      id="period-annual"
                    >
                      Anual
                      <span className="absolute -top-1.5 -right-1 bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 text-[9px] font-bold px-1.5 py-0.2 rounded-full border border-red-200 dark:border-red-900 tracking-tight font-sans">
                        -30%
                      </span>
                    </button>
                  </div>

                  <div className="flex justify-between items-baseline mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 text-sm">Preço da Assinatura:</span>
                    <div className="text-right">
                      <span className="text-slate-400 dark:text-slate-550 text-xs line-through block font-mono">
                        R$ {(priceToDisplay * 1.4).toFixed(2)}
                      </span>
                      <span className="font-serif font-black text-2xl text-slate-900 dark:text-slate-100 block">
                        R$ {priceToDisplay.toFixed(2)}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 text-xs">/mês{billingCycle === 'annual' ? ' (cobrado anualmente)' : ''}</span>
                    </div>
                  </div>

                  {/* Credit Card form checkout */}
                  <form onSubmit={handleSubmit} className="space-y-4 font-sans">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                        Nome no Cartão
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Carlos M Silva"
                        value={cardName}
                        onChange={(e) => {
                          setCardName(e.target.value);
                          if (errors.cardName) setErrors(prev => ({ ...prev, cardName: '' }));
                        }}
                        className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border rounded-lg text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 placeholder:text-slate-400 transition-all ${
                          errors.cardName 
                            ? 'border-red-400 focus:ring-red-200 focus:border-red-500' 
                            : 'border-slate-200 dark:border-slate-850 focus:ring-indigo-100 dark:focus:ring-indigo-950/40 focus:border-indigo-500'
                        }`}
                        id="input-card-name"
                      />
                      {errors.cardName && (
                        <p className="text-red-500 text-xs mt-1">{errors.cardName}</p>
                      )}
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider font-sans">
                          Número do Cartão
                        </label>
                        {getCardBrand() && (
                          <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-850 text-slate-600 dark:text-slate-350 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800 font-sans">
                            {getCardBrand()}
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="0000 0000 0000 0000"
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border rounded-lg text-slate-800 dark:text-slate-100 font-mono text-sm focus:outline-none focus:ring-2 placeholder:text-slate-400 transition-all ${
                            errors.cardNumber 
                              ? 'border-red-400 focus:ring-red-200 focus:border-red-500' 
                              : 'border-slate-200 dark:border-slate-850 focus:ring-indigo-100 dark:focus:ring-indigo-950/40 focus:border-indigo-500'
                          }`}
                          id="input-card-number"
                        />
                        <CreditCard className="absolute left-3 top-3.5 w-4.5 h-4.5 text-slate-400" />
                      </div>
                      {errors.cardNumber && (
                        <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5 font-sans">
                          Validade
                        </label>
                        <input
                          type="text"
                          placeholder="MM/AA"
                          value={cardExpiry}
                          onChange={handleExpiryChange}
                          className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border rounded-lg text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 placeholder:text-slate-400 transition-all text-center font-mono ${
                            errors.cardExpiry 
                              ? 'border-red-400 focus:ring-red-200 focus:border-red-500' 
                              : 'border-slate-200 dark:border-slate-850 focus:ring-indigo-100 dark:focus:ring-indigo-950/40 focus:border-indigo-500'
                          }`}
                          id="input-card-expiry"
                        />
                        {errors.cardExpiry && (
                          <p className="text-red-500 text-xs mt-1">{errors.cardExpiry}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5 font-sans">
                          Código (CVV)
                        </label>
                        <input
                          type="password"
                          placeholder="123"
                          value={cardCVV}
                          onChange={handleCVVChange}
                          className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border rounded-lg text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 placeholder:text-slate-400 transition-all text-center font-mono ${
                            errors.cardCVV 
                              ? 'border-red-400 focus:ring-red-200 focus:border-red-500' 
                              : 'border-slate-200 dark:border-slate-850 focus:ring-indigo-100 dark:focus:ring-indigo-950/40 focus:border-indigo-500'
                          }`}
                          id="input-card-cvv"
                        />
                        {errors.cardCVV && (
                          <p className="text-red-500 text-xs mt-1">{errors.cardCVV}</p>
                        )}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-indigo-600/20 active:translate-y-px transition-all flex items-center justify-center gap-2 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                      id="btn-confirm-subscription"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Processando Pagamento Segurado...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-5 h-5" />
                          <span>Confirmar {activePlan.name}</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>

                <div className="mt-6 text-[10px] text-slate-400 text-center leading-normal">
                  Seu pagamento será processado criptografado via Stripe. Ao assinar você concorda com os Termos de Serviço e Política de Privacidade. Cancelamento imediato disponível na área do usuário.
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                key="success-step"
                className="flex flex-col items-center justify-center text-center h-full py-12"
                id="subscription-success-screen"
              >
                <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-950/60 rounded-full flex items-center justify-center text-emerald-500 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900 shadow-md mb-6 animate-bounce">
                  <Check className="w-10 h-10 stroke-[3]" />
                </div>
                <h4 className="text-2xl font-serif font-bold text-slate-900 dark:text-slate-100 mb-2">
                  Assinatura Confirmada! 🎉
                </h4>
                <p className="text-slate-600 dark:text-slate-350 text-sm max-w-sm mb-6 leading-relaxed">
                  Seja bem-vindo(a) ao topo da pirâmide de aprendizado. O catálogo completo de resumos e o simulador de áudio foram liberados para o seu perfil.
                </p>
                <div className="text-xs text-indigo-600 font-bold animate-pulse">
                  Liberando credenciais premium...
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
