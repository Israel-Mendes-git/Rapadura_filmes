import { useTheme } from '../contexts/ThemeContext';

export default function Footer() {
  const { isDark } = useTheme();

  return (
    <footer
      className="relative mt-auto border-t border-gray-200 dark:border-gray-700"
      style={{
        backgroundImage: `url('/rodapé.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className={`absolute inset-0 ${isDark ? 'bg-black/60' : 'bg-black/40'}`}></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-10 flex justify-center">
        <img
          src="/logo_filmerama_Final.png"
          alt="Filmerama"
          className="h-16 w-auto object-contain"
        />
      </div>
    </footer>
  );
}
