// src/components/ImageInput.jsx
// Campo de midia (imagem OU video) para o admin: aceita URL/caminho OU upload de
// arquivo, com preview. Upload via POST /api/admin/uploads/media (admin), servido
// em /api/media/<arquivo>. Use kind="video" para trailers.
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { uploadMedia } from '../services/adminApi';

function uploadErrorMessage(e, t) {
  const r = e && e.response;
  if (r && r.data && r.data.error) return r.data.error;
  if (r && r.status === 413) return t('upload.errTooLarge');
  if (r && r.status === 401) return t('upload.errSession');
  if (r && r.status === 403) return t('upload.errPermission');
  if (!r) return t('upload.errNoResponse');
  return t('upload.errHttp', { status: r.status });
}

export default function ImageInput({ label, value, onChange, kind = 'image' }) {
  const { t } = useTranslation();
  const isVideo = kind === 'video';
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const fileRef = useRef(null);

  const pick = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const wanted = isVideo ? 'video/' : 'image/';
    if (!file.type.startsWith(wanted)) {
      setErr(isVideo ? t('upload.selectVideoFile') : t('upload.selectImageFile'));
      return;
    }
    setErr('');
    setBusy(true);
    try {
      const data = await uploadMedia(file);
      onChange(data.url);
    } catch (e2) {
      setErr(uploadErrorMessage(e2, t));
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
            <video src={value} className="w-28 h-16 object-cover rounded-card border border-gray-200 dark:border-white/10 bg-black dark:shadow-poster" muted />
          ) : (
            <img src={value} alt="" className="w-16 h-24 object-cover rounded-card border border-gray-200 dark:border-white/10 dark:shadow-poster" onError={(ev) => { ev.target.style.visibility = 'hidden'; }} />
          )
        ) : (
          <div className={(isVideo ? 'w-28 h-16' : 'w-16 h-24') + ' rounded-card border border-dashed border-gray-300 dark:border-white/10 dark:bg-cinema-elevated flex items-center justify-center text-[10px] text-gray-400 text-center px-1'}>
            {isVideo ? t('upload.noVideo') : t('upload.noImage')}
          </div>
        )}
        <div className="flex-1 space-y-2">
          <input
            type="text"
            value={value || ''}
            onChange={(ev) => onChange(ev.target.value)}
            placeholder={isVideo ? t('upload.videoPlaceholder') : t('upload.imagePlaceholder')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-white/10 rounded-card bg-transparent dark:bg-cinema-elevated text-sm outline-none transition-colors focus:border-accent-amber focus:ring-1 focus:ring-accent-amber/40"
          />
          <div className="flex items-center gap-2 flex-wrap">
            <button type="button" onClick={() => fileRef.current && fileRef.current.click()} disabled={busy} className="px-3 py-1.5 text-sm rounded-card border border-gray-300 dark:border-white/10 hover:bg-gray-100 dark:bg-cinema-elevated dark:hover:bg-white/5 transition-colors disabled:opacity-50">
              {busy ? t('upload.sending') : (isVideo ? t('upload.sendVideo') : t('upload.sendImage'))}
            </button>
            {value ? (
              <button type="button" onClick={() => onChange('')} className="px-3 py-1.5 text-sm rounded-card border border-gray-300 dark:border-white/10 hover:bg-gray-100 dark:bg-cinema-elevated dark:hover:bg-white/5 transition-colors">{t('upload.remove')}</button>
            ) : null}
            <span className="text-[11px] text-gray-400">{t('upload.max', { size: isVideo ? '600MB' : '30MB' })}</span>
            <input ref={fileRef} type="file" accept={isVideo ? 'video/*' : 'image/*'} className="hidden" onChange={pick} />
          </div>
          {err ? <p className="text-xs text-accent-red">{err}</p> : null}
        </div>
      </div>
    </div>
  );
}
