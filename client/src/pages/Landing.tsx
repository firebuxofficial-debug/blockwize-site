import { homeContent } from "@/lib/homeContent";
import type { AppLocale } from "@/lib/quizContent";
import { trpc } from "@/lib/trpc";
import { getVisitorId } from "@/lib/visitor";
import { assetUrl } from "@/lib/assets";
import {
  ArrowRight,
  BadgeCheck,
  CircleHelp,
  Gamepad2,
  Gift,
  HeartHandshake,
  Megaphone,
  MessageCircleMore,
  ShieldCheck,
  Sparkles,
  Store,
  Trophy,
} from "lucide-react";
import { Link } from "wouter";
import { useEffect } from "react";

const trustPoints = [
  { icon: Gift, label: "Free to join" },
  { icon: ShieldCheck, label: "No password needed" },
  { icon: BadgeCheck, label: "Clear review steps" },
];

const stepArtwork = [
  assetUrl("blockwise-step-quiz_20662360.png"),
  assetUrl("blockwise-step-friends_cf6d2a8f.png"),
  assetUrl("blockwise-step-safe_fb2280d7.png"),
];

const stepActions = ["Tap to play", "Share the fun", "Stay safe"];

const landingCopy = {
  en: {
    navAria: "Blockwise navigation", howItWorks: "How it works", homeAria: "Blockwise home", englishVersion: "English version", portugueseVersion: "Portuguese version", quizCta: "Take the quiz", kicker: "Roblox rewards, the clear way", title: <>A fun Roblox quiz. <em>Free</em> to join.</>, lead: "Play a short quiz. Share it with friends. If you get 5/5, follow the simple finish steps.", startQuiz: "Start the quiz", seeSteps: "See the steps", trustPoints: ["Free to join", "No password needed", "Clear review steps"], kidTipStrong: "Only 5 questions!", kidTip: "You can do it.", quickQuestions: "5 quick questions", freeChip: "100% free to join", howLabel: "Easy as 1, 2, 3", howTitle: "Three little steps. That is it.", howIntro: "Look at the pictures, then do one thing at a time. You never need to pay or give us your password.", stepActions: ["Tap to play", "Share the fun", "Stay safe"], sponsorLabel: "How can this be free?", sponsorTitle: "Sponsors help us keep the quiz free.", rewardRange: "Current reward range", sponsorCtaTitle: "Want to be a sponsor?", sponsorCtaBody: "Talk to us on Discord.", faqLabel: "Good to know", faqTitle: "You are safe here.", faq: [["Do I have to pay?", "Nope. It is free. Never pay someone to start a quiz."], ["Do you need my password?", "Never. Keep your password secret, even from us."], ["Can I invite friends?", "Yes! Send them the quiz link so they can have fun too."]], finalLabel: "Ready when you are", finalTitle: "Build your score, one question at a time.", finalCta: "Play the Roblox quiz", footerBrand: "Blockwise · Roblox edition", footer: "English page · Portuguese version",
  },
  pt: {
    navAria: "Navegação do Blockwise", howItWorks: "Como funciona", homeAria: "Página inicial Blockwise", englishVersion: "Versão em inglês", portugueseVersion: "Versão em português", quizCta: "Fazer o quiz", kicker: "Recompensas Roblox, do jeito certo", title: <>Um quiz Roblox divertido. <em>Grátis</em> para jogar.</>, lead: "Faça um quiz rapidinho. Compartilhe com amigos. Se fizer 5/5, siga as etapas simples para finalizar.", startQuiz: "Começar o quiz", seeSteps: "Ver as etapas", trustPoints: ["Grátis para jogar", "Sem senha", "Etapas claras"], kidTipStrong: "Apenas 5 perguntas!", kidTip: "Você consegue.", quickQuestions: "5 perguntas rápidas", freeChip: "100% grátis", howLabel: "É só 1, 2, 3", howTitle: "Três passinhos. Só isso.", howIntro: "Olhe as imagens e faça uma coisa de cada vez. Você nunca precisa pagar nem dar sua senha.", stepActions: ["Toque para jogar", "Compartilhe a diversão", "Fique seguro"], sponsorLabel: "Como isso é grátis?", sponsorTitle: "Patrocinadores ajudam a manter o quiz grátis.", rewardRange: "Faixa atual de recompensa", sponsorCtaTitle: "Quer ser patrocinador?", sponsorCtaBody: "Fale com a gente no Discord.", faqLabel: "É bom saber", faqTitle: "Você está seguro aqui.", faq: [["Preciso pagar?", "Não. É grátis. Nunca pague alguém para começar um quiz."], ["Vocês precisam da minha senha?", "Nunca. Guarde sua senha em segredo, até de nós."], ["Posso chamar amigos?", "Sim! Envie o link do quiz para eles se divertirem também."]], finalLabel: "Quando você quiser", finalTitle: "Construa sua pontuação, uma pergunta de cada vez.", finalCta: "Jogar o quiz Roblox", footerBrand: "Blockwise · Edição Roblox", footer: "Página em português · Versão em inglês",
  },
} as const;

