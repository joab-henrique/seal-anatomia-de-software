/** Uma requisição, oito paradas. O nome da camada é o título; aqui fica só o essencial. */
export const guide = [
  {
    layer: 0,
    text: 'A camada que mostra o formulário e recebe o que você preencheu.',
    trace: 'clique registrado na interface',
    action: 'Preparar o envio',
  },
  {
    layer: 1,
    text: 'O código que roda no seu aparelho valida os campos e monta o pedido.',
    trace: 'requisição HTTP · POST /candidaturas',
    action: 'Enviar',
  },
  {
    layer: 2,
    text: 'Recebe o pedido num endereço combinado e responde de forma previsível.',
    trace: 'endpoint reconhecido · dados no formato certo',
    action: 'Abrir o caso de uso',
  },
  {
    layer: 3,
    text: 'Define a ordem do trabalho: buscar, validar, salvar e responder.',
    trace: 'caso de uso · registrar candidatura',
    action: 'Conferir as regras',
  },
  {
    layer: 4,
    text: 'Ninguém pode ter duas candidaturas abertas. Isso é uma regra de negócio.',
    trace: 'invariante verificada · pode seguir',
    action: 'Gravar',
  },
  {
    layer: 5,
    text: 'O repositório converte o objeto em registro e esconde os detalhes do banco.',
    trace: 'repositorio.salvar(candidatura) · transação',
    action: 'Ver onde fica',
  },
  {
    layer: 6,
    text: 'O registro continua salvo depois que você fecha o site.',
    trace: 'tabela candidaturas · 1 linha nova',
    action: 'Ver a base',
  },
  {
    layer: 7,
    text: 'Servidores, rede e monitoramento seguram as sete camadas ao mesmo tempo.',
    trace: 'no ar a qualquer hora',
    action: 'Ver a resposta',
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
  { icon: 'person', term: 'Requisitos', text: 'Descobrir o que o software precisa fazer.' },
  { icon: 'system', term: 'Arquitetura', text: 'Definir as partes e como elas conversam.' },
  { icon: 'code', term: 'Implementação', text: 'Escrever código que outras pessoas leem.' },
  { icon: 'check', term: 'Testes', text: 'Provar que funciona, de forma automática.' },
  { icon: 'branch', term: 'Versionamento', text: 'Histórico de tudo, equipe sem conflito.' },
  { icon: 'pipeline', term: 'CI/CD', text: 'Testar e publicar cada mudança sozinho.' },
  { icon: 'pulse', term: 'Monitoramento', text: 'Ver o sistema no ar e ser avisado de falhas.' },
  { icon: 'return', term: 'Manutenção', text: 'Corrigir e evoluir — a maior parte do trabalho.' },
];
