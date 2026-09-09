import { icon } from './icons.js';
import { layers } from '../data/layers.js';

/** O primeiro plano é o próprio site da SEAL: o visitante reconhece de onde partiu. */
const site =
  '<div class="browser-chrome"><i></i><i></i><i></i><span class="address"><span>◍</span> seja.seal.cin.ufpe.br · demonstração</span><span class="window-expand">⤢</span></div>' +
  '<div class="site-nav"><div class="site-logo"><img src="logo-seal.png" alt="">SEAL</div><span>LIGA ACADÊMICA DE ENGENHARIA DE SOFTWARE</span></div>' +
  '<div class="site-main"><div class="site-copy"><span class="site-eyebrow">PESSOAS. IDEIAS. POSSIBILIDADES.</span>' +
  '<div class="site-title">Seu próximo<br>passo é <em>na SEAL.</em></div>' +
  '<p>Aprenda, crie e cresça<br>junto com a nossa liga.</p>' +
  '<span class="site-cta"><span id="site-cta-label" class="site-cta-label">Quero fazer parte</span><b>↗</b></span></div>' +
  '<div class="site-art"><div class="art-stack"><i></i><i></i><i></i></div><span>CONSTRUA ALGO MAIOR.</span></div></div>' +
  '<div class="site-footer"><span><i></i> Conectando pessoas e tecnologia</span><span>CIn · UFPE</span></div>';

const arrow = (label = '') =>
  '<span class="diagram-arrow">' +
  icon('arrow') +
  (label ? '<b>' + label + '</b>' : '') +
  '</span>';

const tile = (symbol, label, extra = '') =>
  '<div class="diagram-piece tile ' +
  extra +
  '"><span class="tile-icon">' +
  icon(symbol) +
  '</span><strong>' +
  label +
  '</strong></div>';

/** Front-end: o clique vira um pedido HTTP com método, caminho e corpo. */
const request =
  '<div class="simple-diagram request-diagram">' +
  tile('touch', 'Seu clique') +
  arrow('monta') +
  '<div class="diagram-piece packet"><span class="packet-line"><b>POST</b>/candidaturas</span>' +
  '<code>{<br>&nbsp;&nbsp;"nome": "…",<br>&nbsp;&nbsp;"curso": "…"<br>}</code>' +
  '<small>pedido HTTP</small></div></div>';

/** API: um contrato de endpoints, não uma caixa mágica. */
const api =
  '<div class="simple-diagram api-diagram"><span class="diagram-title">CONTRATO DA API</span>' +
  [
    ['POST', '/candidaturas', '201'],
    ['GET', '/candidaturas/:id', '200'],
    ['GET', '/candidaturas/:id/status', '200'],
  ]
    .map(
      ([method, path, status], i) =>
        '<div class="diagram-piece endpoint' +
        (i ? '' : ' live') +
        '"><b>' +
        method +
        '</b><span>' +
        path +
        '</span><em>' +
        status +
        '</em></div>',
    )
    .join('') +
  '<span class="diagram-note">cada endpoint atende um tipo de pedido</span></div>';

/** Aplicação: o roteiro do caso de uso, em ordem. */
const useCase =
  '<div class="simple-diagram usecase-diagram"><span class="diagram-title">CASO DE USO · REGISTRAR CANDIDATURA</span>' +
  ['Buscar a pessoa', 'Validar as regras', 'Gravar no banco', 'Responder ao front-end']
    .map(
      (text, i) =>
        '<div class="diagram-piece task"><span>' +
        (i + 1) +
        '</span><strong>' +
        text +
        '</strong>' +
        icon('check') +
        '</div>',
    )
    .join('') +
  '</div>';

/** Domínio: a regra escrita em português, com os dois desfechos. */
const domain =
  '<div class="simple-diagram rules-diagram"><div class="diagram-piece rule-question">' +
  icon('person') +
  '<strong>Já existe candidatura aberta?</strong></div><div class="rule-branches">' +
  '<div class="diagram-piece decision">' +
  icon('check') +
  '<span><b>Não</b>Registro permitido</span></div>' +
  '<div class="diagram-piece decision muted">' +
  icon('return') +
  '<span><b>Sim</b>Regra bloqueia</span></div></div>' +
  '<span class="diagram-note">regra: 1 candidatura ativa por pessoa</span></div>';

/** Persistência: o mapeamento entre objeto e linha da tabela. */
const persistence =
  '<div class="simple-diagram mapping-diagram">' +
  '<div class="diagram-piece map-card"><small>OBJETO</small><strong>Candidatura</strong>' +
  '<span>nome</span><span>curso</span><span>criadaEm</span></div>' +
  arrow('mapeia') +
  '<div class="diagram-piece map-card row"><small>LINHA NO BANCO</small><strong>candidaturas</strong>' +
  '<span>nome · texto</span><span>curso · texto</span><span>criada_em · data</span></div>' +
  '<span class="diagram-note">o repositório traduz nos dois sentidos</span></div>';

/** Banco: uma tabela de verdade, com chave primária e o registro novo. */
const database =
  '<div class="simple-diagram table-diagram"><span class="diagram-title">TABELA · CANDIDATURAS</span>' +
  '<div class="table-grid"><div class="diagram-piece head"><span>id</span><span>nome</span><span>curso</span><span>status</span></div>' +
  '<div class="diagram-piece row"><span>1</span><span>Ana</span><span>CC</span><span>enviada</span></div>' +
  '<div class="diagram-piece row"><span>2</span><span>Léo</span><span>EC</span><span>enviada</span></div>' +
  '<div class="diagram-piece row fresh"><span>3</span><span>Você</span><span>SI</span><span>enviada</span>' +
  icon('check') +
  '</div></div><span class="diagram-note">a coluna id é a chave primária</span></div>';

/** Infraestrutura: a base larga que segura as sete camadas acima. */
const infrastructure =
  '<div class="simple-diagram infrastructure-diagram"><div class="support-top">' +
  '<span class="support-site">' +
  icon('screen') +
  'Base compartilhada pelas demais camadas</span></div><div class="support-pillars">' +
  tile('server', 'Servidores') +
  tile('network', 'Rede') +
  tile('pulse', 'Monitoramento') +
  '</div><div class="diagram-piece support-base">Sustenta o sistema inteiro, o tempo todo</div></div>';

export const internals = [
  site,
  request,
  api,
  useCase,
  domain,
  persistence,
  database,
  infrastructure,
];

/** Cabeçalho de cada placa: termo técnico à esquerda, sigla à direita. */
export function plateHeader(index) {
  const layer = layers[index];
  return (
    '<div class="plate-header"><strong>' +
    layer.term +
    '</strong><b>' +
    String(index + 1).padStart(2, '0') +
    ' · ' +
    layer.code +
    '</b></div>'
  );
}
