// Exemplo de proxy (Cloudflare Worker) para esconder o token da EWGF do client.
// Deploy:
//   1) Crie um Worker e cole este código
//   2) Settings -> Variables -> adicione o secret EWGF_TOKEN (token NOVO; o antigo foi exposto no Git)
//   3) Em ewgf-config.js, aponte apiBaseUrl para a URL do Worker
const ALLOWED_ORIGINS = ['https://fgchub.com.br', 'https://www.fgchub.com.br'];
const PATH_RE = /^\/external\/battles\/[A-Za-z0-9_-]{1,64}$/;

export default {
    async fetch(request, env) {
        const origin = request.headers.get('Origin') || '';
        const corsOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
        const cors = {
            'Access-Control-Allow-Origin': corsOrigin,
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Accept',
            'Vary': 'Origin'
        };

        if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
        if (request.method !== 'GET') return new Response('Method not allowed', { status: 405, headers: cors });

        const url = new URL(request.url);
        if (!PATH_RE.test(url.pathname)) return new Response('Not found', { status: 404, headers: cors });

        const upstream = await fetch(`https://api.ewgf.gg${url.pathname}`, {
            headers: { 'Authorization': `Bearer ${env.EWGF_TOKEN}`, 'Accept': 'application/json' }
        });
        const headers = new Headers(cors);
        headers.set('Content-Type', upstream.headers.get('Content-Type') || 'application/json');
        return new Response(upstream.body, { status: upstream.status, headers });
    }
};
