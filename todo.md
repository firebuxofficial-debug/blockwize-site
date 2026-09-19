# Atualização de feedback e recompensa

- [x] Definir a sequência de feedback para respostas incorretas sem antecipar a correção antes da confirmação.
- [x] Implementar a revelação da alternativa correta e a confirmação visual da alternativa incorreta.
- [x] Adicionar o aviso de elegibilidade para 500–1.000 Robux apenas para pontuação perfeita, com linguagem não garantida.
- [x] Validar o fluxo de erro, acerto, resultado e reinício em desktop e mobile.

## Redesenho do painel e animações

- [x] Redefinir o painel principal com menor largura, cantos assimétricos e silhueta menos quadrada.
- [x] Adicionar animações de entrada, seleção, feedback e progresso respeitando redução de movimento.
- [x] Reforçar o bloco de recompensa e a tela de pontuação perfeita com mensagem clara de elegibilidade e verificação.
- [x] Validar as novas composições em desktop e mobile.

## Destaque de Robux e visuais do palco

- [x] Criar um tratamento tipográfico maior para o valor de Robux, sem apresentar a recompensa como garantia automática.
- [x] Inserir imagens decorativas no painel das perguntas sem encobrir o título, as alternativas ou os controles.
- [x] Validar o destaque do prêmio e a nova composição visual em desktop e mobile.

## Tela de conquista perfeita

- [x] Criar uma composição celebratória exclusiva para o resultado 5/5, com imagem e hierarquia de conquista.
- [x] Adicionar seleção visual de preferência entre 500 e 1.000 Robux, sem representar a seleção como entrega garantida.
- [x] Implementar confirmação de preferência e opção de reiniciar o quiz.
- [x] Validar a tela de conquista em desktop e mobile.

## Correção da conquista móvel

- [x] Reposicionar e redimensionar a ilustração de pontuação perfeita em telas móveis.
- [x] Suavizar o formato do botão de salvar preferência de Robux.
- [x] Remover o botão “Play again” da experiência de resultado perfeito.
- [x] Validar a tela especial em viewport de celular.

## Auditoria visual móvel completa

- [x] Corrigir a imagem celebratória para que não apareça em bloco quadrado nem ultrapasse o painel no celular.
- [x] Revisar e ajustar fundos, ornamentos, painéis, ilustrações e botões em todos os estados móveis.
- [x] Validar os estados de pergunta, resposta revelada, resultado comum e resultado perfeito em viewport de celular.

## Correção de ancoragem estreita

- [x] Remover qualquer posicionamento lateral residual da arte de conquista em celulares estreitos.
- [x] Exibir a ilustração em um contêiner centralizado, com largura limitada e recorte interno seguro.
- [x] Validar a composição final em uma largura próxima à captura reportada pelo usuário.

## Ajuste visual da conquista desktop

- [x] Remover o fundo escuro ou quadrado visível atrás da ilustração celebratória.
- [x] Substituir o círculo decorativo por um símbolo visual de Robux que mantenha contraste com o painel.
- [x] Validar a composição de pontuação perfeita em desktop e mobile.

## Arte sem fundo e destaque de 1.000 Robux

- [x] Remover integralmente a camada de fundo residual da ilustração celebratória.
- [x] Adicionar selo com chama e a mensagem “Most popular” à preferência de 1.000 Robux.
- [x] Validar a tela de conquista em desktop e celular após os ajustes.

## Identificação de usuário Roblox

- [x] Verificar a viabilidade da consulta pela API pública do Roblox no projeto atual e adicionar uma rota de servidor para evitar bloqueio do navegador.
- [x] Criar o formulário para informar o username após salvar a preferência de Robux.
- [x] Consultar o perfil, carregar o avatar e exibir username e display name.
- [x] Implementar as ações “This isn’t me” e “Confirm”.
- [x] Validar sucesso, username inexistente, erro de rede e retorno ao formulário.
- [x] Validar no fluxo visual a mensagem de erro temporário da API do Roblox e a possibilidade de tentar novamente.
- [x] Validar uma nova busca bem-sucedida após o erro temporário sem recarregar a página.

