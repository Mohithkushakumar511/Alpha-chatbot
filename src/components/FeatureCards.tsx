import React from 'react';
import { Bot, Zap, Mic } from 'lucide-react';

interface FeatureCardsProps {
  onSelectFeature?: (id: string) => void;
}

export const FeatureCards: React.FC<FeatureCardsProps> = ({ onSelectFeature }) => {
  const cards = [
    {
      id: 'presence',
      title: '3D Floating Presence',
      description: 'A friendly AI companion with a futuristic animated presence.',
      icon: Bot,
    },
    {
      id: 'conversations',
      title: 'AI-Powered Conversations',
      description: 'Ask questions, solve problems, learn concepts, and write code with AI.',
      icon: Zap,
    },
    {
      id: 'voice',
      title: 'Voice AI Assistant',
      description: 'Interact with Alpha using voice input and spoken responses.',
      icon: Mic,
    },
  ];

  return (
    <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 mb-20 md:mb-24">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.id}
              onClick={() => onSelectFeature?.(card.id)}
              className="group relative p-6 rounded-2xl bg-[#181818]/80 hover:bg-[#202020]/90 border border-[#383034] hover:border-[#E11D48]/60 backdrop-blur-xl transition-all duration-300 transform hover:-translate-y-1 shadow-lg shadow-black/50 hover:shadow-[#E11D48]/15 cursor-pointer h-auto flex flex-col justify-start"
            >
              {/* Subtle ambient aura */}
              <div className="absolute top-0 right-0 w-28 h-28 bg-[#E11D48]/5 group-hover:bg-[#E11D48]/15 rounded-full blur-xl transition-all pointer-events-none" />

              {/* Glowing Icon */}
              <div className="w-11 h-11 rounded-xl bg-[#251719] border border-[#383034] group-hover:border-[#E11D48] flex items-center justify-center text-[#E11D48] shadow-sm shadow-[#E11D48]/20 transition-all group-hover:scale-105 mb-4">
                <Icon className="w-5 h-5" />
              </div>

              {/* Title */}
              <h3 className="font-display font-bold text-base sm:text-lg text-[#F5F5F5] mb-2 group-hover:text-[#F43F5E] transition-colors">
                {card.title}
              </h3>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#B8B8B8] leading-relaxed font-normal">
                {card.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
