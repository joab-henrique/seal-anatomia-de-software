import { icon } from './icons.js';
import { layers } from '../data/layers.js';

/** O primeiro plano é o próprio site da SEAL: o visitante reconhece de onde partiu. */
const site =
  '<div class="browser-chrome"><i></i><i></i><i></i><span class="address"><span>◍</span> seja.seal.cin.ufpe.br · demonstração</span><span class="window-expand">⤢</span></div>' +
  '<div class="site-nav"><div class="site-logo"><img src="logo-seal.png" alt="">SEAL</div><span>LIGA ACADÊMICA DE ENGENHARIA DE SOFTWARE</span></div>' +
  '<div class="site-main"><div class="site-copy"><span class="site-eyebrow">PESSOAS. IDEIAS. POSSIBILIDADES.</span>' +
  '<div class="site-title">Conheça mais<br>sobre a <em>SEAL.</em></div>' +
  '<p>Aprenda, crie e acompanhe<br>as novidades da nossa liga.</p>' +
  '<span class="site-cta"><span id="site-cta-label" class="site-cta-label">Quero receber novidades</span><b>↗</b></span></div>' +
  '<div class="site-art"><div class="art-stack"><i></i><i></i><i></i></div></div></div>' +
  '<div class="site-footer"><span>CIn · UFPE</span></div>';

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
  '<div class="diagram-piece packet"><span class="packet-line"><b>Envia</b>um novo interesse</span>' +
  '<code>{<br>&nbsp;&nbsp;"nome": "…",<br>&nbsp;&nbsp;"email": "…"<br>}</code>' +
  '<small>uma mensagem para o sistema (HTTP)</small></div></div>';

/** API: um contrato de endpoints, não uma caixa mágica. */
const api =
  '<div class="simple-diagram api-diagram"><span class="diagram-title">CAMINHOS DE CONVERSA</span>' +
  [
    ['Registrar', 'um novo interesse', 'confirmado'],
    ['Buscar', 'um interesse específico', 'encontrado'],
    ['Buscar', 'as novidades', 'encontrado'],
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
  '<span class="diagram-note">cada caminho atende uma mensagem diferente</span></div>';

/** Aplicação: o roteiro do cadastro de interesse, em ordem. */
const useCase =
  '<div class="simple-diagram usecase-diagram"><span class="diagram-title">O QUE O SISTEMA FAZ</span>' +
  ['Ler os dados', 'Validar o contato', 'Gravar no banco', 'Responder para a tela']
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

/** Domínio: uma regra de contato escrita em português, com os dois desfechos. */
const domain =
  '<div class="simple-diagram rules-diagram"><div class="diagram-piece rule-question">' +
  icon('person') +
  '<strong>O e-mail está preenchido?</strong></div><div class="rule-branches">' +
  '<div class="diagram-piece decision">' +
  icon('check') +
  '<span><b>Sim</b>Contato registrado</span></div>' +
  '<div class="diagram-piece decision muted">' +
  icon('return') +
  '<span><b>Não</b>Pede para completar</span></div></div>' +
  '<span class="diagram-note">regra: dados de contato são obrigatórios</span></div>';

/** Persistência: o mapeamento entre objeto e linha da tabela. */
const persistence =
  '<div class="simple-diagram mapping-diagram">' +
  '<div class="diagram-piece map-card"><small>OBJETO</small><strong>Interesse</strong>' +
  '<span>nome</span><span>email</span><span>criadoEm</span></div>' +
  arrow('mapeia') +
  '<div class="diagram-piece map-card row"><small>LINHA NO BANCO</small><strong>interesses</strong>' +
  '<span>nome · texto</span><span>email · texto</span><span>criado_em · data</span></div>' +
  '<span class="diagram-note">o repositório faz a tradução nos dois sentidos</span></div>';

/** Banco: uma tabela de verdade, com chave primária e o registro novo. */
const database =
  '<div class="simple-diagram table-diagram"><span class="diagram-title">TABELA · INTERESSES</span>' +
  '<div class="table-grid"><div class="diagram-piece head"><span>id</span><span>nome</span><span>tema</span><span>status</span></div>' +
  '<div class="diagram-piece row"><span>1</span><span>Ana</span><span>Eventos</span><span>novo</span></div>' +
  '<div class="diagram-piece row"><span>2</span><span>Léo</span><span>Projetos</span><span>novo</span></div>' +
  '<div class="diagram-piece row fresh"><span>3</span><span>Você</span><span>SEAL</span><span>novo</span>' +
  icon('check') +
  '</div></div><span class="diagram-note">o id é o número que diferencia cada registro</span></div>';

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

/** Cabeçalho de cada placa: o termo técnico da camada. */
export function plateHeader(index) {
  const layer = layers[index];
  return '<div class="plate-header"><strong>' + layer.term + '</strong></div>';
}