## Ajustes de resgate e perfil Roblox

- [x] Alterar o CTA de continuação para “Redeem my Robux”.
- [x] Diagnosticar e corrigir o carregamento do avatar retornado pela API pública do Roblox.
- [x] Exibir um aviso de username inválido sem erro técnico exposto ao jogador.
- [x] Validar perfil com avatar, username inválido e ausência de erros técnicos visíveis.

## Escolha de método de recebimento

- [x] Criar uma tela final após a confirmação da conta para selecionar o método de recebimento.
- [x] Implementar a opção Roblox Plus com indicação de processamento imediato.
- [x] Implementar a opção Group payout com prazo de até 7 dias e indicação de taxa do Roblox coberta.
- [x] Adicionar ícones e imagem de Robux integrados à composição visual.
- [x] Validar seleção, confirmação de método e responsividade.

## Etapa final de verificação da comunidade

- [x] Criar uma tela final chamativa após a confirmação do método de recebimento.
- [x] Exibir instruções simples para a entrada no Discord e na comunidade Roblox.
- [x] Adicionar botões externos para o Discord e o grupo Roblox usando os links oficiais fornecidos.
- [x] Implementar estados de progresso honestos após abrir cada destino, sem alegar detecção de entrada sem integração real.
- [x] Destacar o aviso sobre contas Roblox com menos de 30 dias, contas alternativas e a entrada via link privado.
- [x] Validar desktop, celular, estados de progresso e redirecionamentos.

## Página inicial Blockwise em inglês

- [x] Criar a rota pública `/home/en` e manter o quiz disponível em `/en`.
- [x] Construir uma página inicial infantil e explicativa sobre os caminhos para participar: quiz ou convite de amigos.
- [x] Explicar com linguagem clara o modelo sustentado por patrocinadores e anúncios de lojas parceiras, sem alegar métodos ilegais para Robux.
- [x] Adicionar chamadas para ação que levem do início ao quiz em `/en`.
- [x] Preparar a estrutura de navegação para a futura rota `/home/pt`.
- [x] Validar visualmente a nova página em desktop e celular, além dos links internos.

## Refinamento animado da página inicial

- [x] Adicionar mais ilustrações e elementos visuais ao longo da página inicial.
- [x] Aplicar animações leves e seguras que reforcem a brincadeira sem prejudicar a leitura.
- [x] Arredondar e tornar mais expressivos os botões e as chamadas principais.
- [x] Simplificar as mensagens e usar sinais visuais para uma criança entender os passos rapidamente.
- [x] Validar em desktop e celular o novo ritmo visual, os botões e a legibilidade.

## Aviso de limite e patrocínio

- [x] Informar que o limite atual de preferência de recompensa é de 500–1.000 Robux.
- [x] Explicar de forma simples que o limite existe enquanto o projeto tem poucos patrocinadores e estrutura limitada.
- [x] Adicionar uma chamada clara para possíveis patrocinadores entrarem em contato pelo Discord oficial.
- [x] Validar o novo aviso e o link de Discord em desktop e celular.

## Versão brasileira em português

- [x] Criar a rota `/home/pt` com uma página inicial integralmente em português do Brasil.
- [x] Criar a rota `/pt` com as cinco perguntas, feedback, resultados e resgate integralmente em português.
- [x] Traduzir a etapa de perfil Roblox, escolha de recebimento e verificação de comunidade para português.
- [x] Adicionar navegação entre as versões em inglês e português sem alterar as rotas existentes.
- [x] Validar desktop, celular, fluxo do quiz e conteúdo em português nas novas rotas.

## Revisão final da versão brasileira

- [x] Traduzir o texto residual do rodapé e qualquer microcopy em inglês visível em `/home/pt`.
- [x] Validar o fluxo perfeito completo em `/pt`, incluindo perfil, entrega e comunidade, em português.
- [x] Fazer uma revisão final em desktop e celular para confirmar que não restaram textos não traduzidos fora de nomes de marca.

