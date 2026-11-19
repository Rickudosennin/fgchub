'use strict';

// NT Deals — adaptador isolado para integração futura.
// Site: https://ntdeals.net/
// Não foi localizado contrato público oficial verificável de API, autenticação
// ou limites. Não inventar endpoint nem automatizar chamadas não documentadas.

async function fetchPrices() {
  throw new Error(
    'NT Deals ainda não integrado: falta documentação oficial do endpoint, autenticação e formato de resposta.'
  );
}

module.exports = { fetchPrices };
