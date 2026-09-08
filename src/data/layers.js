/**
 * As oito camadas de uma aplicação web.
 * `term` é o vocabulário real de engenharia de software; `plain` traduz para o visitante.
 * Uma frase por camada: quem lê em pé, num evento, não lê parágrafos.
 */
export const layers = [
  {
    code: 'UI',
    term: 'Interface do usuário',
    plain: 'A tela que você vê',
    color: '#9fc0ff',
    definition: 'Mostra as informações e recebe o que você digita ou toca.',
    example: 'o botão “Quero fazer parte”',
  },
  {
    code: 'FE',
    term: 'Front-end',
    plain: 'O código que roda no seu aparelho',
    color: '#7fd4f2',
    definition: 'Reage ao clique, confere os campos e monta o pedido ao servidor.',
    example: 'valida o e-mail antes de enviar',
  },
  {
    code: 'API',
    term: 'API',
    plain: 'A porta de entrada do sistema',
    color: '#a99cf5',
    definition: 'Endereços combinados (endpoints) que recebem pedidos e devolvem respostas.',
    example: 'POST /candidaturas',
  },
  {
    code: 'APP',
    term: 'Camada de aplicação',
    plain: 'Quem coordena os passos',
    color: '#e39fd8',
    definition: 'Define a ordem do caso de uso. Organiza, mas não decide as regras.',
    example: 'buscar → validar → salvar → responder',
  },
  {
    code: 'DOM',
    term: 'Domínio',
    plain: 'As regras do mundo real',
    color: '#f0c98a',
    definition: 'Guarda as regras de negócio, que existiriam mesmo sem computador.',
    example: '1 candidatura aberta por pessoa',
  },
  {
    code: 'REP',
    term: 'Persistência',
    plain: 'A ponte com o banco',
    color: '#9adfa4',
    definition: 'O repositório traduz objetos do sistema em registros do banco.',
    example: 'repositorio.salvar(candidatura)',
  },
  {
    code: 'DB',
    term: 'Banco de dados',
    plain: 'Onde a informação fica guardada',
    color: '#7fd7c6',
    definition: 'Armazena os dados de forma organizada e durável.',
    example: 'tabela candidaturas · 1 linha nova',
  },
  {
    code: 'INFRA',
    term: 'Infraestrutura',
    plain: 'A base que mantém tudo no ar',
    color: '#8fa8e0',
    definition: 'Servidores, rede e monitoramento sustentam todas as camadas ao mesmo tempo.',
    example: 'disponível a qualquer hora',
  },
];
