// src/components/ImageInput.jsx
// Campo de midia (imagem OU video) para o admin: aceita URL/caminho OU upload de
// arquivo, com preview. Upload via POST /api/admin/uploads/media (admin), servido
// em /api/media/<arquivo>. Use kind="video" para trailers.
import { useRef, useState } from 'react';
import { uploadMedia } from '../services/adminApi';

function uploadErrorMessage(e) {
  const r = e && e.response;
  if (r && r.data && r.data.error) return r.data.error;
  if (r && r.status === 413) return 'Arquivo muito grande para o servidor.';
  if (r && r.status === 401) return 'Sessao expirada - faca login novamente.';
  if (r && r.status === 403) return 'Sem permissao (precisa ser administrador).';
  if (!r) return 'Sem resposta do servidor (verifique a conexao).';
  return 'Falha no upload (HTTP ' + r.status + ').';
}

export default function ImageInput({ label, value, onChange, kind = 'image' }) {
  const isVideo = kind === 'video';
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const fileRef = useRef(null);

  const pick = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const wanted = isVideo ? 'video/' : 'image/';
    if (!file.type.startsWith(wanted)) {
      setErr('Selecione um arquivo de ' + (isVideo ? 'video' : 'imagem') + '.');
      return;
    }
    setErr('');
    setBusy(true);
    try {
      const data = await uploadMedia(file);
      onChange(data.url);
    } catch (e2) {
      setErr(uploadErrorMessage(e2));
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">{label}</label>
      <div className="flex items-start gap-3">
        {value ? (
          isVideo ? (
            <video src={value} className="w-28 h-16 object-cover rounded border border-gray-200 dark:border-gray-700 bg-black" muted />
          ) : (
            <img src={value} alt="" className="w-16 h-24 object-cover rounded border border-gray-200 dark:border-gray-700" onError={(ev) => { ev.target.style.visibility = 'hidden'; }} />
          )
        ) : (
          <div className={(isVideo ? 'w-28 h-16' : 'w-16 h-24') + ' rounded border border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center text-[10px] text-gray-400 text-center px-1'}>
            {isVideo ? 'sem video' : 'sem imagem'}
          </div>
        )}
        <div className="flex-1 space-y-2">
          <input
            type="text"
            value={value || ''}
            onChange={(ev) => onChange(ev.target.value)}
            placeholder={isVideo ? '/api/media/... , URL ou link do YouTube' : '/api/media/... ou URL externa'}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded bg-transparent text-sm"
          />
          <div className="flex items-center gap-2 flex-wrap">
            <button type="button" onClick={() => fileRef.current && fileRef.current.click()} disabled={busy} className="px-3 py-1.5 text-sm rounded border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50">
              {busy ? 'Enviando...' : (isVideo ? 'Enviar video' : 'Enviar imagem')}
            </button>
            {value ? (
              <button type="button" onClick={() => onChange('')} className="px-3 py-1.5 text-sm rounded border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800">Remover</button>
            ) : null}
            <span className="text-[11px] text-gray-400">max {isVideo ? '600MB' : '30MB'}</span>
            <input ref={fileRef} type="file" accept={isVideo ? 'video/*' : 'image/*'} className="hidden" onChange={pick} />
          </div>
          {err ? <p className="text-xs text-red-500">{err}</p> : null}
        </div>
      </div>
    </div>
  );
}
