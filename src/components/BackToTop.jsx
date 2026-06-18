import { useState, useEffect } from 'react';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 bg-purple-600 hover:bg-purple-700 dark:bg-accent-purple dark:hover:bg-accent-purple/90 dark:text-cinema-bg dark:shadow-glow text-white p-3 rounded-full shadow-lg transition-all duration-300 z-40"
      aria-label="Voltar ao topo"
    >
      ↑
    </button>
  );
}