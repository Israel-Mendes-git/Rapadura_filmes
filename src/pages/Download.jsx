// Página de download do Launcher (L3). Detecta o SO e oferece o arquivo certo.
// Linux (AppImage) está no ar; Windows/Mac entram quando os instaladores existirem.
// A versão/arquivo Linux são lidos dinamicamente do manifesto do electron-updater
// (/launcher/latest-linux.yml), então um bump de versão não exige mexer aqui.
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Download as DownloadIcon, MonitorDown, Apple, Terminal, CheckCircle2, Clock } from 'lucide-react';

const LAUNCHER_BASE = '/launcher/';

// Detecção simples de SO a partir do navegador.
function detectOS() {
  if (typeof navigator === 'undefined') return 'unknown';
  const ua = `${navigator.userAgent} ${navigator.platform}`.toLowerCase();
  if (/win/.test(ua)) return 'windows';
  if (/mac|iphone|ipad|ipod/.test(ua)) return 'mac';
  if (/linux|x11|android/.test(ua)) return 'linux';
  return 'unknown';
}

// Lê filename + versão do latest-linux.yml (texto simples: `path:` e `version:`).
async function fetchLinuxBuild() {
  try {
    const res = await fetch(`${LAUNCHER_BASE}latest-linux.yml`, { cache: 'no-cache' });
    if (!res.ok) return null;
    const txt = await res.text();
    const path = (txt.match(/^path:\s*(.+)$/m) || [])[1]?.trim();
    const version = (txt.match(/^version:\s*(.+)$/m) || [])[1]?.trim();
    if (!path) return null;
    return { url: LAUNCHER_BASE + path, version: version || null };
  } catch {
    return null;
  }
}

