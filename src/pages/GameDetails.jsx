// Detalhe de um jogo. Busca /api/catalog/games/:id e usa o LauncherBridge.
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { isLauncher, getGameState, gameAction } from '../services/launcher';

export default function GameDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState('browser');

  useEffect(() => {
    let alive = true;
    setLoading(true);
    api.get('/catalog/games/' + id)
      .then((r) => { if (alive) setGame(r.data); })
      .catch(() => { if (alive) setGame(null); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [id]);

  useEffect(() => {
    let alive = true;
    getGameState(id).then((s) => { if (alive) setState(s); });
    return () => { alive = false; };
  }, [id, game]);

  const p = game && (game.poster_path || game.capa);
  const imageUrl = !p ? null : (p.startsWith('http') || p.startsWith('/') ? p : '/' + p);
  const busy = state === 'installing' || state === 'downloading' || state === 'updating';

  const actionLabel = !isLauncher() ? 'Abrir no launcher'
    : state === 'installed' ? 'Jogar'
    : state === 'installing' ? 'Instalando...'
    : state === 'downloading' ? 'Baixando...'
    : state === 'updating' ? 'Atualizando...'
    : state === 'running' ? 'Em execucao'
    : 'Instalar';

  const onAction = async () => {
    if (!isLauncher()) {
      alert('Abra este jogo pelo launcher da Filmerama para instalar e jogar.');
      return;
    }
    const act = state === 'installed' ? 'play' : (state === 'updating' ? 'update' : 'install');
    await gameAction(act, id);
    setState(await getGameState(id));
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
    </div>
  );
  if (!game) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="text-center">
        <p className="text-red-500 text-xl mb-4">Jogo nao encontrado (ID: {id})</p>
        <button onClick={() => navigate('/games')} className="px-4 py-2 rounded bg-purple-600 text-white">Voltar aos jogos</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-5xl mx-auto px-4 py-8 grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          {imageUrl ? <img src={imageUrl} alt={game.title} className="w-full rounded-lg shadow" /> : <div className="w-full h-72 rounded-lg bg-gray-200 dark:bg-gray-800" />}
          <button onClick={onAction} disabled={busy} className="mt-4 w-full px-4 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold disabled:opacity-60">{actionLabel}</button>
          {!isLauncher() ? <p className="text-xs text-gray-400 mt-2 text-center">Instalar/jogar requer o launcher da Filmerama.</p> : null}
        </div>
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">{game.title}</h1>
          {Array.isArray(game.genres) && game.genres.length > 0 ? <p className="text-sm text-purple-500 mb-4">{game.genres.join(' \u00b7 ')}</p> : null}
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line mb-6">{game.overview || 'Sem descricao.'}</p>
          {Array.isArray(game.builds) && game.builds.length > 0 ? (
            <div>
              <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Versoes disponiveis</h2>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                {game.builds.map((b) => <li key={b.id}>{b.plataforma} \u2014 v{b.versao}{b.obrigatorio ? ' (obrigatoria)' : ''}</li>)}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
