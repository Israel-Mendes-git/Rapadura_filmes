// src/pages/admin/AdminMovies.jsx
// Lista + formulário (criar/editar/excluir) de filmes próprios.
// Estilo clonado dos componentes shadcn/Tailwind já usados no projeto.
import { useCallback, useEffect, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { moviesApi } from '../../services/adminApi';
import ImageInput from '../../components/ImageInput';
import { useToast } from '../../contexts/ToastContext';
import { useTranslation } from 'react-i18next';

const EMPTY = {
  titulo: '', sinopse: '', capa: '', backdrop: '', ano: '', generos: '',
  fonte: 'proprio', tmdb_id: '', trailer_url: '', vote_average: '',
  vote_count: '', runtime: '', tagline: '',
  categoria: 'autorais', tipo: 'longas',
};

const CATEGORIAS = ['autorais', 'jogos', 'parcerias'];
const TIPOS = ['longas', 'curtas', 'series'];

export default function AdminMovies() {
  const { t } = useTranslation();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const toast = useToastSafe();

  const load = useCallback(() => {
    setLoading(true);
    moviesApi.list()
      .then(setMovies)
      .catch(() => toast(t('admin.movie.loadError'), 'error'))
      .finally(() => setLoading(false));
  }, [t, toast]);
  useEffect(() => { load(); }, [load]);

  const startEdit = (m) => {
    setEditingId(m.id);
    setForm({
      titulo: m.titulo || '', sinopse: m.sinopse || '', capa: m.capa || '',
      backdrop: m.backdrop || '', ano: m.ano ?? '',
      generos: Array.isArray(m.generos) ? m.generos.join(', ') : (m.generos || ''),
      fonte: m.fonte || 'proprio', tmdb_id: m.tmdb_id ?? '',
      trailer_url: m.trailer_url || '', vote_average: m.vote_average ?? '',
      vote_count: m.vote_count ?? '', runtime: m.runtime ?? '', tagline: m.tagline || '',
      categoria: m.categoria || 'autorais', tipo: m.tipo || 'longas',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => { setEditingId(null); setForm(EMPTY); };

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.titulo.trim()) { toast(t('admin.movie.titleRequired'), 'error'); return; }
    setSaving(true);
    const payload = {
      ...form,
      generos: form.generos,
      ano: form.ano === '' ? null : Number(form.ano),
      vote_average: form.vote_average === '' ? 0 : Number(form.vote_average),
      vote_count: form.vote_count === '' ? 0 : Number(form.vote_count),
      runtime: form.runtime === '' ? null : Number(form.runtime),
      tmdb_id: form.tmdb_id === '' ? null : Number(form.tmdb_id),
    };
    try {
      if (editingId) {
        await moviesApi.update(editingId, payload);
        toast(t('admin.movie.updated'), 'success');
      } else {
        await moviesApi.create(payload);
        toast(t('admin.movie.created'), 'success');
      }
      resetForm();
      load();
    } catch (err) {
      toast(err?.response?.data?.error || t('admin.movie.saveError'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (m) => {
    if (!window.confirm(t('admin.movie.confirmDelete', { title: m.titulo }))) return;
    try {
      await moviesApi.remove(m.id);
      toast(t('admin.movie.deleted'), 'success');
      if (editingId === m.id) resetForm();
      load();
    } catch {
      toast(t('admin.movie.deleteError'), 'error');
    }
  };

  return (
    <div className="grid lg:grid-cols-[380px_1fr] gap-8">
      {/* Formulário */}
      <form onSubmit={submit} className="bg-white dark:bg-cinema-surface rounded-card-lg shadow-lg dark:shadow-poster p-6 h-fit space-y-3 ring-1 ring-foreground/10 dark:ring-white/10">
        <h2 className="text-xl font-bold font-display tracking-tight mb-2 dark:text-white">{editingId ? t('admin.movie.editTitle') : t('admin.movie.newTitle')}</h2>

        <Field label={t('admin.movie.title')}><Input value={form.titulo} onChange={set('titulo')} placeholder={t('admin.movie.titlePlaceholder')} /></Field>
        <Field label={t('admin.movie.synopsis')}>
          <textarea value={form.sinopse} onChange={set('sinopse')} rows={3}
            className="w-full rounded-card border border-input dark:border-white/10 bg-transparent dark:bg-cinema-elevated px-2.5 py-1 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50 dark:focus-visible:ring-accent-purple/40 dark:focus-visible:border-accent-purple" />
        </Field>
        <ImageInput label={t('admin.cover')} value={form.capa} onChange={(v) => setForm((f) => ({ ...f, capa: v }))} />
        <ImageInput label={t('admin.backdrop')} value={form.backdrop} onChange={(v) => setForm((f) => ({ ...f, backdrop: v }))} />
        <div className="grid grid-cols-2 gap-3">
          <Field label={t('admin.year')}><Input type="number" value={form.ano} onChange={set('ano')} placeholder="2025" /></Field>
          <Field label={t('admin.rating')}><Input type="number" step="0.1" value={form.vote_average} onChange={set('vote_average')} placeholder="8.5" /></Field>
        </div>
        <Field label={t('admin.movie.tagline')}><Input value={form.tagline} onChange={set('tagline')} placeholder={t('admin.movie.tagline')} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label={t('admin.movie.runtime')}><Input type="number" value={form.runtime} onChange={set('runtime')} placeholder="120" /></Field>
          <Field label={t('admin.movie.voteCount')}><Input type="number" value={form.vote_count} onChange={set('vote_count')} placeholder="150" /></Field>
        </div>
        <Field label={t('admin.genresComma')}><Input value={form.generos} onChange={set('generos')} placeholder="Aventura, Comédia" /></Field>
        <ImageInput label={t('admin.trailer')} kind="video" value={form.trailer_url} onChange={(v) => setForm((f) => ({ ...f, trailer_url: v }))} />

        <div className="grid grid-cols-2 gap-3">
          <Field label={t('admin.movie.category')}><Select value={form.categoria} onChange={set('categoria')} options={CATEGORIAS} /></Field>
          <Field label={t('admin.movie.type')}><Select value={form.tipo} onChange={set('tipo')} options={TIPOS} /></Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label={t('admin.movie.source')}><Select value={form.fonte} onChange={set('fonte')} options={['proprio', 'tmdb']} /></Field>
          {form.fonte === 'tmdb' && (
            <Field label={t('admin.movie.tmdbId')}><Input type="number" value={form.tmdb_id} onChange={set('tmdb_id')} placeholder="12345" /></Field>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Button type="submit" disabled={saving} className="dark:bg-accent-purple dark:text-black dark:hover:bg-accent-purple/90 dark:shadow-glow">{saving ? t('admin.saving') : (editingId ? t('admin.movie.save') : t('admin.movie.create'))}</Button>
          {editingId && <Button type="button" variant="outline" onClick={resetForm}>{t('admin.cancel')}</Button>}
        </div>
      </form>

      {/* Lista */}
      <div>
        <h2 className="text-xl font-bold font-display tracking-tight mb-4 dark:text-white">{t('admin.movie.listTitle', { count: movies.length })}</h2>
        {loading ? (
          <p className="text-gray-500 dark:text-gray-400">{t('admin.loading')}</p>
        ) : movies.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">{t('admin.movie.empty')}</p>
        ) : (
          <div className="space-y-3">
            {movies.map((m) => (
              <div key={m.id} className="bg-white dark:bg-cinema-elevated rounded-card p-4 ring-1 ring-foreground/10 dark:ring-white/10 dark:hover:ring-accent-purple/30 transition-colors flex items-center gap-4">
                {m.capa ? (
                  <img src={m.capa} alt={m.titulo} className="w-12 h-16 object-cover rounded-card dark:shadow-poster" onError={(e) => { e.target.style.visibility = 'hidden'; }} />
                ) : (
                  <div className="w-12 h-16 bg-gray-200 dark:bg-cinema-surface rounded-card flex items-center justify-center text-xs text-gray-400">{t('admin.noCover')}</div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate dark:text-gray-100">{m.titulo}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {m.ano || t('admin.movie.noYear')} · {m.categoria}/{m.tipo} ·{' '}
                    <span className={m.fonte === 'tmdb' ? 'text-blue-500' : 'text-green-600 dark:text-accent-purple'}>{m.fonte}</span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => startEdit(m)}>{t('admin.edit')}</Button>
                  <Button size="sm" variant="destructive" onClick={() => remove(m)}>{t('admin.delete')}</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
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

// Adapta o ToastContext (addToast) para a assinatura (msg, type) usada aqui.
function useToastSafe() {
  const { addToast } = useToast();
  return useCallback((msg, type = 'success') => addToast(msg, type), [addToast]);
}
