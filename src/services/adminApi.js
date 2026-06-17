// src/services/adminApi.js
// Camada de acesso à API de administração (filmes, games e builds).
// Reaproveita a instância `api` (axios com withCredentials) já configurada,
// então a sessão por cookie httpOnly e o tratamento de 401 continuam valendo.
import api from './api';

// ---------------------------------------------------------------------------
// FILMES
// ---------------------------------------------------------------------------
export const moviesApi = {
  list: () => api.get('/admin/movies').then((r) => r.data),
  get: (id) => api.get(`/admin/movies/${id}`).then((r) => r.data),
  create: (data) => api.post('/admin/movies', data).then((r) => r.data),
  update: (id, data) => api.put(`/admin/movies/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/admin/movies/${id}`).then((r) => r.data),
};

// ---------------------------------------------------------------------------
// GAMES
// ---------------------------------------------------------------------------
export const gamesApi = {
  list: () => api.get('/admin/games').then((r) => r.data),
  get: (id) => api.get(`/admin/games/${id}`).then((r) => r.data),
  create: (data) => api.post('/admin/games', data).then((r) => r.data),
  update: (id, data) => api.put(`/admin/games/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/admin/games/${id}`).then((r) => r.data),
};

// ---------------------------------------------------------------------------
// BUILDS (metadados)
// ---------------------------------------------------------------------------
export const buildsApi = {
  listByGame: (gameId) => api.get(`/admin/games/${gameId}/builds`).then((r) => r.data),
  create: (gameId, data) => api.post(`/admin/games/${gameId}/builds`, data).then((r) => r.data),
  update: (buildId, data) => api.put(`/admin/builds/${buildId}`, data).then((r) => r.data),
  remove: (buildId) => api.delete(`/admin/builds/${buildId}`).then((r) => r.data),

  // URL de download (suporta HTTP Range no backend). Útil para <a href>.
  downloadUrl: (buildId) => `${api.defaults.baseURL}/admin/builds/${buildId}/download`,
};

// ---------------------------------------------------------------------------
// UPLOAD CHUNKED do binário de uma build.
// Quebra o File em pedaços de `chunkSize` e envia um por requisição, como
// application/octet-stream com os headers que o backend espera. O servidor
// calcula o sha256 e devolve os metadados no último chunk.
//   onProgress(fraction 0..1) é opcional (para barra de progresso).
// ---------------------------------------------------------------------------
const DEFAULT_CHUNK_SIZE = 4 * 1024 * 1024; // 4 MB

function randomUploadId() {
  // id seguro [A-Za-z0-9_-], compatível com a validação do backend
  const rnd = crypto.getRandomValues(new Uint8Array(16));
  return 'up_' + Array.from(rnd, (b) => b.toString(16).padStart(2, '0')).join('');
}

export async function uploadBuildBinary(buildId, file, { chunkSize = DEFAULT_CHUNK_SIZE, onProgress } = {}) {
  const totalChunks = Math.max(1, Math.ceil(file.size / chunkSize));
  const uploadId = randomUploadId();
  let last = null;

  for (let i = 0; i < totalChunks; i++) {
    const start = i * chunkSize;
    const blob = file.slice(start, Math.min(start + chunkSize, file.size));
    const buf = await blob.arrayBuffer();

    const res = await api.post(`/admin/builds/${buildId}/upload`, buf, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'X-Upload-Id': uploadId,
        'X-Chunk-Index': String(i),
        'X-Total-Chunks': String(totalChunks),
        'X-File-Name': file.name,
      },
      // o upload pode demorar; desliga o timeout padrão de 10s do axios
      timeout: 0,
    });
    last = res.data;
    if (onProgress) onProgress((i + 1) / totalChunks);
  }
  return last; // { ok, done, checksum, tamanho, nome_arquivo }
}


// -------------------------------------------------------------------------
// UPLOAD de imagem (capa/backdrop). Single-shot; devolve { url }.
// -------------------------------------------------------------------------
export async function uploadMedia(file) {
  const res = await api.post('/admin/uploads/media', file, {
    headers: { 'Content-Type': file.type || 'application/octet-stream' },
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  });
  return res.data;
}
// compat: imagens usam o mesmo endpoint generico
export const uploadImage = uploadMedia;
