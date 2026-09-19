import type { CommunityTask, CommunityTaskStatus } from "./communityProgress";

export type AppLocale = "en" | "pt";

export type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: number;
};

type QuizCopy = {
  questions: QuizQuestion[];
  railEdition: string;
  quizHomeAria: string;
  railEyebrow: string;
  railTitle: string;
  railIntro: string;
  perfectReward: string;
  railEligibility: string;
  railInstruction: string;
  railAudience: string;
  knowledgeCheck: string;
  challengeComplete: string;
  questionOf: (current: number, total: number) => string;
  progressLabel: string;
  perfectBadge: string;
  quizCompleted: string;
  perfectTitle: string;
  perfectIntro: string;
  rewardPickerAria: string;
  rewardPickerLabel: string;
  rewardPreference: string;
  mostPopular: string;
  chooseRewardAmount: string;
  redeem: string;
  accountCheck: string;
  findAccountTitle: string;
  findAccountIntro: string;
  usernameLabel: string;
  usernamePlaceholder: string;
  publicProfileNote: string;
  lookingUp: string;
  findAccount: string;
  requiredUsername: string;
  usernameNotFound: string;
  usernameUnavailable: string;
  accountFound: string;
  isThisYou: string;
  profileIntro: string;
  notMe: string;
  confirmAccount: string;
  accountConfirmed: string;
  chooseDeliveryTitle: string;
  chooseDeliveryIntro: (username: string) => string;
  verifiedAccount: string;
  deliveryAria: string;
  fastestOption: string;
  robuxNow: string;
  groupPayout: string;
  upToSevenDays: string;
  groupFeeCovered: string;
  chooseDeliveryMethod: string;
  continueLastStep: string;
  lastStepUnlocked: string;
  almostThere: string;
  joinBothTitle: string;
  joinBothIntro: (username: string) => string;
  communityAria: string;
  doFirst: string;
  thenDoThis: string;
  discordTitle: string;
  discordIntro: string;
  joinDiscord: string;
  robloxGroupTitle: string;
  robloxGroupIntro: string;
  important: string;
  groupWarning: string;
  privateGroupNote: string;
  joinRobloxGroup: string;
  communityTrustNote: string;
  resultBadge: string;
  finalScore: string;
  perfectResultMessage: string;
  playAgain: string;
  challenge: (number: number) => string;
  answerChoices: string;
  chooseAnswer: string;
  correctAnswerHint: string;
  answerSelected: string;
  seeResult: string;
  nextQuestion: string;
  lockAnswer: string;
  scoreMessage: (score: number) => string;
};

const enQuestions: QuizQuestion[] = [
  { question: "In which year did Roblox officially launch?", options: ["2004", "2006", "2008", "2010"], correctAnswer: 1 },
  { question: "What is Roblox's virtual currency called?", options: ["BloxCoins", "Robux", "R-Coins", "Build Bucks"], correctAnswer: 1 },
  { question: "Which tool do creators use to build Roblox experiences?", options: ["Roblox Studio", "Roblox Builder", "Blox Workshop", "Creator Console"], correctAnswer: 0 },
  { question: "What are the games on Roblox commonly called today?", options: ["Servers", "Worlds", "Experiences", "Missions"], correctAnswer: 2 },
  { question: "Which is a smart way to protect your Roblox account?", options: ["Share your password with close friends", "Use the same password everywhere", "Enable account security features and keep your password private", "Post your login code in chat"], correctAnswer: 2 },
];

