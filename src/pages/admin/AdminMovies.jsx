// src/pages/admin/AdminMovies.jsx
// Lista + formulário (criar/editar/excluir) de filmes próprios.
// Estilo clonado dos componentes shadcn/Tailwind já usados no projeto.
import { useEffect, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { moviesApi } from '../../services/adminApi';
import { useToast } from '../../contexts/ToastContext';

const EMPTY = {
  titulo: '', sinopse: '', capa: '', backdrop: '', ano: '', generos: '',
  fonte: 'proprio', tmdb_id: '', trailer_url: '', vote_average: '',
  categoria: 'autorais', tipo: 'longas',
};

const CATEGORIAS = ['autorais', 'jogos', 'parcerias'];
const TIPOS = ['longas', 'curtas', 'series'];

export default function AdminMovies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const toast = useToastSafe();

  const load = () => {
    setLoading(true);
    moviesApi.list()
      .then(setMovies)
      .catch(() => toast('Erro ao carregar filmes', 'error'))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const startEdit = (m) => {
    setEditingId(m.id);
    setForm({
      titulo: m.titulo || '', sinopse: m.sinopse || '', capa: m.capa || '',
      backdrop: m.backdrop || '', ano: m.ano ?? '',
      generos: Array.isArray(m.generos) ? m.generos.join(', ') : (m.generos || ''),
      fonte: m.fonte || 'proprio', tmdb_id: m.tmdb_id ?? '',
      trailer_url: m.trailer_url || '', vote_average: m.vote_average ?? '',
      categoria: m.categoria || 'autorais', tipo: m.tipo || 'longas',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => { setEditingId(null); setForm(EMPTY); };

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.titulo.trim()) { toast('O título é obrigatório', 'error'); return; }
    setSaving(true);
    const payload = {
      ...form,
      generos: form.generos,
      ano: form.ano === '' ? null : Number(form.ano),
      vote_average: form.vote_average === '' ? 0 : Number(form.vote_average),
      tmdb_id: form.tmdb_id === '' ? null : Number(form.tmdb_id),
    };
    try {
      if (editingId) {
        await moviesApi.update(editingId, payload);
        toast('Filme atualizado', 'success');
      } else {
        await moviesApi.create(payload);
        toast('Filme criado', 'success');
      }
      resetForm();
      load();
    } catch (err) {
      toast(err?.response?.data?.error || 'Erro ao salvar filme', 'error');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (m) => {
    if (!window.confirm(`Excluir o filme "${m.titulo}"?`)) return;
    try {
      await moviesApi.remove(m.id);
      toast('Filme excluído', 'success');
      if (editingId === m.id) resetForm();
      load();
    } catch {
      toast('Erro ao excluir filme', 'error');
    }
  };

  return (
    <div className="grid lg:grid-cols-[380px_1fr] gap-8">
      {/* Formulário */}
      <form onSubmit={submit} className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 h-fit space-y-3 ring-1 ring-foreground/10">
        <h2 className="text-xl font-bold mb-2">{editingId ? 'Editar filme' : 'Novo filme'}</h2>

        <Field label="Título *"><Input value={form.titulo} onChange={set('titulo')} placeholder="Nome do filme" /></Field>
        <Field label="Sinopse">
          <textarea value={form.sinopse} onChange={set('sinopse')} rows={3}
            className="w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30" />
        </Field>
        <Field label="Capa (URL/caminho)"><Input value={form.capa} onChange={set('capa')} placeholder="/images/..." /></Field>
        <Field label="Backdrop (URL/caminho)"><Input value={form.backdrop} onChange={set('backdrop')} placeholder="/images/..." /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Ano"><Input type="number" value={form.ano} onChange={set('ano')} placeholder="2025" /></Field>
          <Field label="Nota (0-10)"><Input type="number" step="0.1" value={form.vote_average} onChange={set('vote_average')} placeholder="8.5" /></Field>
        </div>
        <Field label="Gêneros (separados por vírgula)"><Input value={form.generos} onChange={set('generos')} placeholder="Aventura, Comédia" /></Field>
        <Field label="Trailer (URL)"><Input value={form.trailer_url} onChange={set('trailer_url')} placeholder="/images/.../trailer.mp4" /></Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Categoria"><Select value={form.categoria} onChange={set('categoria')} options={CATEGORIAS} /></Field>
          <Field label="Tipo"><Select value={form.tipo} onChange={set('tipo')} options={TIPOS} /></Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Fonte"><Select value={form.fonte} onChange={set('fonte')} options={['proprio', 'tmdb']} /></Field>
          {form.fonte === 'tmdb' && (
            <Field label="TMDB ID"><Input type="number" value={form.tmdb_id} onChange={set('tmdb_id')} placeholder="12345" /></Field>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Button type="submit" disabled={saving}>{saving ? 'Salvando...' : (editingId ? 'Salvar alterações' : 'Criar filme')}</Button>
          {editingId && <Button type="button" variant="outline" onClick={resetForm}>Cancelar</Button>}
        </div>
      </form>

      {/* Lista */}
      <div>
        <h2 className="text-xl font-bold mb-4">Filmes cadastrados ({movies.length})</h2>
        {loading ? (
          <p className="text-gray-500">Carregando...</p>
        ) : movies.length === 0 ? (
          <p className="text-gray-500">Nenhum filme cadastrado ainda.</p>
        ) : (
          <div className="space-y-3">
            {movies.map((m) => (
              <div key={m.id} className="bg-white dark:bg-gray-900 rounded-xl p-4 ring-1 ring-foreground/10 flex items-center gap-4">
                {m.capa ? (
                  <img src={m.capa} alt={m.titulo} className="w-12 h-16 object-cover rounded" onError={(e) => { e.target.style.visibility = 'hidden'; }} />
                ) : (
                  <div className="w-12 h-16 bg-gray-200 dark:bg-gray-800 rounded flex items-center justify-center text-xs text-gray-400">sem capa</div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{m.titulo}</p>
                  <p className="text-sm text-gray-500">
                    {m.ano || 's/ano'} · {m.categoria}/{m.tipo} ·{' '}
                    <span className={m.fonte === 'tmdb' ? 'text-blue-500' : 'text-green-600'}>{m.fonte}</span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => startEdit(m)}>Editar</Button>
                  <Button size="sm" variant="destructive" onClick={() => remove(m)}>Excluir</Button>
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
      className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30">
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

// Adapta o ToastContext (addToast) para a assinatura (msg, type) usada aqui.
function useToastSafe() {
  const { addToast } = useToast();
  return (msg, type = 'success') => addToast(msg, type);
}
