import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export const BackToTopButton: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 320);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-30 w-10 h-10 rounded-full shadow-lg bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white flex items-center justify-center transition-all hover:scale-105 cursor-pointer animate-in fade-in duration-150"
      title="Kembali ke atas"
      aria-label="Kembali ke atas"
    >
      <ArrowUp className="w-4 h-4" strokeWidth={2.5} />
    </button>
  );
};
