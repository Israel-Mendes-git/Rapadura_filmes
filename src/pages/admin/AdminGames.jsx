// src/pages/admin/AdminGames.jsx
// Lista + formulário de games e, ao editar um game, a gestão das suas builds
// (criar build, fazer upload CHUNKED do binário e excluir).
import { useCallback, useEffect, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { gamesApi, buildsApi, uploadBuildBinary } from '../../services/adminApi';
import ImageInput from '../../components/ImageInput';
import { useToast } from '../../contexts/ToastContext';
import { useTranslation } from 'react-i18next';

const EMPTY = { titulo: '', descricao: '', capa: '', generos: '', status: 'rascunho' };
const STATUS = ['rascunho', 'publicado', 'arquivado'];

export default function AdminGames() {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const toast = useCallback((m, type = 'success') => addToast(m, type), [addToast]);

  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [builds, setBuilds] = useState([]); // builds do game em edição

  const load = useCallback(() => {
    setLoading(true);
    gamesApi.list()
      .then(setGames)
      .catch(() => toast(t('admin.game.loadError'), 'error'))
      .finally(() => setLoading(false));
  }, [t, toast]);
  useEffect(() => { load(); }, [load]);

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
    if (!form.titulo.trim()) { toast(t('admin.game.titleRequired'), 'error'); return; }
    setSaving(true);
    try {
      if (editingId) {
        await gamesApi.update(editingId, form);
        toast(t('admin.game.updated'), 'success');
        load();
      } else {
        const created = await gamesApi.create(form);
        toast(t('admin.game.created'), 'success');
        load();
        startEdit(created); // já entra em modo edição p/ adicionar builds
      }
    } catch (err) {
      toast(err?.response?.data?.error || t('admin.game.saveError'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (g) => {
    if (!window.confirm(t('admin.game.confirmDelete', { title: g.titulo }))) return;
    try {
      await gamesApi.remove(g.id);
      toast(t('admin.game.deleted'), 'success');
      if (editingId === g.id) resetForm();
      load();
    } catch {
      toast(t('admin.game.deleteError'), 'error');
    }
  };

  return (
    <div className="grid lg:grid-cols-[380px_1fr] gap-8">
      {/* Formulário do game */}
      <div className="h-fit space-y-6">
        <form onSubmit={submit} className="bg-white dark:bg-cinema-surface rounded-card-lg shadow-lg dark:shadow-poster p-6 space-y-3 ring-1 ring-foreground/10 dark:ring-white/10">
          <h2 className="text-xl font-bold font-display tracking-tight mb-2 dark:text-white">{editingId ? t('admin.game.editTitle') : t('admin.game.newTitle')}</h2>
          <Field label={t('admin.game.title')}><Input value={form.titulo} onChange={set('titulo')} placeholder={t('admin.game.titlePlaceholder')} /></Field>
          <Field label={t('admin.game.description')}>
            <textarea value={form.descricao} onChange={set('descricao')} rows={3}
              className="w-full rounded-card border border-input dark:border-white/10 bg-transparent dark:bg-cinema-elevated px-2.5 py-1 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50 dark:focus-visible:ring-accent-purple/40 dark:focus-visible:border-accent-purple" />
          </Field>
          <ImageInput label={t('admin.cover')} value={form.capa} onChange={(v) => setForm((f) => ({ ...f, capa: v }))} />
          <Field label={t('admin.genresComma')}><Input value={form.generos} onChange={set('generos')} placeholder={t('admin.game.genresPlaceholder')} /></Field>
          <Field label={t('admin.game.status')}><Select value={form.status} onChange={set('status')} options={STATUS} /></Field>
          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={saving} className="dark:bg-accent-purple dark:text-black dark:hover:bg-accent-purple/90 dark:shadow-glow">{saving ? t('admin.saving') : (editingId ? t('admin.game.save') : t('admin.game.create'))}</Button>
            {editingId && <Button type="button" variant="outline" onClick={resetForm}>{t('admin.cancel')}</Button>}
          </div>
        </form>

        {editingId && (
          <BuildsPanel gameId={editingId} builds={builds} reload={() => loadBuilds(editingId)} toast={toast} t={t} />
        )}
      </div>

      {/* Lista de games */}
      <div>
        <h2 className="text-xl font-bold font-display tracking-tight mb-4 dark:text-white">{t('admin.game.listTitle', { count: games.length })}</h2>
        {loading ? (
          <p className="text-gray-500 dark:text-gray-400">{t('admin.loading')}</p>
        ) : games.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">{t('admin.game.empty')}</p>
        ) : (
          <div className="space-y-3">
            {games.map((g) => (
              <div key={g.id} className="bg-white dark:bg-cinema-elevated rounded-card p-4 ring-1 ring-foreground/10 dark:ring-white/10 dark:hover:ring-accent-purple/30 transition-colors flex items-center gap-4">
                {g.capa ? (
                  <img src={g.capa} alt={g.titulo} className="w-12 h-16 object-cover rounded-card dark:shadow-poster" onError={(e) => { e.target.style.visibility = 'hidden'; }} />
                ) : (
                  <div className="w-12 h-16 bg-gray-200 dark:bg-cinema-surface rounded-card flex items-center justify-center text-xs text-gray-400">{t('admin.noCover')}</div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate dark:text-gray-100">{g.titulo}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="capitalize">{g.status}</span> · {t('admin.game.buildCount', { count: g.builds_count ?? 0 })}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => startEdit(g)}>{t('admin.edit')}</Button>
                  <Button size="sm" variant="destructive" onClick={() => remove(g)}>{t('admin.delete')}</Button>
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

function BuildsPanel({ gameId, builds, reload, toast, t }) {
  const [plataforma, setPlataforma] = useState('win');
  const [versao, setVersao] = useState('');
  const [changelog, setChangelog] = useState('');
  const [obrigatorio, setObrigatorio] = useState(false);
  const [creating, setCreating] = useState(false);
  const [progress, setProgress] = useState({}); // buildId -> fraction

  const SEMVER = /^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)*$/;

  const createBuild = async (e) => {
    e.preventDefault();
    if (!SEMVER.test(versao.trim())) { toast(t('admin.builds.semverError'), 'error'); return; }
    setCreating(true);
    try {
      await buildsApi.create(gameId, { plataforma, versao: versao.trim(), changelog, obrigatorio });
      toast(t('admin.builds.created'), 'success');
      setVersao(''); setChangelog(''); setObrigatorio(false);
      reload();
    } catch (err) {
      toast(err?.response?.data?.error || t('admin.builds.createError'), 'error');
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
      toast(t('admin.builds.uploadDone', { size: (res.tamanho / 1e6).toFixed(1) }), 'success');
      reload();
    } catch (err) {
      toast(err?.response?.data?.error || t('admin.builds.uploadError'), 'error');
    } finally {
      setProgress((p) => { const n = { ...p }; delete n[build.id]; return n; });
    }
  };

  const removeBuild = async (build) => {
    if (!window.confirm(t('admin.builds.confirmDelete', { platform: build.plataforma, version: build.versao }))) return;
    try {
      await buildsApi.remove(build.id);
      toast(t('admin.builds.deleted'), 'success');
      reload();
    } catch {
      toast(t('admin.builds.deleteError'), 'error');
    }
  };

  return (
    <div className="bg-white dark:bg-cinema-surface rounded-card-lg shadow-lg dark:shadow-poster p-6 ring-1 ring-foreground/10 dark:ring-white/10">
      <h3 className="text-lg font-bold font-display tracking-tight mb-3 dark:text-white">{t('admin.builds.title')}</h3>

      <form onSubmit={createBuild} className="space-y-3 mb-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label={t('admin.builds.platform')}><Select value={plataforma} onChange={(e) => setPlataforma(e.target.value)} options={PLATAFORMAS} /></Field>
          <Field label={t('admin.builds.version')}><Input value={versao} onChange={(e) => setVersao(e.target.value)} placeholder="1.0.0" /></Field>
        </div>
        <Field label={t('admin.builds.changelog')}>
          <textarea value={changelog} onChange={(e) => setChangelog(e.target.value)} rows={2}
            className="w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30" />
        </Field>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={obrigatorio} onChange={(e) => setObrigatorio(e.target.checked)} className="dark:accent-accent-purple" />
          {t('admin.builds.mandatoryUpdate')}
        </label>
        <Button type="submit" size="sm" disabled={creating} className="dark:bg-accent-purple dark:text-black dark:hover:bg-accent-purple/90">{creating ? t('admin.builds.creating') : t('admin.builds.addBuild')}</Button>
      </form>

      {builds.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">{t('admin.builds.empty')}</p>
      ) : (
        <div className="space-y-2">
          {builds.map((b) => (
            <div key={b.id} className="border border-gray-200 dark:border-white/10 dark:bg-cinema-elevated rounded-card p-3 text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium dark:text-gray-100">
                  {b.plataforma} · v{b.versao} {b.obrigatorio ? '· ' + t('admin.builds.mandatory') : ''}
                </span>
                <Button size="xs" variant="destructive" onClick={() => removeBuild(b)}>{t('admin.delete')}</Button>
              </div>
              {b.arquivo ? (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 break-all">
                  {b.nome_arquivo} · {(b.tamanho / 1e6).toFixed(1)} MB · sha256 {String(b.checksum).slice(0, 12)}…{' '}
                  <a className="text-purple-600 dark:text-accent-purple underline" href={buildsApi.downloadUrl(b.id)} target="_blank" rel="noreferrer">{t('admin.builds.download')}</a>
                </p>
              ) : (
                <p className="text-xs text-amber-600 dark:text-accent-purple mt-1">{t('admin.builds.noBinary')}</p>
              )}
              {progress[b.id] !== undefined ? (
                <div className="mt-2 h-1.5 bg-gray-200 dark:bg-white/10 rounded">
                  <div className="h-1.5 bg-purple-600 dark:bg-accent-purple rounded transition-all" style={{ width: `${Math.round(progress[b.id] * 100)}%` }} />
                </div>
              ) : (
                <input type="file" className="mt-2 text-xs dark:text-gray-400"
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
      className="h-8 w-full rounded-card border border-input dark:border-white/10 bg-transparent dark:bg-cinema-elevated px-2.5 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50 dark:focus-visible:ring-accent-purple/40 dark:focus-visible:border-accent-purple">
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}
