// src/pages/admin/AdminGames.jsx
// Lista + formulário de games e, ao editar um game, a gestão das suas builds
// (criar build, fazer upload CHUNKED do binário e excluir).
import { useEffect, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { gamesApi, buildsApi, uploadBuildBinary } from '../../services/adminApi';
import ImageInput from '../../components/ImageInput';
import { useToast } from '../../contexts/ToastContext';

const EMPTY = { titulo: '', descricao: '', capa: '', generos: '', status: 'rascunho' };
const STATUS = ['rascunho', 'publicado', 'arquivado'];

export default function AdminGames() {
  const { addToast } = useToast();
  const toast = (m, t = 'success') => addToast(m, t);

  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [builds, setBuilds] = useState([]); // builds do game em edição

  const load = () => {
    setLoading(true);
    gamesApi.list()
      .then(setGames)
      .catch(() => toast('Erro ao carregar games', 'error'))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const loadBuilds = (gameId) => {
    buildsApi.listByGame(gameId).then(setBuilds).catch(() => setBuilds([]));
  };

  const startEdit = (g) => {
    setEditingId(g.id);
    setForm({
      titulo: g.titulo || '', descricao: g.descricao || '', capa: g.capa || '',
      generos: Array.isArray(g.generos) ? g.generos.join(', ') : (g.generos || ''),
      status: g.status || 'rascunho',
    });
    loadBuilds(g.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => { setEditingId(null); setForm(EMPTY); setBuilds([]); };
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.titulo.trim()) { toast('O título é obrigatório', 'error'); return; }
    setSaving(true);
    try {
      if (editingId) {
        await gamesApi.update(editingId, form);
        toast('Game atualizado', 'success');
        load();
      } else {
        const created = await gamesApi.create(form);
        toast('Game criado', 'success');
        load();
        startEdit(created); // já entra em modo edição p/ adicionar builds
      }
    } catch (err) {
      toast(err?.response?.data?.error || 'Erro ao salvar game', 'error');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (g) => {
    if (!window.confirm(`Excluir o game "${g.titulo}" e todas as builds?`)) return;
    try {
      await gamesApi.remove(g.id);
      toast('Game excluído', 'success');
      if (editingId === g.id) resetForm();
      load();
    } catch {
      toast('Erro ao excluir game', 'error');
    }
  };

  return (
    <div className="grid lg:grid-cols-[380px_1fr] gap-8">
      {/* Formulário do game */}
      <div className="h-fit space-y-6">
        <form onSubmit={submit} className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 space-y-3 ring-1 ring-foreground/10">
          <h2 className="text-xl font-bold mb-2">{editingId ? 'Editar game' : 'Novo game'}</h2>
          <Field label="Título *"><Input value={form.titulo} onChange={set('titulo')} placeholder="Nome do game" /></Field>
          <Field label="Descrição">
            <textarea value={form.descricao} onChange={set('descricao')} rows={3}
              className="w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30" />
          </Field>
          <ImageInput label="Capa" value={form.capa} onChange={(v) => setForm((f) => ({ ...f, capa: v }))} />
          <Field label="Gêneros (separados por vírgula)"><Input value={form.generos} onChange={set('generos')} placeholder="Plataforma, Aventura" /></Field>
          <Field label="Status"><Select value={form.status} onChange={set('status')} options={STATUS} /></Field>
          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={saving}>{saving ? 'Salvando...' : (editingId ? 'Salvar alterações' : 'Criar game')}</Button>
            {editingId && <Button type="button" variant="outline" onClick={resetForm}>Cancelar</Button>}
          </div>
        </form>

        {editingId && (
          <BuildsPanel gameId={editingId} builds={builds} reload={() => loadBuilds(editingId)} toast={toast} />
        )}
      </div>

      {/* Lista de games */}
      <div>
        <h2 className="text-xl font-bold mb-4">Games cadastrados ({games.length})</h2>
        {loading ? (
          <p className="text-gray-500">Carregando...</p>
        ) : games.length === 0 ? (
          <p className="text-gray-500">Nenhum game cadastrado ainda.</p>
        ) : (
          <div className="space-y-3">
            {games.map((g) => (
              <div key={g.id} className="bg-white dark:bg-gray-900 rounded-xl p-4 ring-1 ring-foreground/10 flex items-center gap-4">
                {g.capa ? (
                  <img src={g.capa} alt={g.titulo} className="w-12 h-16 object-cover rounded" onError={(e) => { e.target.style.visibility = 'hidden'; }} />
                ) : (
                  <div className="w-12 h-16 bg-gray-200 dark:bg-gray-800 rounded flex items-center justify-center text-xs text-gray-400">sem capa</div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{g.titulo}</p>
                  <p className="text-sm text-gray-500">
                    <span className="capitalize">{g.status}</span> · {g.builds_count ?? 0} build(s)
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => startEdit(g)}>Editar</Button>
                  <Button size="sm" variant="destructive" onClick={() => remove(g)}>Excluir</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Painel de builds de um game: criar metadados, upload chunked e excluir.
// ---------------------------------------------------------------------------
const PLATAFORMAS = ['win', 'mac', 'linux', 'android'];

function BuildsPanel({ gameId, builds, reload, toast }) {
  const [plataforma, setPlataforma] = useState('win');
  const [versao, setVersao] = useState('');
  const [changelog, setChangelog] = useState('');
  const [obrigatorio, setObrigatorio] = useState(false);
  const [creating, setCreating] = useState(false);
  const [progress, setProgress] = useState({}); // buildId -> fraction

  const SEMVER = /^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)*$/;

  const createBuild = async (e) => {
    e.preventDefault();
    if (!SEMVER.test(versao.trim())) { toast('Versão deve ser semver (ex.: 1.0.0)', 'error'); return; }
    setCreating(true);
    try {
      await buildsApi.create(gameId, { plataforma, versao: versao.trim(), changelog, obrigatorio });
      toast('Build criada', 'success');
      setVersao(''); setChangelog(''); setObrigatorio(false);
      reload();
    } catch (err) {
      toast(err?.response?.data?.error || 'Erro ao criar build', 'error');
    } finally {
      setCreating(false);
    }
  };

  const onUpload = async (build, file) => {
    if (!file) return;
    try {
      setProgress((p) => ({ ...p, [build.id]: 0 }));
      const res = await uploadBuildBinary(build.id, file, {
        onProgress: (f) => setProgress((p) => ({ ...p, [build.id]: f })),
      });
      toast(`Upload concluído (${(res.tamanho / 1e6).toFixed(1)} MB)`, 'success');
      reload();
    } catch (err) {
      toast(err?.response?.data?.error || 'Erro no upload', 'error');
    } finally {
      setProgress((p) => { const n = { ...p }; delete n[build.id]; return n; });
    }
  };

  const removeBuild = async (build) => {
    if (!window.confirm(`Excluir a build ${build.plataforma} ${build.versao}?`)) return;
    try {
      await buildsApi.remove(build.id);
      toast('Build excluída', 'success');
      reload();
    } catch {
      toast('Erro ao excluir build', 'error');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 ring-1 ring-foreground/10">
      <h3 className="text-lg font-bold mb-3">Builds</h3>

      <form onSubmit={createBuild} className="space-y-3 mb-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Plataforma"><Select value={plataforma} onChange={(e) => setPlataforma(e.target.value)} options={PLATAFORMAS} /></Field>
          <Field label="Versão (semver)"><Input value={versao} onChange={(e) => setVersao(e.target.value)} placeholder="1.0.0" /></Field>
        </div>
        <Field label="Changelog">
          <textarea value={changelog} onChange={(e) => setChangelog(e.target.value)} rows={2}
            className="w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30" />
        </Field>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={obrigatorio} onChange={(e) => setObrigatorio(e.target.checked)} />
          Atualização obrigatória
        </label>
        <Button type="submit" size="sm" disabled={creating}>{creating ? 'Criando...' : 'Adicionar build'}</Button>
      </form>

      {builds.length === 0 ? (
        <p className="text-sm text-gray-500">Nenhuma build ainda.</p>
      ) : (
        <div className="space-y-2">
          {builds.map((b) => (
            <div key={b.id} className="border border-gray-200 dark:border-gray-800 rounded-lg p-3 text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium">
                  {b.plataforma} · v{b.versao} {b.obrigatorio ? '· obrigatória' : ''}
                </span>
                <Button size="xs" variant="destructive" onClick={() => removeBuild(b)}>Excluir</Button>
              </div>
              {b.arquivo ? (
                <p className="text-xs text-gray-500 mt-1 break-all">
                  {b.nome_arquivo} · {(b.tamanho / 1e6).toFixed(1)} MB · sha256 {String(b.checksum).slice(0, 12)}…{' '}
                  <a className="text-purple-600 underline" href={buildsApi.downloadUrl(b.id)} target="_blank" rel="noreferrer">baixar</a>
                </p>
              ) : (
                <p className="text-xs text-amber-600 mt-1">Sem binário enviado.</p>
              )}
              {progress[b.id] !== undefined ? (
                <div className="mt-2 h-1.5 bg-gray-200 dark:bg-gray-800 rounded">
                  <div className="h-1.5 bg-purple-600 rounded transition-all" style={{ width: `${Math.round(progress[b.id] * 100)}%` }} />
                </div>
              ) : (
                <input type="file" className="mt-2 text-xs"
                  onChange={(e) => onUpload(b, e.target.files?.[0])} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium mb-1">{label}</span>
      {children}
    </label>
  );
}

function Select({ value, onChange, options }) {
  return (
    <select value={value} onChange={onChange}
      className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30">
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}
