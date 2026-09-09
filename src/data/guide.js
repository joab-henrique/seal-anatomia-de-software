/**
 * Um cadastro de interesse, oito paradas. A ideia cotidiana vem antes do nome técnico.
 * Em três pontos (passos 3, 4 e 7), a frase também dá um aceno curto a um dos
 * outros eixos da liga (gestão de processos, testes, DevOps), sem virar rótulo.
 */
export const guide = [
  {
    layer: 0,
    text: 'É o que você enxerga: o formulário para receber novidades e os botões em que toca.',
    action: 'Próximo',
  },
  {
    layer: 1,
    text: 'É o que faz a tela reagir: ajuda no preenchimento e prepara uma mensagem com seus dados.',
    action: 'Próximo',
  },
  {
    layer: 2,
    text: 'Funciona como uma ponte: leva a mensagem da tela até o sistema e traz a resposta de volta.',
    action: 'Próximo',
  },
  {
    layer: 3,
    text: 'Organiza o trabalho por dentro: primeiro confere, depois guarda e por fim responde.',
    action: 'Próximo',
  },
  {
    layer: 4,
    text: 'Aqui vivem os combinados do sistema. Exemplo: precisamos de um e-mail para enviar novidades.',
    action: 'Próximo',
  },
  {
    layer: 5,
    text: 'É a ponte para a memória do sistema: prepara as informações para serem guardadas.',
    action: 'Próximo',
  },
  {
    layer: 6,
    text: 'É a memória do sistema. O interesse continua guardado mesmo depois que você fecha o site.',
    action: 'Próximo',
  },
  {
    layer: 7,
    text: 'São os computadores, a conexão e os alertas que mantêm tudo funcionando, dia e noite.',
    action: 'Próximo',
  },
];

/** O fecho: a resposta refaz o caminho de volta até a tela. */
export const conclusion = {
  term: 'Fim da demonstração',
  title: 'Você viu o caminho de um clique.',
  text: 'Você acompanhou como uma confirmação volta do sistema até a tela.',
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
