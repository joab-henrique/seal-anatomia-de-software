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
  },
  {
    code: 'FE',
    term: 'Front-end',
    plain: 'O código que roda no seu aparelho',
    color: '#7fd4f2',
    definition: 'Reage ao clique, confere os campos e monta o pedido ao servidor.',
  },
  {
    code: 'API',
    term: 'API',
    plain: 'A porta de entrada do sistema',
    color: '#a99cf5',
    definition: 'Endereços combinados (endpoints) que recebem pedidos e devolvem respostas.',
  },
  {
    code: 'APP',
    term: 'Camada de aplicação',
    plain: 'Quem coordena os passos',
    color: '#e39fd8',
    definition: 'Define a ordem do caso de uso. Organiza, mas não decide as regras.',
  },
  {
    code: 'DOM',
    term: 'Domínio',
    plain: 'As regras do mundo real',
    color: '#f0c98a',
    definition: 'Guarda as regras de negócio, que existiriam mesmo sem computador.',
  },
  {
    code: 'REP',
    term: 'Persistência',
    plain: 'A ponte com o banco',
    color: '#9adfa4',
    definition: 'O repositório traduz objetos do sistema em registros do banco.',
  },
  {
    code: 'DB',
    term: 'Banco de dados',
    plain: 'Onde a informação fica guardada',
    color: '#7fd7c6',
    definition: 'Armazena os dados de forma organizada e durável.',
  },
  {
    code: 'INFRA',
    term: 'Infraestrutura',
    plain: 'A base que mantém tudo no ar',
    color: '#8fa8e0',
    definition: 'Servidores, rede e monitoramento sustentam todas as camadas ao mesmo tempo.',
  },
];