const ptQuestions: QuizQuestion[] = [
  { question: "Em que ano o Roblox foi lançado oficialmente?", options: ["2004", "2006", "2008", "2010"], correctAnswer: 1 },
  { question: "Como se chama a moeda virtual do Roblox?", options: ["BloxCoins", "Robux", "R-Coins", "Build Bucks"], correctAnswer: 1 },
  { question: "Qual ferramenta os criadores usam para fazer experiências no Roblox?", options: ["Roblox Studio", "Roblox Builder", "Blox Workshop", "Creator Console"], correctAnswer: 0 },
  { question: "Como os jogos do Roblox são chamados hoje em dia?", options: ["Servidores", "Mundos", "Experiências", "Missões"], correctAnswer: 2 },
  { question: "Qual é uma forma inteligente de proteger sua conta Roblox?", options: ["Compartilhar sua senha com amigos próximos", "Usar a mesma senha em todos os lugares", "Ativar recursos de segurança e manter a senha privada", "Enviar seu código de login no chat"], correctAnswer: 2 },
];

export const quizContent: Record<AppLocale, QuizCopy> = {
  en: {
    questions: enQuestions,
    railEdition: "Roblox edition", quizHomeAria: "Blockwise quiz home", railEyebrow: "Five-question challenge", railTitle: "Build your score, one question at a time.", railIntro: "Put your Roblox knowledge to the test in this quick quiz.", perfectReward: "Perfect 5/5 reward", railEligibility: "Score 5/5 to qualify. Eligibility is verified after completion.", railInstruction: "Choose one answer, then lock it in.", railAudience: "Made for curious players", knowledgeCheck: "Roblox knowledge check", challengeComplete: "Challenge complete", questionOf: (current, total) => `Question ${String(current).padStart(2, "0")} of ${String(total).padStart(2, "0")}`, progressLabel: "Build", perfectBadge: "Perfect score", quizCompleted: "Quiz completed · 5/5", perfectTitle: "You built a perfect run.", perfectIntro: "Every answer was correct. Choose the Robux amount you would prefer for eligibility review.", rewardPickerAria: "Choose your preferred Robux reward amount", rewardPickerLabel: "Choose your amount", rewardPreference: "Reward preference", mostPopular: "Most popular", chooseRewardAmount: "Choose a reward amount", redeem: "Redeem my Robux", accountCheck: "Account check", findAccountTitle: "Find your Roblox account.", findAccountIntro: "Enter your Roblox username and we’ll show the public profile connected to it.", usernameLabel: "Roblox username", usernamePlaceholder: "e.g. Roblox", publicProfileNote: "We only check public Roblox profile data. Never enter your password.", lookingUp: "Looking up account", findAccount: "Find my account", requiredUsername: "Enter your Roblox username to continue.", usernameNotFound: "We couldn’t find that Roblox username. Check the spelling and try again.", usernameUnavailable: "We couldn’t reach Roblox right now. Please try again in a moment.", accountFound: "Account found", isThisYou: "Is this you?", profileIntro: "Review the public Roblox account below before continuing.", notMe: "This isn’t me", confirmAccount: "Confirm account", accountConfirmed: "Account confirmed", chooseDeliveryTitle: "Choose how to receive.", chooseDeliveryIntro: (username) => `Select the delivery method that works best for @${username}.`, verifiedAccount: "Verified account", deliveryAria: "Choose a Robux delivery method", fastestOption: "Fastest option", robuxNow: "Robux land right away", groupPayout: "Group payout", upToSevenDays: "Up to 7 days", groupFeeCovered: "We cover the Roblox fee", chooseDeliveryMethod: "Choose a delivery method", continueLastStep: "Continue to the last step", lastStepUnlocked: "Last step unlocked", almostThere: "Almost there", joinBothTitle: "Join both communities.", joinBothIntro: (username) => `To finish your request for @${username}, join our Discord and Roblox community. This helps us complete the player review.`, communityAria: "Community verification steps", doFirst: "Do this first", thenDoThis: "Then do this", discordTitle: "BlockWise — Community Discord", discordIntro: "Join the server, then come back here. Keep it open for a moment so you can complete this quick check-in.", joinDiscord: "Join the Discord", robloxGroupTitle: "BlockWiser — Group Roblox", robloxGroupIntro: "Join with the same Roblox account that you confirmed above.", important: "Important:", groupWarning: "Accounts newer than 30 days and alt accounts may be automatically removed from the group.", privateGroupNote: "This is a private link. The group is not verified, so it may not appear in Roblox community search.", joinRobloxGroup: "Join the Roblox group", communityTrustNote: "After opening a community, wait up to 45 seconds and return here. This page cannot prove membership by itself; final participation is checked during reward review.", resultBadge: "Score secured", finalScore: "Your final score", perfectResultMessage: "You earned a perfect score. Qualify for the Robux reward; eligibility is verified after completion.", playAgain: "Play again", challenge: (number) => `Challenge ${number}`, answerChoices: "Answer choices", chooseAnswer: "Choose your build.", correctAnswerHint: "Not quite — the correct build is highlighted.", answerSelected: "Answer selected. Lock it in.", seeResult: "See my result", nextQuestion: "Next build", lockAnswer: "Lock in answer", scoreMessage: (score) => score === 5 ? "Block master! You know Roblox inside out." : score >= 4 ? "Builder status unlocked. That was a strong run." : score >= 2 ? "Solid start. A few more rounds and you will level up." : "Every expert begins with a first block. Try another round.",
  },
  pt: {
    questions: ptQuestions,
    railEdition: "Edição Roblox", quizHomeAria: "Página inicial do quiz Blockwise", railEyebrow: "Desafio de cinco perguntas", railTitle: "Construa sua pontuação, uma pergunta de cada vez.", railIntro: "Teste o que você sabe sobre Roblox neste quiz rapidinho.", perfectReward: "Recompensa por 5/5", railEligibility: "Faça 5/5 para se qualificar. A elegibilidade é verificada depois de concluir.", railInstruction: "Escolha uma resposta e confirme.", railAudience: "Feito para jogadores curiosos", knowledgeCheck: "Teste de conhecimento Roblox", challengeComplete: "Desafio concluído", questionOf: (current, total) => `Pergunta ${String(current).padStart(2, "0")} de ${String(total).padStart(2, "0")}`, progressLabel: "Progresso", perfectBadge: "Pontuação perfeita", quizCompleted: "Quiz concluído · 5/5", perfectTitle: "Você fez uma partida perfeita.", perfectIntro: "Todas as respostas estavam certas. Escolha a quantidade de Robux que você prefere para a análise de elegibilidade.", rewardPickerAria: "Escolha a quantidade de Robux que você prefere", rewardPickerLabel: "Escolha sua quantidade", rewardPreference: "Preferência de recompensa", mostPopular: "Mais escolhida", chooseRewardAmount: "Escolha uma quantidade", redeem: "Resgatar meus Robux", accountCheck: "Verificar conta", findAccountTitle: "Encontre sua conta Roblox.", findAccountIntro: "Digite seu nome de usuário do Roblox e vamos mostrar o perfil público conectado a ele.", usernameLabel: "Nome de usuário do Roblox", usernamePlaceholder: "ex.: Roblox", publicProfileNote: "Só verificamos dados públicos do perfil Roblox. Nunca digite sua senha.", lookingUp: "Procurando conta", findAccount: "Encontrar minha conta", requiredUsername: "Digite seu nome de usuário do Roblox para continuar.", usernameNotFound: "Não encontramos esse nome de usuário Roblox. Confira a escrita e tente novamente.", usernameUnavailable: "Não conseguimos acessar o Roblox agora. Tente novamente daqui a pouco.", accountFound: "Conta encontrada", isThisYou: "É você?", profileIntro: "Confira a conta pública do Roblox abaixo antes de continuar.", notMe: "Não sou eu", confirmAccount: "Confirmar conta", accountConfirmed: "Conta confirmada", chooseDeliveryTitle: "Escolha como receber.", chooseDeliveryIntro: (username) => `Escolha o método que funciona melhor para @${username}.`, verifiedAccount: "Conta verificada", deliveryAria: "Escolha um método de entrega de Robux", fastestOption: "Opção mais rápida", robuxNow: "Os Robux caem na hora", groupPayout: "Pagamento pelo grupo", upToSevenDays: "Até 7 dias", groupFeeCovered: "Nós cobrimos a taxa do Roblox", chooseDeliveryMethod: "Escolha um método de entrega", continueLastStep: "Continuar para a última etapa", lastStepUnlocked: "Última etapa liberada", almostThere: "Quase lá", joinBothTitle: "Entre nas duas comunidades.", joinBothIntro: (username) => `Para terminar seu pedido de @${username}, entre no nosso Discord e na comunidade Roblox. Isso ajuda na análise do jogador.`, communityAria: "Etapas de verificação da comunidade", doFirst: "Faça isso primeiro", thenDoThis: "Depois faça isso", discordTitle: "BlockWise — Comunidade Discord", discordIntro: "Entre no servidor e volte aqui. Deixe-o aberto por um momento para fazer esta checagem rápida.", joinDiscord: "Entrar no Discord", robloxGroupTitle: "BlockWiser — Grupo Roblox", robloxGroupIntro: "Entre com a mesma conta Roblox que você confirmou acima.", important: "Importante:", groupWarning: "Contas criadas há menos de 30 dias e contas alternativas podem ser removidas automaticamente do grupo.", privateGroupNote: "Este é um link privado. O grupo não é verificado, então pode não aparecer na busca de comunidades do Roblox.", joinRobloxGroup: "Entrar no grupo Roblox", communityTrustNote: "Depois de abrir uma comunidade, espere até 45 segundos e volte aqui. Esta página não consegue provar a entrada sozinha; a participação final é analisada durante a revisão da recompensa.", resultBadge: "Pontuação salva", finalScore: "Sua pontuação final", perfectResultMessage: "Você fez uma pontuação perfeita. Você pode se qualificar para a recompensa de Robux; a elegibilidade é verificada depois de concluir.", playAgain: "Jogar novamente", challenge: (number) => `Desafio ${number}`, answerChoices: "Opções de resposta", chooseAnswer: "Escolha sua resposta.", correctAnswerHint: "Quase — a resposta certa está destacada.", answerSelected: "Resposta escolhida. Confirme agora.", seeResult: "Ver meu resultado", nextQuestion: "Próxima pergunta", lockAnswer: "Confirmar resposta", scoreMessage: (score) => score === 5 ? "Mestre dos blocos! Você sabe muito sobre Roblox." : score >= 4 ? "Status de construtor liberado. Você mandou muito bem." : score >= 2 ? "Bom começo. Mais algumas partidas e você sobe de nível." : "Todo especialista começa com o primeiro bloco. Tente mais uma vez.",
  },
};

export function getCommunityTaskMessageForLocale(
  locale: AppLocale,
  task: CommunityTask,
  status: CommunityTaskStatus,
) {
  if (locale === "pt") {
    if (status === "waiting") return task === "discord" ? "Deixe o Discord aberto por um momento e depois volte aqui." : "Deixe o grupo Roblox aberto por um momento e depois volte aqui.";
    if (status === "ready") return "Etapa do Discord pronta para análise. Vamos verificar a participação durante a revisão da recompensa.";
    if (status === "retry") return "Não conseguimos verificar o grupo Roblox por esta página. Confira se você entrou e tente novamente.";
    return "Abra a comunidade, entre nela e volte aqui para a próxima checagem.";
  }

  if (status === "waiting") return task === "discord" ? "Keep Discord open for a moment, then come back here." : "Keep the Roblox group open for a moment, then come back here.";
  if (status === "ready") return "Discord step ready for review. We will verify participation during reward review.";
  if (status === "retry") return "We could not check the Roblox group from this page. Make sure you joined, then try again.";
  return "Open the community, join it, then return here for the next check-in.";
}
