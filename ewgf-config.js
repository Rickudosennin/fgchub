// Config pública do rank EWGF. NÃO coloque tokens aqui: este arquivo é servido a todos os visitantes.
// O token da EWGF fica num proxy (veja docs/ewgf-proxy-worker.example.js) que injeta o header
// Authorization no servidor. Aponte apiBaseUrl para a URL desse proxy, ex.: 'https://ewgf-proxy.SEU-USUARIO.workers.dev'
window.FGC_EWGF_CONFIG = Object.freeze({
    apiBaseUrl: 'https://api.ewgf.gg',
    apiToken: ''
});