export default function Download() {
  const { t } = useTranslation();
  const [os, setOs] = useState('unknown');
  const [linux, setLinux] = useState(null);

  useEffect(() => {
    setOs(detectOS());
    fetchLinuxBuild().then(setLinux);
  }, []);

  const platforms = [
    {
      key: 'linux',
      label: 'Linux',
      icon: Terminal,
      available: true,
      href: linux?.url || `${LAUNCHER_BASE}filmerama-launcher.AppImage`,
      hint: t('download.linuxHint', 'AppImage — dê permissão de execução e abra.'),
      ext: 'AppImage',
    },
    {
      key: 'windows',
      label: 'Windows',
      icon: MonitorDown,
      available: false,
      hint: t('download.soon', 'Em breve'),
      ext: '.exe',
    },
    {
      key: 'mac',
      label: 'macOS',
      icon: Apple,
      available: false,
      hint: t('download.soon', 'Em breve'),
      ext: '.dmg',
    },
  ];

  // Plataforma detectada primeiro, depois as demais.
  const ordered = [...platforms].sort((a, b) => (a.key === os ? -1 : b.key === os ? 1 : 0));
  const primary = platforms.find((p) => p.key === os) || platforms[0];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-cinema-bg">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-black/5 dark:border-white/5
                      bg-gradient-to-br from-purple-700 via-purple-900 to-gray-950
                      dark:from-cinema-elevated dark:via-cinema-surface dark:to-cinema-bg">
        <div className="pointer-events-none absolute -left-32 top-0 hidden h-96 w-96 rounded-full
                        bg-accent-green/10 blur-3xl dark:block" />
        <div className="relative mx-auto max-w-5xl px-4 py-14 text-center sm:py-20">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs
                             font-semibold text-white ring-1 ring-white/20 backdrop-blur-sm
                             dark:bg-accent-green/10 dark:text-accent-green dark:ring-accent-green/30">
              <DownloadIcon className="h-4 w-4" /> {t('download.badge', 'Launcher')}
            </span>
            <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-white drop-shadow-sm sm:text-5xl">
              {t('download.title', 'Baixe o Filmerama Launcher')}
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-base text-purple-100/90 sm:text-lg dark:text-zinc-300">
              {t('download.subtitle', 'O app para baixar, instalar e jogar os jogos do estúdio — direto do seu computador, com atualizações automáticas.')}
            </p>

            {/* CTA principal (SO detectado) */}
            {primary?.available ? (
              <motion.a
                href={primary.href}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="mt-8 inline-flex items-center gap-3 rounded-xl bg-white px-7 py-3.5 text-base
                           font-semibold text-purple-900 shadow-lg transition-colors hover:bg-purple-50
                           dark:bg-accent-green dark:text-cinema-bg dark:shadow-glow-green dark:hover:bg-accent-green-bright"
              >
                <DownloadIcon className="h-5 w-5" />
                {t('download.ctaFor', 'Baixar para')} {primary.label}
                {linux?.version && primary.key === 'linux' && (
                  <span className="rounded-md bg-black/10 px-2 py-0.5 text-xs font-medium dark:bg-black/20">
                    v{linux.version}
                  </span>
                )}
              </motion.a>
            ) : (
              <p className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white/10 px-6 py-3 text-sm
                            font-medium text-white ring-1 ring-white/20">
                <Clock className="h-4 w-4" />
                {t('download.primarySoon', 'Versão para o seu sistema em breve — veja as opções abaixo.')}
              </p>
            )}
          </motion.div>
        </div>
      </div>

      {/* Cartões por plataforma */}
      <div className="mx-auto max-w-5xl px-4 py-12">
        <h2 className="mb-6 text-center font-display text-lg font-semibold text-gray-900 dark:text-white">
          {t('download.allPlatforms', 'Todas as plataformas')}
        </h2>
        <div className="grid gap-5 sm:grid-cols-3">
          {ordered.map((p) => {
            const Icon = p.icon;
            const isDetected = p.key === os;
            return (
              <div
                key={p.key}
                className={`relative flex flex-col items-center rounded-card-lg border p-6 text-center transition
                            ${p.available
                      ? 'border-purple-200 bg-white hover:shadow-lg dark:border-accent-green/30 dark:bg-cinema-surface dark:shadow-poster'
                      : 'border-gray-200 bg-gray-50/60 opacity-75 dark:border-white/5 dark:bg-cinema-surface/40'}`}
              >
                {isDetected && (
                  <span className="absolute right-3 top-3 rounded-full bg-purple-600 px-2 py-0.5 text-[10px]
                                   font-bold uppercase tracking-wide text-white dark:bg-accent-green dark:text-cinema-bg">
                    {t('download.detected', 'detectado')}
                  </span>
                )}
                <Icon className={`h-10 w-10 ${p.available ? 'text-purple-600 dark:text-accent-green' : 'text-gray-400 dark:text-zinc-600'}`} />
                <h3 className="mt-3 font-display text-lg font-semibold text-gray-900 dark:text-white">{p.label}</h3>
                <p className="mt-1 text-xs text-gray-500 dark:text-zinc-400">{p.hint}</p>

                {p.available ? (
                  <a
                    href={p.href}
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-accent-green px-4 py-2 text-sm
                               font-semibold text-cinema-bg transition-colors hover:bg-accent-green-bright shadow-glow-green"
                  >
                    <DownloadIcon className="h-4 w-4" /> {p.ext}
                  </a>
                ) : (
                  <span className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gray-200 px-4 py-2 text-sm
                                   font-semibold text-gray-500 dark:bg-white/5 dark:text-zinc-500">
                    <Clock className="h-4 w-4" /> {t('download.soon', 'Em breve')}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Como instalar (Linux/AppImage) */}
        <div className="mx-auto mt-12 max-w-2xl rounded-card-lg border border-gray-200 bg-white p-6
                        dark:border-white/10 dark:bg-cinema-surface">
          <h3 className="flex items-center gap-2 font-display text-base font-semibold text-gray-900 dark:text-white">
            <CheckCircle2 className="h-5 w-5 text-purple-600 dark:text-accent-green" />
            {t('download.howToLinux', 'Como rodar no Linux (AppImage)')}
          </h3>
          <ol className="mt-3 space-y-2 text-sm text-gray-600 dark:text-zinc-300">
            <li>1. {t('download.step1', 'Baixe o arquivo .AppImage.')}</li>
            <li>2. {t('download.step2', 'Dê permissão de execução:')}
              <code className="ml-1 rounded bg-gray-100 px-1.5 py-0.5 text-xs text-purple-700 dark:bg-black/40 dark:text-accent-green">
                chmod +x filmerama-launcher*.AppImage
              </code>
            </li>
            <li>3. {t('download.step3', 'Dê dois cliques (ou rode pelo terminal).')}</li>
          </ol>
          <p className="mt-3 text-xs text-gray-400 dark:text-zinc-500">
            {t('download.autoUpdateNote', 'O launcher se atualiza sozinho quando uma nova versão sai.')}
          </p>
        </div>
      </div>
    </div>
  );
}
