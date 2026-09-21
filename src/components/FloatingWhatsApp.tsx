import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { useBakery } from '../context/BakeryContext';

export const FloatingWhatsApp: React.FC = () => {
  const { settings, activeTrackingOrder } = useBakery();
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const quickPrompts = [
    activeTrackingOrder ? `Hi, I have a question regarding my Order #${activeTrackingOrder.orderNumber}` : null,
    'Hi Chef Aarti! I would like to inquire about a custom cake design.',
    'Can I order an urgent cake for today/tomorrow?',
    'What are your eggless options?',
  ].filter(Boolean) as string[];

  const handleSend = (text: string) => {
    const encoded = encodeURIComponent(text);
    const url = `https://wa.me/${settings.whatsapp.replace(/\D/g, '')}?text=${encoded}`;
    window.open(url, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40">
      {isOpen && (
        <div
          id="whatsapp-chat-popup"
          className="mb-3 w-80 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-emerald-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200"
        >
          {/* Header */}
          <div className="bg-[#075E54] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-[#075E54] flex items-center justify-center font-bold text-lg">
                👩‍🍳
              </div>
              <div>
                <h4 className="font-semibold text-sm leading-tight">{settings.bakerName}</h4>
                <p className="text-[11px] text-emerald-200">Head Baker • {settings.bakeryName}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-[10px] text-emerald-100">Usually replies in ~15 mins</span>
                </div>
              </div>
            </div>
            <button
              id="close-wa-popup"
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-3.5 bg-[#EFEAE2] max-h-72 overflow-y-auto space-y-2 text-xs">
            <div className="bg-white p-3 rounded-2xl rounded-tl-xs shadow-xs text-[#2D2421] max-w-[90%] leading-relaxed">
              Hello! 👋 Welcome to {settings.bakeryName}. How can Chef Aarti help you with your celebration today?
            </div>

            <div className="text-[11px] font-semibold text-[#6E5D57] pt-1">Quick Inquiries:</div>
            <div className="space-y-1.5">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  id={`wa-quick-prompt-${idx}`}
                  onClick={() => handleSend(prompt)}
                  className="w-full text-left p-2 rounded-xl bg-white/90 hover:bg-white text-[#2D2421] text-[11px] font-medium border border-emerald-100 shadow-xs hover:border-emerald-300 transition-all flex items-center justify-between group"
                >
                  <span className="line-clamp-2">{prompt}</span>
                  <Send className="w-3.5 h-3.5 text-emerald-600 opacity-0 group-hover:opacity-100 shrink-0 ml-1.5 transition-opacity" />
                </button>
              ))}
            </div>
          </div>

          {/* Custom message input */}
          <div className="p-2.5 bg-white border-t border-gray-100 flex items-center gap-2">
            <input
              id="wa-custom-input"
              type="text"
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              placeholder="Type your question..."
              className="flex-1 text-xs px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-emerald-500 text-gray-800"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && customMsg.trim()) {
                  handleSend(customMsg.trim());
                }
              }}
            />
            <button
              id="send-wa-custom"
              onClick={() => {
                if (customMsg.trim()) handleSend(customMsg.trim());
              }}
              disabled={!customMsg.trim()}
              className="p-2 rounded-lg bg-[#25D366] text-white disabled:opacity-40 hover:bg-[#1EBE5D] transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Pill/Circle */}
      <button
        id="floating-whatsapp-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3.5 py-3 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white shadow-xl hover:shadow-2xl active:scale-95 transition-all group"
        aria-label="Chat on WhatsApp with Baker"
      >
        <MessageCircle className="w-6 h-6 fill-white text-[#25D366]" />
        <span className="text-xs font-semibold hidden md:inline pr-1">Chat with Baker</span>
      </button>
    </div>
  );
};
