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
    definition: 'É a parte visual: mostra informações e recebe o que você toca ou escreve.',
  },
  {
    code: 'FE',
    term: 'Front-end',
    plain: 'O que faz a tela funcionar',
    color: '#7fd4f2',
    definition:
      'Percebe o seu clique, ajuda a preencher os campos e prepara uma mensagem para o sistema.',
  },
  {
    code: 'API',
    term: 'API',
    plain: 'A ponte que leva a mensagem',
    color: '#a99cf5',
    definition: 'Recebe a mensagem da tela, leva-a para o sistema e devolve uma resposta.',
  },
  {
    code: 'APP',
    term: 'Camada de aplicação',
    plain: 'Quem organiza os passos',
    color: '#e39fd8',
    definition: 'Decide a ordem das tarefas: conferir os dados, guardar e responder.',
  },
  {
    code: 'DOM',
    term: 'Domínio',
    plain: 'As regras que fazem sentido',
    color: '#f0c98a',
    definition: 'Guarda combinados como “precisamos de um e-mail para enviar novidades”.',
  },
  {
    code: 'REP',
    term: 'Persistência',
    plain: 'A ponte para a memória',
    color: '#9adfa4',
    definition: 'Traduz as informações para que possam ser guardadas e encontradas depois.',
  },
  {
    code: 'DB',
    term: 'Banco de dados',
    plain: 'A memória do sistema',
    color: '#7fd7c6',
    definition: 'Guarda as informações organizadas, mesmo quando você fecha o site.',
  },
  {
    code: 'INFRA',
    term: 'Infraestrutura',
    plain: 'A base que mantém tudo funcionando',
    color: '#8fa8e0',
    definition: 'São os computadores, a conexão e os avisos que mantêm o sistema disponível.',
  },
];