## Ajustes finais de localização brasileira

- [x] Traduzir os rótulos auxiliares e acessíveis restantes nas rotas `/home/pt` e `/pt`.
- [x] Validar uma busca real de perfil no fluxo perfeito em português antes de confirmar conta, entrega e comunidade.

## Validação ponta a ponta do perfil brasileiro

- [x] Confirmar visualmente o cartão de perfil real em português e avançar dele até a etapa de comunidade sem usar atalhos intermediários.
- [x] Impedir que uma indisponibilidade temporária do thumbnail de avatar bloqueie a confirmação do perfil Roblox.

## Painel administrativo

- [x] Criar o modelo de dados para visitas, conclusões de quiz e perfis Roblox confirmados.
- [x] Implementar autenticação administrativa segura por e-mail e senha sem expor a senha no cliente.
- [x] Criar a rota protegida `/admin/painel` com tela de login e sessão administrativa.
- [x] Construir o dashboard com métricas reais de visitas, conclusões, pontuações e contas Roblox.
- [x] Criar a categoria de usuários com lista de username, display name, avatar e status da recompensa.
- [x] Integrar os eventos do quiz e da confirmação de perfil ao armazenamento das métricas.
- [x] Validar login, proteção de rota, dados vazios, dashboard e responsividade.

## Evolução em tempo real do painel administrativo

- [x] Definir a atualização automática do painel sem depender de botão de recarregar e documentar o comportamento adotado.
- [x] Manter a sincronização automática compatível com publicação serverless em Vercel, sem processo persistente.
- [x] Corrigir a persistência e a exibição de avatares Roblox no fluxo público e na lista administrativa.
- [x] Criar o armazenamento configurável dos links de Discord e grupo Roblox.
- [x] Criar a categoria Links no painel para alterar e salvar ambos os destinos imediatamente.
- [x] Fazer as telas públicas utilizarem os links ativos configurados no painel.
- [x] Refinar o login e o dashboard com aparência mais formal, elementos visuais profissionais e animações sutis.
- [x] Validar sincronização automática, avatares, edição de links, rota protegida e responsividade.
- [x] Validar o salvamento dos links oficiais no painel e a leitura persistida pela configuração pública.
- [x] Conferir a responsividade do login e das três categorias administrativas em viewport móvel.

## Prontidão para Vercel e auditoria final

- [x] Auditar scripts de build, rotas SPA, variáveis de ambiente e requisitos de execução para Vercel.
- [x] Revisar superfícies de segurança: autenticação administrativa, cookies, validação de entradas e limites das consultas públicas.
- [x] Examinar dependências, arquivos de implantação, logs e erros de navegador para identificar riscos ou regressões.
- [x] Aplicar correções objetivas de compatibilidade, confiabilidade e segurança encontradas na auditoria.
- [x] Validar build de produção, rotas públicas e protegidas, fluxos críticos e comportamento responsivo após as correções.
- [x] Criar documentação concisa de variáveis e passos necessários para a implantação na Vercel.
- [x] Adaptar o Express para exportação serverless na Vercel e configurar rewrites seguros para API e SPA.
- [x] Restringir payloads HTTP, remover cabeçalhos reveladores e aplicar cabeçalhos de proteção na resposta.
- [x] Validar dados canônicos do Roblox no servidor e vincular atualizações de recompensa ao visitorId correspondente.
- [x] Atualizar ou remover dependências de produção vulneráveis sem uso no Blockwise.
- [x] Remover o carregamento de analytics que depende de placeholders não garantidos em builds externos.
- [x] Restaurar a rota OAuth existente na entrada compartilhada do Express e validar sua disponibilidade após a adaptação serverless.
- [x] Validar novamente o painel autenticado e as rotas críticas em viewport móvel após o hardening final.
- [x] Validar visualmente em viewport móvel o painel autenticado nas visões Visão geral, Usuários e Links.
