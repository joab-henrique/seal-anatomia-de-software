# Direção de arte, animação e linguagem

## Vocabulário

O público é leigo, mas a liga é de engenharia de software: usar apelidos no lugar dos termos reais economizaria uma dúvida e custaria o aprendizado. Cada camada exibe o termo correto como título — Interface do usuário, Front-end, API, Camada de aplicação, Domínio, Persistência, Banco de dados, Infraestrutura — seguido de uma única frase em linguagem comum. Nenhum outro elemento disputa espaço com essa frase.

O fecho existe porque arquitetura é só uma parte da disciplina. Análise de requisitos, gestão de processos, testes, versionamento, DevOps, monitoramento e manutenção aparecem juntos, para que ninguém saia achando que engenharia de software é só desenhar caixas.

A liga se organiza em torno de quatro eixos: arquitetura, gestão de processos, testes e DevOps. Em vez de abrir a experiência com uma lista explícita deles, três passos da jornada guiada dão um aceno curto e não técnico a cada eixo que não é a arquitetura: o passo da aplicação liga a ordem do trabalho à lógica de organizar um time, o do domínio liga uma regra de negócio a um teste bem escrito, e o da infraestrutura nomeia o DevOps diretamente. A arquitetura já é o fio condutor da jornada inteira; não precisa de um aceno à parte.

O texto é curto de propósito: a leitura acontece de pé, num evento, entre uma conversa e outra. Uma frase por passo, com o nome da camada como maior elemento da tela.

## Composição

Um painel só, centralizado, ancorado no rodapé. A trilha de passos, o texto e os botões ocupam sempre as mesmas coordenadas, então o alvo nunca foge do dedo entre um passo e outro. Em telas estreitas o painel sobe um pouco, para o botão principal cair na zona alcançável pelo polegar.

Quando há largura suficiente, a pilha inteira fica à esquerda e a camada aberta à direita: dá para ver onde se está e ler o conteúdo ao mesmo tempo. Em telas estreitas só a camada aberta aparece, porque disputar espaço deixaria as duas ilegíveis.

Cada placa da pilha carrega uma etiqueta com o próprio nome na faixa inferior — a única parte que não fica coberta pela placa de cima. Assim a arquitetura se lê como diagrama, sem depender de tocar em nada.

## Escolhas técnicas

- **Three.js na abertura:** permite modelar a pessoa de costas, articular dedos e postura, iluminar materiais e aproximar a câmera de verdade. Geometrias e texturas são geradas no projeto, sem modelos externos nem licenças adicionais.
- **Enquadramento consciente do painel:** `setViewOffset` compõe a cena dentro do retângulo que sobra acima do painel, e a distância da câmera vem da largura que precisa caber. O mesmo código serve de retrato a ultrawide.
- **CSS 3D nas camadas:** mantém o conteúdo nítido, selecionável e leve. A camada escolhida ganha uma vista frontal ampliada, com o mesmo desenho da placa.
- **Web Animations API nas transições:** as animações de entrada e saída são canceláveis; cliques rápidos não deixam objetos antigos na tela.
- **Módulos nativos:** conteúdo, estados, cena, transições e controles têm responsabilidades separadas. React não acrescentaria nenhuma capacidade necessária aqui.
- **Celular:** resolução WebGL limitada, uma só cena, poeira em um draw call e cabelo instanciado. A renderização para ao sair da abertura e ao ocultar a aba.

## Personagem

Silhueta estilizada, vista de costas: moletom com trama de tecido e a marca da liga, capuz com volume real ao redor do pescoço e ombros com jugo, para o corpo não parecer um empilhamento de esferas.

O cabelo tem casquete contínuo por baixo e duas camadas de cachos instanciados, com tamanho, profundidade e tom variados, mais mechas mais longas na nuca — é exatamente o que a câmera de abertura enquadra.

As mãos têm dedos independentes: cada um pressiona a tecla em tempos próprios, com pausas, o que faz a digitação parecer digitação. O ponteiro na tela caminha até “Quero fazer parte” e clica, em ciclo — é o gesto que a experiência inteira vai explicar.

## Fontes técnicas

- [Documentação do Three.js](https://threejs.org/docs/)
- [Web Animations API — MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)

As escolhas acima valem para este projeto; não são uma afirmação de que existe uma única stack ideal para sites imersivos.
