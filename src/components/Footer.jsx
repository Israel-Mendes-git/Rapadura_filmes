import { useTranslation } from 'react-i18next';
import { FaGithub, FaHeart, FaReact, FaNodeJs, FaCss3Alt } from 'react-icons/fa';
import { SiTailwindcss, SiVite } from 'react-icons/si';
import { useTheme } from '../contexts/ThemeContext';

export default function Footer() {
  const { t } = useTranslation();
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
      {/* Overlay opcional para melhor contraste do texto */}
      <div className={`absolute inset-0 ${isDark ? 'bg-black/60' : 'bg-black/40'}`}></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sobre */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              {t('footer.about')}
            </h3>
            <p className="text-gray-200 text-sm">
              {t('footer.description')}
            </p>
          </div>

          {/* Funcionalidades */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              {t('footer.features')}
            </h3>
            <ul className="space-y-2 text-sm text-gray-200">
              <li>✓ {t('footer.feature1')}</li>
              <li>✓ {t('footer.feature2')}</li>
              <li>✓ {t('footer.feature3')}</li>
              <li>✓ {t('footer.feature4')}</li>
            </ul>
          </div>

          {/* Tecnologias */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              {t('footer.tech')}
            </h3>
            <div className="flex flex-wrap gap-3">
              <FaReact className="text-2xl text-cyan-400" title="React" />
              <SiTailwindcss className="text-2xl text-sky-400" title="Tailwind" />
              <FaNodeJs className="text-2xl text-green-400" title="Node.js" />
              <SiVite className="text-2xl text-yellow-400" title="Vite" />
              <FaCss3Alt className="text-2xl text-blue-400" title="CSS3" />
            </div>
          </div>

          {/* Créditos */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              {t('footer.credits')}
            </h3>
            <p className="text-sm text-gray-200 mb-2">
              Desenvolvido para estudo
            </p>
            <a 
              href="https://github.com/Israel-Mendes-git" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-gray-200 hover:text-purple-300 transition-colors"
            >
              <FaGithub /> GitHub
            </a>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center text-sm text-gray-200">
          <p>© Rapadura Atômica Estúdio de Animação e Jogos Digitais Ltda.</p>
          <p className="text-sm text-gray-400 mt-2">CNPJ: 24.800.280/0001-80</p>
        </div>
      </div>
    </footer>
  );
}