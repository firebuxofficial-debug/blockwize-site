# Direção de Design — Roblox Quiz

## Três abordagens consideradas

### 1. Arcade Editorial
**Very Brief Intro:** Um quiz com energia de sala de jogos contemporânea, usando grandes áreas de cor, blocos gráficos e uma sensação de movimento organizada. Parece divertido sem perder clareza ou refinamento.

**Probability:** 0.07

### 2. Creator Studio
**Very Brief Intro:** Uma estética inspirada em interfaces de criação, com painéis claros, marcadores de progresso técnicos e uma composição mais sóbria. Prioriza concentração e confiança.

**Probability:** 0.04

### 3. Block Party
**Very Brief Intro:** Um ambiente leve e lúdico inspirado em construções modulares, com formas arredondadas e contrastes de cor calorosos. O resultado é acolhedor, jovem e imediatamente reconhecível.

**Probability:** 0.09

---

## Abordagem selecionada: Arcade Editorial

### Design Movement
Uma interpretação contemporânea do **editorial playfulness**, combinando a linguagem gráfica de pôsteres juvenis com a nitidez funcional de interfaces de produto.

### Core Principles
1. **Energia controlada:** cor e movimento orientam a atenção, sem competir com a pergunta.
2. **Legibilidade primeiro:** toda decisão visual preserva contraste, hierarquia e foco na alternativa selecionada.
3. **Blocos expressivos:** superfícies, indicadores e ícones funcionam como peças gráficas, não como decoração genérica.
4. **Progresso celebrável:** cada avanço parece uma pequena conquista e o resultado é tratado como um momento de conclusão.

### Color Philosophy
O fundo carvão-azulado cria um palco calmo e premium para os conteúdos. O **Tangerine Pixel** — um laranja vivo — aparece como assinatura de ação, seleção e progresso; azul-céu e amarelo-claro entram pontualmente para dar ritmo sem converter a interface em um arco-íris. As áreas de leitura permanecem claras e amplas para manter o quiz profissional.

### Layout Paradigm
Uma composição em **faixa editorial assimétrica**: uma coluna lateral fixa em telas amplas contém a marca e o contador, enquanto o conteúdo da pergunta ocupa um palco branco deslocado para a direita. Em telas menores, os elementos se empilham, preservando uma faixa de progresso bem definida.

### Signature Elements
- Um símbolo de cubo isométrico recortado, usado como marca e em detalhes de progresso.
- Um trilho de progresso segmentado, com cada pergunta representada por uma célula colorida.
- Formas quadradas translúcidas e inclinadas no pano de fundo, evocando construção e criação.

### Interaction Philosophy
A interface responde como um jogo bem projetado: alternativas têm feedback imediato de foco e seleção; o botão só se torna o protagonista após uma escolha; o avanço mantém o usuário situado no percurso. Todas as ações essenciais permanecem disponíveis por teclado.

### Animation
Entradas usam opacidade e deslocamento horizontal suave de até 240 ms, com `cubic-bezier(0.23, 1, 0.32, 1)`. Opções elevam discretamente no hover e comprimem para `scale(0.98)` no clique. Ao avançar, a pergunta sai para a esquerda e a próxima entra da direita; com `prefers-reduced-motion`, as transições tornam-se instantâneas. O progresso usa transformações curtas, nunca animação de largura.

### Typography System
**Archivo Black** define títulos, contadores e o wordmark, dando a sensação compacta de um pôster. **DM Sans** atende perguntas, alternativas e instruções, com alta legibilidade. Títulos usam caixa normal e espaçamento levemente fechado; labels usam caixa alta, peso 700 e tracking generoso.

### Brand Essence
**Blockwise é o quiz rápido e visual para fãs que querem provar quanto conhecem o universo Roblox — sem ruído, com personalidade.**

Personalidade: **energética, clara, confiante**.

### Brand Voice
Direta, divertida e respeitosa com o tempo de quem joga. Headline e CTAs usam verbos e convites objetivos, evitando clichês de landing pages.

Exemplos: “**Build your score, one question at a time.**” e “**Lock in your answer.**”

### Wordmark & Logo
O wordmark “Blockwise” combina letras pretas compactas com um corte quadrado no “o”. A marca é um cubo isométrico laranja com uma face vazada, sugerindo tanto uma peça de construção quanto uma janela de jogo — sem texto para poder ser usada isoladamente.

### Signature Brand Color
**Tangerine Pixel — #FF6B35**. Um laranja direto, luminoso e próprio para ações de quiz.

## Style Decisions

- Toda superfície principal do quiz deve se comportar como um bloco modular, evitando controles com aparência de formulário padrão.
- **Tangerine Pixel** fica reservado a ação, seleção, progresso e recompensa; azul-céu e amarelo-claro sustentam o ritmo visual como acentos secundários.
- A microcopy deve ser curta, específica e lúdica, usando expressões como “Lock it in”, “Next build” e “Score secured”.
- O wordmark usa o “O” vazado por um quadrado girado, e o progresso funciona como um placar compacto com blocos de construção.
- Ilustrações de personagem na área de perguntas precisam receber molduras angulares, fragmentos de cubo e acentos Tangerine Pixel para parecerem parte do pôster, não um elemento independente.
- As alternativas mantêm geometria construída, com cantos assimétricos, badges e detalhes de bloco; o progresso e a recompensa sinalizam o avanço de forma celebratória.
- A tela de pontuação perfeita é um momento de conquista: usa uma ilustração de personagem em celebração, módulos de escolha de recompensa e linguagem de verificação clara, sem prometer entrega automática.
- Hover, seleção, progresso e módulos de recompensa usam Tangerine Pixel como sinal dominante de ação e conquista.
