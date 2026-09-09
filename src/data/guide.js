/**
 * Um pedido, oito paradas. O nome da camada é o título; aqui fica só o essencial.
 * Em três pontos (passos 3, 4 e 7), a frase também dá um aceno curto a um dos
 * outros eixos da liga (gestão de processos, testes, DevOps), sem virar rótulo.
 */
export const guide = [
  {
    layer: 0,
    text: 'A camada que mostra o formulário e recebe o que você preencheu.',
    action: 'Próximo',
  },
  {
    layer: 1,
    text: 'O código no seu aparelho orienta o preenchimento e monta o pedido; o servidor confirma as regras.',
    action: 'Próximo',
  },
  {
    layer: 2,
    text: 'Recebe o pedido num endereço combinado e responde de forma previsível.',
    action: 'Próximo',
  },
  {
    layer: 3,
    text: 'Define a ordem do trabalho: a mesma lógica por trás de organizar um time.',
    action: 'Próximo',
  },
  {
    layer: 4,
    text: 'Ninguém pode ter duas candidaturas abertas: uma regra de negócio que um bom teste sempre confere.',
    action: 'Próximo',
  },
  {
    layer: 5,
    text: 'O repositório converte o objeto em registro e esconde os detalhes do banco.',
    action: 'Próximo',
  },
  {
    layer: 6,
    text: 'O registro continua salvo depois que você fecha o site.',
    action: 'Próximo',
  },
  {
    layer: 7,
    text: 'Servidores, rede e monitoramento seguram as sete camadas. Chegar aqui sem quebrar nada é DevOps.',
    action: 'Próximo',
  },
];

/** O fecho: a resposta refaz o caminho de volta até a tela. */
export const conclusion = {
  term: 'Resposta · 201 Created',
  title: 'Candidatura recebida.',
  text: 'A resposta voltou camada por camada, em milissegundos.',
};

/** Arquitetura é uma parte. Engenharia de software é o conjunto das práticas. */
export const practices = [
  {
    icon: 'person',
    term: 'Análise de requisitos',
    text: 'Descobrir e documentar o que o software precisa fazer.',
  },
  {
    icon: 'gear',
    term: 'Gestão de processos',
    text: 'Organiza como o time trabalha, entrega e melhora.',
  },
  { icon: 'system', term: 'Arquitetura', text: 'Definir as partes e como elas conversam.' },
  { icon: 'code', term: 'Implementação', text: 'Escrever código que outras pessoas leem.' },
  { icon: 'check', term: 'Testes', text: 'Provar que funciona, de forma automática.' },
  { icon: 'branch', term: 'Versionamento', text: 'Histórico de tudo, equipe sem conflito.' },
  { icon: 'pipeline', term: 'DevOps', text: 'Publica cada mudança de forma automática e segura.' },
  { icon: 'pulse', term: 'Monitoramento', text: 'Ver o sistema no ar e ser avisado de falhas.' },
  { icon: 'return', term: 'Manutenção', text: 'Corrigir e evoluir: a maior parte do trabalho.' },
];
