# Anatomia de Software · SEAL

Uma experiência interativa para o público visitante da SEAL, Liga Acadêmica de Engenharia de Software do CIn–UFPE. Em poucos cliques, a pessoa acompanha uma candidatura fictícia atravessar um sistema inteiro e conhece os termos que a engenharia de software realmente usa.

A abertura é uma cena 3D em tempo real: alguém de costas, de moletom da SEAL, digitando num notebook, com um ponteiro que caminha até o botão “Quero fazer parte”. Ao tocar em **Começar**, a câmera entra na tela e a arquitetura se abre em oito camadas.

## Executar

Requer Node.js 20 ou mais recente.

```sh
npm install
npm start
```

Abra a URL exibida no terminal, normalmente http://localhost:3000. Se a porta estiver ocupada, o servidor tenta as dez seguintes. **Ctrl+C** encerra.

Para testar no celular, conecte os aparelhos à mesma rede e use `http://IP-DO-COMPUTADOR:PORTA`. Abrir `index.html` por duplo clique não funciona: os módulos JavaScript precisam de um servidor.

## Publicar na Vercel

O projeto já traz `vercel.json` com `npm run build` e saída em `dist/`.

```sh
npx vercel        # primeira publicação (cria o projeto e pergunta as opções)
npx vercel --prod # publica em produção
```

Pela interface da Vercel, importe o repositório e aceite as configurações detectadas: **Build Command** `npm run build`, **Output Directory** `dist`, sem framework. Depois gere um QR code do endereço público para o evento — `localhost` não é acessível de fora.

Qualquer hospedagem estática também serve: basta publicar o conteúdo de `dist/`.

## Percorrer

1. **Começar** aproxima a câmera do notebook e abre as oito camadas.
2. Cada passo mostra o nome da camada em destaque, uma frase de explicação e o rastro técnico da operação.
3. A trilha numerada avança, volta ou pula direto para qualquer passo. As setas **←** e **→** do teclado fazem o mesmo.
4. Nada avança sozinho: não há temporizador em nenhum ponto.
5. Depois da infraestrutura, a resposta volta à tela e aparecem as oito práticas da engenharia de software.
6. **Explorar as camadas** libera a maquete: toque em uma camada, arraste para girar. **↺** ou **Escape** reinicia.

## Conteúdo

As oito camadas usam o termo técnico como título e uma frase em linguagem simples logo abaixo:

| #   | Termo                | Em uma frase                                                                |
| --- | -------------------- | --------------------------------------------------------------------------- |
| 1   | Interface do usuário | Mostra as informações e recebe o que você digita ou toca.                   |
| 2   | Front-end            | Reage ao clique, confere os campos e monta o pedido ao servidor.            |
| 3   | API                  | Endereços combinados (endpoints) que recebem pedidos e devolvem respostas.  |
| 4   | Camada de aplicação  | Define a ordem do caso de uso. Organiza, mas não decide as regras.          |
| 5   | Domínio              | Guarda as regras de negócio, que existiriam mesmo sem computador.           |
| 6   | Persistência         | O repositório traduz objetos do sistema em registros do banco.              |
| 7   | Banco de dados       | Armazena os dados de forma organizada e durável.                            |
| 8   | Infraestrutura       | Servidores, rede e monitoramento sustentam todas as camadas ao mesmo tempo. |

O fecho apresenta a disciplina inteira, não só a arquitetura: requisitos, arquitetura, implementação, testes, versionamento, CI/CD, monitoramento e manutenção.

## Arquitetura

```text
src/
  main.js                    Inicialização
  experience.js              Modos, navegação e legendas
  data/
    layers.js                Termos, cores e explicações das camadas
    guide.js                 Passos da requisição, fecho e práticas
  scene/
    intro-world.js           Pessoa, sala, notebook e câmera WebGL
    art-direction.js         Geometrias, cabelo, mãos e ambientação
    scene.js                 Maquete CSS 3D, foco e enquadramento
    content.js               Diagrama interno de cada camada
    icons.js                 Conjunto de ícones em traço
  animation/
    guided-tour.js           Avanço manual e reinício da narrativa
    layer-transitions.js     Transições canceláveis entre camadas
  ui/
    controls.js              Painel, trilha de passos e práticas
  styles/                    Estilos divididos por responsabilidade
scripts/                     Build e verificação de sintaxe
tests/                       Testes da narrativa e do conteúdo
server.cjs                   Servidor local
vercel.json                  Configuração de publicação
```

A abertura usa **Three.js** com geometrias e texturas geradas no próprio projeto. As camadas usam CSS 3D e HTML, para o texto continuar nítido e os controles acessíveis. Sem React, sem CDN, sem fontes remotas, sem conta ou API externa.

A renderização WebGL para ao entrar nas camadas ou ao ocultar a aba. A resolução é limitada em telas de alta densidade e a preferência de movimento reduzido é respeitada. Se o WebGL não estiver disponível, a abertura é omitida e a experiência continua a partir das camadas.

## Interface

Todo o texto e todos os botões vivem em um único painel centralizado, no mesmo lugar em cada passo — o alvo nunca muda de posição. Em telas largas, a pilha de camadas fica à esquerda e a camada aberta à direita; em telas estreitas, só a camada aberta aparece e o painel sobe um pouco para ficar ao alcance do polegar.

## Verificar e publicar

```sh
npm run check
npm test
npm run format:check
npm run build
```

Para editar o conteúdo educativo, comece por `src/data/`. Para alterar a abertura, use `src/scene/intro-world.js` e `src/scene/art-direction.js`. Rode `npm run format` depois das alterações.

## Modelo didático

A candidatura é uma simulação: nenhum dado é coletado ou enviado. As regras ilustrativas não representam um edital oficial da SEAL.

As oito camadas representam responsabilidades possíveis de uma aplicação web, não uma arquitetura obrigatória. A infraestrutura sustenta o sistema inteiro e não é uma etapa posterior ao banco de dados.
