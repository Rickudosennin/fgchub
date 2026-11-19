'use strict';

// GG.deals Prices API oficial.
// Docs: https://gg.deals/api/prices/
// API key: GitHub Secret GGDEALS_API_KEY
// Aceita Steam App ID ou slug GG.deals; região BR.
// Limite documentado: 100 registros/minuto e 1.000/hora.

const BASE = 'https://api.gg.deals/v1/prices';

async function fetchPrices(game, options = {}) {
  const key = process.env.GGDEALS_API_KEY;
  if (!key) throw new Error('Falta o secret GGDEALS_API_KEY');

  const region = options.region || 'br';
  const appId = game.steamAppId;
  const slug = game.ggDealsSlug;
  if (!appId && !slug) {
    return { provider: 'ggdeals', status: 'skipped', reason: 'Jogo sem steamAppId ou ggDealsSlug' };
  }

  const endpoint = appId ? 'by-steam-app-id' : 'by-slug';
  const param = appId ? 'ids' : 'slugs';
  const value = String(appId || slug);
  const url = new URL(`${BASE}/${endpoint}/`);
  url.searchParams.set(param, value);
  url.searchParams.set('key', key);
  url.searchParams.set('region', region);

  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(options.timeoutMs || 20000)
  });
  const body = await response.json().catch(() => ({}));

  if (!response.ok || body.success === false) {
    const message = body?.data?.message || body?.message || `HTTP ${response.status}`;
    throw new Error(`GG.deals: ${message}`);
  }

  const record = body?.data?.[value] ?? null;
  if (!record) {
    return { provider: 'ggdeals', status: 'not_found', game: game.name || value, region };
  }

  // A API pública retorna menores preços agregados, não a lista de cada loja.
  // Não converter esses valores em ofertas individuais.
  return {
    provider: 'ggdeals',
    status: 'ok',
    game: record.title || game.name || value,
    region,
    currency: record.prices?.currency || null,
    sourceUrl: record.url || null,
    prices: {
      currentRetail: record.prices?.currentRetail ?? null,
      currentKeyshops: record.prices?.currentKeyshops ?? null,
      historicalRetail: record.prices?.historicalRetail ?? null,
      historicalKeyshops: record.prices?.historicalKeyshops ?? null
    },
    updatedAt: new Date().toISOString()
  };
}

module.exports = { fetchPrices };