export default function Landing({ locale = "en" }: { locale?: AppLocale }) {
  const copy = landingCopy[locale];
  const content = homeContent[locale];
  const recordVisit = trpc.analytics.visit.useMutation();
  const communityLinks = trpc.publicConfig.communityLinks.useQuery(undefined, {
    refetchInterval: 5_000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
  });
  const quizPath = locale === "pt" ? "/pt" : "/en";
  const homePath = locale === "pt" ? "/home/pt" : "/home/en";
  const rewardRange = `500–${(1000).toLocaleString(locale === "pt" ? "pt-BR" : "en-US")}`;

  useEffect(() => {
    recordVisit.mutate({ visitorId: getVisitorId(), locale });
  }, [locale]);

  return (
    <main className="home-page">
      <nav className="home-nav" aria-label={copy.navAria}>
        <Link href={homePath} className="home-brand" aria-label={copy.homeAria}>
          <img src={assetUrl("blockwise-cube-mark_b8ab918b.png")} alt="" />
          <span>BL<span>CK</span>WISE</span>
        </Link>
        <div className="home-nav-actions">
          <a href="#how-it-works">{copy.howItWorks}</a>
          <Link href="/home/en" className={`home-language ${locale === "en" ? "" : "is-muted"}`} aria-label={copy.englishVersion}>EN</Link>
          <Link href="/home/pt" className={`home-language ${locale === "pt" ? "" : "is-muted"}`} aria-label={copy.portugueseVersion}>PT</Link>
          <Link href={quizPath} className="home-nav-quiz">{copy.quizCta} <ArrowRight aria-hidden="true" /></Link>
        </div>
      </nav>

      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-hero-copy">
          <span className="home-kicker"><Sparkles aria-hidden="true" /> {copy.kicker}</span>
          <h1 id="home-title">{copy.title}</h1>
          <p className="home-lead">{copy.lead}</p>
          <div className="home-hero-actions">
            <Link href={quizPath} className="home-primary-cta">{copy.startQuiz} <ArrowRight aria-hidden="true" /></Link>
            <a className="home-secondary-cta" href="#how-it-works">{copy.seeSteps} <ArrowRight aria-hidden="true" /></a>
          </div>
          <div className="home-trust-points">
            {trustPoints.map(({ icon: Icon }, index) => (
              <span key={copy.trustPoints[index]}><Icon aria-hidden="true" /> {copy.trustPoints[index]}</span>
            ))}
          </div>
          <div className="home-kid-tip">
            <Gamepad2 aria-hidden="true" />
            <span><strong>{copy.kidTipStrong}</strong> {copy.kidTip}</span>
          </div>
        </div>
        <div className="home-hero-visual" aria-hidden="true">
          <div className="home-hero-orbit orbit-a" />
          <div className="home-hero-orbit orbit-b" />
          <span className="home-float-chip chip-quiz"><Trophy aria-hidden="true" /> {copy.quickQuestions}</span>
          <span className="home-float-chip chip-free"><Gift aria-hidden="true" /> {copy.freeChip}</span>
          <span className="home-bubble bubble-one" />
          <span className="home-bubble bubble-two" />
          <span className="home-bubble bubble-three" />
          <img src={assetUrl("blockwise-home-hero_59be1688.png")} alt="" />
        </div>
      </section>

      <section id="how-it-works" className="home-how-section" aria-labelledby="how-title">
        <div className="home-section-heading">
          <span className="home-section-label">{copy.howLabel}</span>
          <h2 id="how-title">{copy.howTitle}</h2>
          <p>{copy.howIntro}</p>
        </div>
        <div className="home-steps">
          {content.participationSteps.map((step, index) => {
            return (
              <article className="home-step-card" key={step.number}>
                <span className="home-step-number">{step.number}</span>
                <img className="home-step-art" src={stepArtwork[index]} alt="" />
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                <span className="home-step-action">{copy.stepActions[index]} <ArrowRight aria-hidden="true" /></span>
              </article>
            );
          })}
        </div>
      </section>

      <section className="home-sponsor-section" aria-labelledby="sponsor-title">
        <div className="home-sponsor-art" aria-hidden="true">
          <div className="home-sponsor-block block-one" />
          <div className="home-sponsor-block block-two" />
          <div className="home-sponsor-block block-three" />
          <Store />
          <Megaphone />
        </div>
        <div className="home-sponsor-copy">
          <span className="home-section-label">{copy.sponsorLabel}</span>
          <h2 id="sponsor-title">{copy.sponsorTitle}</h2>
          <p>{content.sponsorStatement}</p>
          <div className="home-reward-limit">
            <span><Gift aria-hidden="true" /> {copy.rewardRange}</span>
            <strong>{rewardRange} Robux</strong>
            <p>{content.rewardLimitStatement}</p>
          </div>
          <p className="home-safety-copy"><ShieldCheck aria-hidden="true" /> {content.safetyStatement}</p>
          <a className="home-sponsor-discord" href={communityLinks.data?.discordUrl} target="_blank" rel="noreferrer">
            <MessageCircleMore aria-hidden="true" />
            <span><strong>{copy.sponsorCtaTitle}</strong> {copy.sponsorCtaBody}</span>
            <ArrowRight aria-hidden="true" />
          </a>
        </div>
      </section>

      <section className="home-faq-section" aria-labelledby="faq-title">
        <div className="home-faq-heading">
          <CircleHelp aria-hidden="true" />
          <div>
            <span className="home-section-label">{copy.faqLabel}</span>
            <h2 id="faq-title">{copy.faqTitle}</h2>
          </div>
        </div>
        <div className="home-faq-list">
          {copy.faq.map(([question, answer]) => <article key={question}><h3>{question}</h3><p>{answer}</p></article>)}
        </div>
      </section>

      <section className="home-final-cta" aria-labelledby="ready-title">
        <div>
          <span className="home-kicker"><HeartHandshake aria-hidden="true" /> {copy.finalLabel}</span>
          <h2 id="ready-title">{copy.finalTitle}</h2>
        </div>
        <Link href={quizPath} className="home-primary-cta">{copy.finalCta} <ArrowRight aria-hidden="true" /></Link>
      </section>

      <footer className="home-footer">
        <span>{copy.footerBrand}</span>
        <span>{copy.footer}</span>
      </footer>
    </main>
  );
}
