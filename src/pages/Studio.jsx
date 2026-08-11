import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaRobot, FaSolarPanel, FaServer, FaHandshake, FaGraduationCap, FaWhatsapp, FaInstagram, FaYoutube, FaFacebook } from 'react-icons/fa';
import { MdAnimation, MdGames, MdRecordVoiceOver } from 'react-icons/md';

export default function Studio() {
  const [activeTab, setActiveTab] = useState('about');
  const { t } = useTranslation();

  const specialties = [
    { icon: <MdAnimation className="text-4xl text-purple-600 dark:text-accent-purple" />, title: t('studioPage.animation'), desc: t('studioPage.animationDesc') },
    { icon: <MdGames className="text-4xl text-green-600 dark:text-accent-purple" />, title: t('studioPage.games'), desc: t('studioPage.gamesDesc') },
    { icon: <MdRecordVoiceOver className="text-4xl text-purple-600 dark:text-accent-purple" />, title: t('studioPage.voiceOver'), desc: t('studioPage.voiceOverDesc') }
  ];

  const studioImages = [
    { url: "/images/studio/estudio1.jpg", title: t('studioPage.record') },
    { url: "/images/fulls/pessoal.png", title: t('studioPage.team') },
    { url: "", title: t('studioPage.structure') }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-cinema-bg">
      {/* Conteúdo principal com imagem de fundo */}
      <div 
        className="relative"
        style={{
          backgroundImage: `url('/logo_fundoroxo.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Overlay para melhorar a legibilidade do texto */}
        <div className="absolute inset-0 bg-white/80 dark:bg-cinema-bg/85"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
          {/* Tabs de navegação - Agora apenas 2 abas */}
          <div className="flex gap-4 mb-8 border-b border-gray-200 dark:border-white/10">
            <button
              onClick={() => setActiveTab('about')}
              className={`pb-3 px-4 font-semibold transition-colors ${activeTab === 'about' ? 'border-b-2 border-purple-600 text-purple-600 dark:border-accent-purple dark:text-accent-purple' : 'text-gray-600 dark:text-gray-400 dark:hover:text-gray-200'}`}
            >
              {t('studioPage.about')}
            </button>
            <button
              onClick={() => setActiveTab('clients_contact')}
              className={`pb-3 px-4 font-semibold transition-colors ${activeTab === 'clients_contact' ? 'border-b-2 border-purple-600 text-purple-600 dark:border-accent-purple dark:text-accent-purple' : 'text-gray-600 dark:text-gray-400 dark:hover:text-gray-200'}`}
            >
              {t('studioPage.clients')} & {t('studioPage.contact')}
            </button>
          </div>

          {activeTab === 'about' && (
            <div className="space-y-12">
              {/* Especialidades */}
              <section>
                <h2 className="text-3xl font-display font-bold mb-8 text-center tracking-tight">{t('studioPage.specialties')}</h2>
                <div className="grid md:grid-cols-3 gap-8">
                  {specialties.map((item, index) => (
                    <div key={index} className="bg-white/90 dark:bg-cinema-surface/90 dark:border dark:border-white/5 backdrop-blur-sm p-6 rounded-card-lg shadow-lg dark:hover:shadow-glow transition-shadow text-center">
                      <div className="flex justify-center mb-4">{item.icon}</div>
                      <h3 className="text-xl font-semibold mb-2 dark:text-white">{item.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Histórico */}
              <section className="bg-purple-50/90 dark:bg-cinema-surface/90 dark:border dark:border-accent-purple/20 backdrop-blur-sm rounded-card-lg p-8">
                <h2 className="text-3xl font-display font-bold mb-4 tracking-tight dark:text-white">{t('studioPage.history')}</h2>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                  {t('studioPage.historyDesc1')}
                </p>
                <p className="text-lg text-gray-700 dark:text-gray-300">
                  {t('studioPage.historyDesc2')}
                </p>
              </section>

              {/* Estrutura */}
              <section>
                <h2 className="text-3xl font-display font-bold mb-8 text-center tracking-tight">{t('studioPage.structure')}</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white/90 dark:bg-cinema-surface/90 dark:border dark:border-white/5 backdrop-blur-sm p-6 rounded-card-lg shadow-lg">
                    <FaRobot className="text-3xl text-purple-600 dark:text-accent-purple mb-3" />
                    <h3 className="text-xl font-semibold mb-2 dark:text-white">{t('studioPage.agile')}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{t('studioPage.agileDesc')}</p>
                  </div>
                  <div className="bg-white/90 dark:bg-cinema-surface/90 dark:border dark:border-white/5 backdrop-blur-sm p-6 rounded-card-lg shadow-lg">
                    <FaSolarPanel className="text-3xl text-green-600 dark:text-accent-purple mb-3" />
                    <h3 className="text-xl font-semibold mb-2 dark:text-white">{t('studioPage.sustainability')}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{t('studioPage.sustainabilityDesc')}</p>
                  </div>
                  <div className="bg-white/90 dark:bg-cinema-surface/90 dark:border dark:border-white/5 backdrop-blur-sm p-6 rounded-card-lg shadow-lg">
                    <FaServer className="text-3xl text-purple-600 dark:text-accent-purple mb-3" />
                    <h3 className="text-xl font-semibold mb-2 dark:text-white">{t('studioPage.infrastructure')}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{t('studioPage.infrastructureDesc')}</p>
                  </div>
                </div>
              </section>

              {/* Galeria de Fotos */}
              <section>
                <h2 className="text-3xl font-display font-bold mb-8 text-center tracking-tight">{t('studioPage.gallery')}</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {studioImages.map((img, index) => (
                    <div key={index} className="bg-gray-200/90 dark:bg-cinema-elevated/90 dark:border dark:border-white/5 backdrop-blur-sm rounded-card-lg overflow-hidden shadow-poster">
                      <div className="aspect-video bg-gray-300/90 dark:bg-cinema-elevated/90 flex items-center justify-center">
                        {img.url ? (
                          <img 
                            src={img.url} 
                            alt={img.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              const parent = e.target.parentElement;
                              if (parent) {
                                const span = document.createElement('span');
                                span.className = 'text-gray-500';
                                span.textContent = `${img.title}`;
                                parent.appendChild(span);
                              }
                            }}
                          />
                        ) : (
                          <span className="text-gray-500"> {img.title}</span>
                        )}
                      </div>
                      <p className="p-3 text-center text-sm">{img.title}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {activeTab === 'clients_contact' && (
            <div className="space-y-12">
              {/* Clientes & Parceiros */}
              <section className="bg-green-50/90 dark:bg-cinema-surface/90 dark:border dark:border-accent-purple/20 backdrop-blur-sm rounded-card-lg p-8">
                <h2 className="text-3xl font-display font-bold mb-4 tracking-tight dark:text-white">{t('studioPage.outsourcing')}</h2>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                  {t('studioPage.outsourcingDesc')}
                </p>
                <FaHandshake className="text-6xl text-purple-600 dark:text-accent-purple mx-auto" />
              </section>

              <section>
                <h2 className="text-3xl font-display font-bold mb-6 text-center tracking-tight">{t('studioPage.schoolProject')}</h2>
                <div className="bg-white/90 dark:bg-cinema-surface/90 dark:border dark:border-white/5 backdrop-blur-sm rounded-card-lg p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <FaGraduationCap className="text-4xl text-green-600 dark:text-accent-purple" />
                    <h3 className="text-2xl font-semibold dark:text-white">{t('studioPage.labteca')}</h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {t('studioPage.labtecaDesc')}
                  </p>
                </div>
              </section>

              {/* Contato */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white/90 dark:bg-cinema-surface/90 dark:border dark:border-white/5 backdrop-blur-sm rounded-card-lg p-8">
                  <h2 className="text-2xl font-display font-bold mb-6 tracking-tight dark:text-white">{t('studioPage.contact')}</h2>
                  <div className="space-y-4">
                    <a href="https://wa.me/5585920028491" className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-accent-purple transition-colors">
                      <FaWhatsapp className="text-2xl text-green-600 dark:text-accent-purple" />
                      <span>(85) 92002-8491</span>
                    </a>
                    <div className="flex gap-4 pt-4">
                      <a href="#" className="text-purple-600 hover:text-purple-700 dark:text-accent-purple dark:hover:text-amber-400"><FaInstagram size={24} /></a>
                      <a href="#" className="text-purple-600 hover:text-purple-700 dark:text-accent-purple dark:hover:text-amber-400"><FaYoutube size={24} /></a>
                      <a href="#" className="text-purple-600 hover:text-purple-700 dark:text-accent-purple dark:hover:text-amber-400"><FaFacebook size={24} /></a>
                    </div>
                  </div>
                </div>

                <div className="bg-white/90 dark:bg-cinema-surface/90 dark:border dark:border-white/5 backdrop-blur-sm rounded-card-lg p-8">
                  <h2 className="text-2xl font-display font-bold mb-4 tracking-tight dark:text-white">Endereço</h2>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">{t('studioPage.address')}</p>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">{t('studioPage.city')}</p>
                  <div className="bg-gray-200/90 dark:bg-cinema-elevated/90 rounded-card overflow-hidden">
                    <iframe
                      title="Mapa do Estúdio Filmerama"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3979.4557663512524!2d-38.25121968491568!3d-4.130365796996868!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7c749328bc7468d%3A0x3183e03fccf5a30a!2sRapadura%20At%C3%B4mica!5e0!3m2!1spt-BR!2sbr!4v1678463771958!5m2!1spt-BR!2sbr"
                      width="100%"
                      height="300"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}