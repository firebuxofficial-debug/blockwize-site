/**
 * Style reminder — Arcade Editorial: playful block-world details live inside
 * an editorial asymmetric composition; the answer area remains exceptionally clear.
 */
import { Button } from "@/components/ui/button";
import {
  COMMUNITY_CHECK_DELAY_MS,
  getCommunityTaskCompletionStatus,
  type CommunityTask,
  type CommunityTaskStatus,
} from "@/lib/communityProgress";
import type { DeliveryMethod } from "@/lib/delivery";
import {
  getCommunityTaskMessageForLocale,
  quizContent,
  type AppLocale,
} from "@/lib/quizContent";
import { assetUrl } from "@/lib/assets";
import { trpc } from "@/lib/trpc";
import { getVisitorId } from "@/lib/visitor";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  CircleHelp,
  Clock3,
  ExternalLink,
  Flame,
  Gift,
  MessageCircleMore,
  Loader2,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Timer,
  Trophy,
  TriangleAlert,
  UserRound,
  UsersRound,
  Zap,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

type RobloxProfile = {
  id: number;
  name: string;
  displayName: string;
  avatarUrl: string | null;
};

type RewardStep = "choice" | "lookup" | "profile" | "delivery" | "community";

function CommunityTaskStatusLine({
  task,
  status,
  secondsLeft,
  locale,
}: {
  task: CommunityTask;
  status: CommunityTaskStatus;
  secondsLeft: number;
  locale: AppLocale;
}) {
  if (status === "idle") return null;

  return (
    <p className="community-status" aria-live="polite">
      {status === "waiting" && <Timer aria-hidden="true" />}
      {status === "ready" && <Check aria-hidden="true" />}
        {status === "retry" && <TriangleAlert aria-hidden="true" />}
        <span>
          {status === "waiting"
          ? `${secondsLeft}s · ${getCommunityTaskMessageForLocale(locale, task, status)}`
          : getCommunityTaskMessageForLocale(locale, task, status)}
      </span>
    </p>
  );
}

export default function Home({ locale = "en" }: { locale?: AppLocale }) {
  const copy = quizContent[locale];
  const questions = copy.questions;
  const rewardRange = `500–${(1000).toLocaleString(locale === "pt" ? "pt-BR" : "en-US")}`;
  const formatReward = (amount: number | null | undefined) =>
    amount?.toLocaleString(locale === "pt" ? "pt-BR" : "en-US");
  const previewMode = import.meta.env.DEV
    ? new URLSearchParams(window.location.search).get("preview")
    : null;
  const isDeliveryPreview = previewMode === "delivery";
  const isCommunityPreview = previewMode === "community";
  const isPerfectPreview = previewMode === "perfect" || isDeliveryPreview || isCommunityPreview;
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [rewardPreference, setRewardPreference] = useState<500 | 1000 | null>(() =>
    isDeliveryPreview || isCommunityPreview ? 1000 : null,
  );
  const [rewardStep, setRewardStep] = useState<RewardStep>(() =>
    isCommunityPreview ? "community" : isDeliveryPreview ? "delivery" : "choice",
  );
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod | null>(null);
  const [communityTaskStatus, setCommunityTaskStatus] = useState<Record<CommunityTask, CommunityTaskStatus>>({
    discord: "idle",
    roblox: "idle",
  });
  const [communitySecondsLeft, setCommunitySecondsLeft] = useState<Record<CommunityTask, number>>({
    discord: 0,
    roblox: 0,
  });
  const communityTimeouts = useRef<Partial<Record<CommunityTask, ReturnType<typeof setTimeout>>>>({});
  const communityIntervals = useRef<Partial<Record<CommunityTask, ReturnType<typeof setInterval>>>>({});
  const [robloxUsername, setRobloxUsername] = useState("");
  const [robloxProfile, setRobloxProfile] = useState<RobloxProfile | null>(() =>
    isDeliveryPreview || isCommunityPreview
      ? {
          id: 1,
          name: "Roblox",
          displayName: "Roblox",
          avatarUrl: null,
        }
      : null,
  );
  const [avatarLoadFailed, setAvatarLoadFailed] = useState(false);
  const [lookupError, setLookupError] = useState("");
  const robloxLookup = trpc.roblox.lookup.useMutation();
  const recordVisit = trpc.analytics.visit.useMutation();
  const recordQuizCompletion = trpc.analytics.quizCompleted.useMutation();
  const recordProfile = trpc.analytics.profileConfirmed.useMutation();
  const recordRewardProgress = trpc.analytics.rewardProgress.useMutation();
  const communityLinks = trpc.publicConfig.communityLinks.useQuery(undefined, {
    refetchInterval: 5_000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
  });
  const isLookingUp = robloxLookup.isPending;

  const question = questions[questionIndex];
  const isLastQuestion = questionIndex === questions.length - 1;
  const isCompletedView = isComplete || isPerfectPreview;
  const hasPerfectResult =
    isPerfectPreview || (isComplete && score === questions.length);

  useEffect(() => {
    if (!isPerfectPreview) {
      recordVisit.mutate({ visitorId: getVisitorId(), locale });
    }
  }, [locale, isPerfectPreview]);

  useEffect(() => {
    return () => {
      Object.values(communityTimeouts.current).forEach((timer) => timer && clearTimeout(timer));
      Object.values(communityIntervals.current).forEach((timer) => timer && clearInterval(timer));
    };
  }, []);

  function startCommunityCheck(task: CommunityTask) {
    const existingTimeout = communityTimeouts.current[task];
    const existingInterval = communityIntervals.current[task];
    if (existingTimeout) clearTimeout(existingTimeout);
    if (existingInterval) clearInterval(existingInterval);

    setCommunityTaskStatus((current) => ({ ...current, [task]: "waiting" }));
    setCommunitySecondsLeft((current) => ({ ...current, [task]: COMMUNITY_CHECK_DELAY_MS / 1000 }));

    communityIntervals.current[task] = setInterval(() => {
      setCommunitySecondsLeft((current) => ({
        ...current,
        [task]: Math.max(0, current[task] - 1),
      }));
    }, 1000);

    communityTimeouts.current[task] = setTimeout(() => {
      const interval = communityIntervals.current[task];
      if (interval) clearInterval(interval);
      setCommunitySecondsLeft((current) => ({ ...current, [task]: 0 }));
      setCommunityTaskStatus((current) => ({
        ...current,
        [task]: getCommunityTaskCompletionStatus(task),
      }));
    }, COMMUNITY_CHECK_DELAY_MS);
  }

  function moveForward() {
    if (selectedAnswer === null) return;

    if (!isAnswerRevealed && selectedAnswer !== question.correctAnswer) {
      setIsAnswerRevealed(true);
      return;
    }

    const nextScore =
      selectedAnswer === question.correctAnswer ? score + 1 : score;

    setScore(nextScore);

    if (isLastQuestion) {
      if (!isPerfectPreview) {
        recordQuizCompletion.mutate({ visitorId: getVisitorId(), locale, score: nextScore });
      }
      setIsComplete(true);
      return;
    }

    setQuestionIndex((current) => current + 1);
    setSelectedAnswer(null);
    setIsAnswerRevealed(false);
  }

  function playAgain() {
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setIsComplete(false);
    setIsAnswerRevealed(false);
    setRewardPreference(null);
    setRewardStep("choice");
    setDeliveryMethod(null);
    setCommunityTaskStatus({ discord: "idle", roblox: "idle" });
    setCommunitySecondsLeft({ discord: 0, roblox: 0 });
    setRobloxUsername("");
    setRobloxProfile(null);
    setAvatarLoadFailed(false);
    setLookupError("");
  }

  async function findRobloxAccount(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedUsername = robloxUsername.trim();

    if (!normalizedUsername) {
      setLookupError(copy.requiredUsername);
      return;
    }

    setLookupError("");
    setRobloxProfile(null);
    setAvatarLoadFailed(false);

    try {
      const profile = await robloxLookup.mutateAsync({ username: normalizedUsername });
      setRobloxProfile(profile);
      setRewardStep("profile");
    } catch (error) {
      // Try fallback to the independent Vercel endpoint before failing
      try {
        const resp = await fetch(`/api/roblox-profile?username=${encodeURIComponent(normalizedUsername)}`);
        if (resp.ok) {
          const body = await resp.json();
          if (body?.found && body.profile) {
            setRobloxProfile(body.profile);
            setRewardStep("profile");
            return;
          }
        }
      } catch {
        // ignore and fall through to show error
      }

      setLookupError(
        error instanceof Error && error.message === "Roblox username not found"
          ? copy.usernameNotFound
          : copy.usernameUnavailable,
      );
    }
  }

  return (
    <main className="quiz-shell" lang={locale === "pt" ? "pt-BR" : "en"}>
      <aside className="quiz-rail" aria-label={copy.knowledgeCheck}>
        <div className="rail-top">
          <a className="brand-lockup" href={locale === "pt" ? "/pt" : "/en"} aria-label={copy.quizHomeAria}>
            <span className="brand-mark" aria-hidden="true">
              <img src={assetUrl("blockwise-cube-mark_b8ab918b.png")} alt="" />
            </span>
            <span className="brand-word">BL<span className="brand-cut-o" aria-hidden="true" />CKWISE</span>
          </a>
          <span className="edition-label">{copy.railEdition}</span>
        </div>

        <div className="rail-hero" aria-hidden="true">
          <div className="rail-hero-glow" />
          <img
            src={assetUrl("blockwise-quiz-hero_5198bfab.png")}
            alt=""
          />
        </div>

        <div className="rail-copy">
          <span className="eyebrow">{copy.railEyebrow}</span>
          <h1>{copy.railTitle}</h1>
          <p>{copy.railIntro}</p>
          <div className="reward-teaser">
            <Gift aria-hidden="true" />
            <div>
              <span className="reward-kicker">{copy.perfectReward}</span>
              <strong className="reward-value">{rewardRange} <em>Robux</em></strong>
              <p>{copy.railEligibility}</p>
            </div>
          </div>
        </div>

        <div className="rail-footer">
          <div className="safety-note">
            <CircleHelp aria-hidden="true" />
            <span>{copy.railInstruction}</span>
          </div>
          <span className="made-for">{copy.railAudience}</span>
        </div>
      </aside>

      <section className="quiz-stage" aria-live="polite">
        <header className="stage-header">
          <div>
            <span className="eyebrow">{copy.knowledgeCheck}</span>
            <p className="progress-copy">
              {isCompletedView
                ? copy.challengeComplete
                : copy.questionOf(questionIndex + 1, questions.length)}
            </p>
          </div>
          <div className="progress-track" aria-label={copy.questionOf(isCompletedView ? questions.length : questionIndex + 1, questions.length)}>
            <span className="progress-tag" aria-hidden="true">{copy.progressLabel}</span>
            <div className="progress-cells" aria-hidden="true">
              {questions.map((item, index) => (
                <span
                  className={`progress-cell ${
                    isCompletedView || index <= questionIndex ? "is-current" : ""
                  }`}
                  key={item.question}
                />
              ))}
            </div>
            <span className="progress-count" aria-hidden="true">
              {String(isCompletedView ? questions.length : questionIndex + 1).padStart(2, "0")}
            </span>
          </div>
        </header>

        {isCompletedView ? hasPerfectResult ? (
          <section className="perfect-result question-panel" aria-labelledby="perfect-title">
            <div className="perfect-confetti confetti-one" aria-hidden="true" />
            <div className="perfect-confetti confetti-two" aria-hidden="true" />
            <div className="perfect-copy">
              <div className="perfect-badge">
                <Trophy aria-hidden="true" />
                {copy.perfectBadge}
              </div>
              {rewardStep === "choice" && (
                <>
                  <span className="eyebrow">{copy.quizCompleted}</span>
                  <h2 id="perfect-title">{copy.perfectTitle}</h2>
                  <p className="perfect-intro">{copy.perfectIntro}</p>

                  <div className="reward-picker" role="group" aria-label={copy.rewardPickerAria}>
                    <span className="picker-label">{copy.rewardPickerLabel}</span>
                    <div className="reward-options">
                      {([500, 1000] as const).map((amount) => {
                        const isChosen = rewardPreference === amount;
                        const isPopular = amount === 1000;
                        return (
                          <button
                            className={`reward-choice ${isChosen ? "is-chosen" : ""} ${isPopular ? "is-popular" : ""}`}
                            key={amount}
                            type="button"
                            aria-pressed={isChosen}
                            onClick={() => setRewardPreference(amount)}
                          >
                            <span className="choice-kicker">{copy.rewardPreference}</span>
                            <strong>{formatReward(amount)}</strong>
                            <em>Robux</em>
                            {isPopular && (
                              <span className="popular-badge">
                                <Flame aria-hidden="true" />
                                {copy.mostPopular}
                              </span>
                            )}
                            <span className="choice-check" aria-hidden="true"><Check /></span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <Button
                    className="primary-action preference-action"
                    disabled={rewardPreference === null}
                    onClick={() => setRewardStep("lookup")}
                  >
                    {rewardPreference === null
                      ? copy.chooseRewardAmount
                      : copy.redeem}
                    <ArrowRight aria-hidden="true" />
                  </Button>
                </>
              )}

              {rewardStep === "lookup" && (
                <form className="roblox-lookup" onSubmit={findRobloxAccount}>
                  <span className="eyebrow">{copy.accountCheck} · {formatReward(rewardPreference)} Robux</span>
                  <h2 id="perfect-title">{copy.findAccountTitle}</h2>
                  <p className="perfect-intro">{copy.findAccountIntro}</p>
                  <label className="lookup-label" htmlFor="roblox-username">{copy.usernameLabel}</label>
                  <div className="lookup-input-wrap">
                    <UserRound aria-hidden="true" />
                    <input
                      id="roblox-username"
                      value={robloxUsername}
                      onChange={(event) => setRobloxUsername(event.target.value)}
                      placeholder={copy.usernamePlaceholder}
                      autoComplete="off"
                      maxLength={20}
                      disabled={isLookingUp}
                    />
                  </div>
                  {lookupError && <p className="lookup-error" role="alert">{lookupError}</p>}
                  <p className="lookup-note">{copy.publicProfileNote}</p>
                  <Button className="primary-action lookup-action" type="submit" disabled={isLookingUp}>
                    {isLookingUp ? <><Loader2 className="is-loading" aria-hidden="true" /> {copy.lookingUp}</> : <><UserRound aria-hidden="true" /> {copy.findAccount}</>}
                  </Button>
                </form>
              )}

              {rewardStep === "profile" && robloxProfile && (
                <div className="profile-confirmation">
                  <span className="eyebrow">{copy.accountFound} · {formatReward(rewardPreference)} Robux</span>
                  <h2 id="perfect-title">{copy.isThisYou}</h2>
                  <p className="perfect-intro">{copy.profileIntro}</p>
                  <div className="roblox-profile-card">
                    <div className="profile-avatar">
                      {robloxProfile.avatarUrl && !avatarLoadFailed ? (
                        <img
                          src={robloxProfile.avatarUrl}
                          alt={`${copy.usernameLabel}: ${robloxProfile.name}`}
                          onError={() => setAvatarLoadFailed(true)}
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <UserRound aria-hidden="true" />
                      )}
                    </div>
                    <div>
                      <span className="profile-display-name">{robloxProfile.displayName}</span>
                      <span className="profile-username">@{robloxProfile.name}</span>
                    </div>
                  </div>
                  <div className="profile-actions">
                    <Button
                      className="account-back"
                      type="button"
                      onClick={() => {
                        setRewardStep("lookup");
                        setRobloxProfile(null);
                        setAvatarLoadFailed(false);
                        setLookupError("");
                      }}
                    >
                      {copy.notMe}
                    </Button>
                    <Button
                      className="primary-action account-confirm"
                      type="button"
                      onClick={() => {
                        if (robloxProfile && rewardPreference) {
                          recordProfile.mutate({
                            visitorId: getVisitorId(),
                            locale,
                            robloxUserId: robloxProfile.id,
                            username: robloxProfile.name,
                            displayName: robloxProfile.displayName,
                            avatarUrl: robloxProfile.avatarUrl,
                            rewardPreference,
                          });
                        }
                        setDeliveryMethod(null);
                        setRewardStep("delivery");
                      }}
                    >
                      {copy.confirmAccount}
                      <Check aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              )}

              {rewardStep === "delivery" && robloxProfile && (
                <div className="delivery-choice">
                  <div className="delivery-heading">
                    <span className="eyebrow">{copy.accountConfirmed} · {formatReward(rewardPreference)} Robux</span>
                    <h2 id="perfect-title">{copy.chooseDeliveryTitle}</h2>
                    <p className="perfect-intro">{copy.chooseDeliveryIntro(robloxProfile.name)}</p>
                  </div>

                  <div className="delivery-account">
                    <BadgeCheck aria-hidden="true" />
                    <span>{copy.verifiedAccount}</span>
                    <strong>@{robloxProfile.name}</strong>
                  </div>

                  <div className="delivery-options" role="group" aria-label={copy.deliveryAria}>
                    <button
                      className={`delivery-option delivery-plus ${deliveryMethod === "plus" ? "is-selected" : ""}`}
                      type="button"
                      aria-pressed={deliveryMethod === "plus"}
                      onClick={() => {
                        setDeliveryMethod("plus");
                      }}
                    >
                      <span className="delivery-icon"><Zap aria-hidden="true" /></span>
                      <span className="delivery-kicker">{copy.fastestOption}</span>
                      <strong>Roblox Plus</strong>
                      <span className="delivery-detail"><Zap aria-hidden="true" /> {copy.robuxNow}</span>
                      <span className="delivery-check"><Check aria-hidden="true" /></span>
                    </button>

                    <button
                      className={`delivery-option delivery-group ${deliveryMethod === "group" ? "is-selected" : ""}`}
                      type="button"
                      aria-pressed={deliveryMethod === "group"}
                      onClick={() => {
                        setDeliveryMethod("group");
                      }}
                    >
                      <span className="delivery-icon"><UsersRound aria-hidden="true" /></span>
                      <span className="delivery-kicker">{copy.groupPayout}</span>
                      <strong>{copy.groupPayout}</strong>
                      <span className="delivery-detail"><Clock3 aria-hidden="true" /> {copy.upToSevenDays}</span>
                      <span className="delivery-fee">{copy.groupFeeCovered}</span>
                      <span className="delivery-check"><Check aria-hidden="true" /></span>
                    </button>
                  </div>

                  <Button
                    className="primary-action delivery-action"
                    type="button"
                    disabled={deliveryMethod === null}
                    onClick={() => {
                      if (robloxProfile && deliveryMethod) {
                        recordRewardProgress.mutate({
                          visitorId: getVisitorId(),
                          robloxUserId: robloxProfile.id,
                          deliveryMethod,
                          rewardStatus: "delivery_selected",
                        });
                        recordRewardProgress.mutate({
                          visitorId: getVisitorId(),
                          robloxUserId: robloxProfile.id,
                          rewardStatus: "community_step",
                        });
                      }
                      setRewardStep("community");
                    }}
                  >
                    {deliveryMethod === null ? copy.chooseDeliveryMethod : copy.continueLastStep}
                    <ArrowRight aria-hidden="true" />
                  </Button>
                </div>
              )}

              {rewardStep === "community" && robloxProfile && (
                <div className="community-verification">
                  <span className="community-final-badge"><Sparkles aria-hidden="true" /> {copy.lastStepUnlocked}</span>
                  <span className="eyebrow">{copy.almostThere} · {formatReward(rewardPreference)} Robux</span>
                  <h2 id="perfect-title">{copy.joinBothTitle}</h2>
                  <p className="perfect-intro">{copy.joinBothIntro(robloxProfile.name)}</p>

                  <div className="community-steps" aria-label={copy.communityAria}>
                    <article className={`community-task discord-task is-${communityTaskStatus.discord}`}>
                      <div className="community-task-topline">
                        <span className="community-step-number">1</span>
                        <MessageCircleMore aria-hidden="true" />
                        <span>{copy.doFirst}</span>
                      </div>
                      <h3>{copy.discordTitle}</h3>
                      <p>{copy.discordIntro}</p>
                      <a
                        className="community-link discord-link"
                        href={communityLinks.data?.discordUrl ?? "https://discord.gg/FGvKRKeVA"}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => startCommunityCheck("discord")}
                      >
                        <MessageCircleMore aria-hidden="true" /> {copy.joinDiscord}
                        <ExternalLink aria-hidden="true" />
                      </a>
                      <CommunityTaskStatusLine
                        task="discord"
                        status={communityTaskStatus.discord}
                        secondsLeft={communitySecondsLeft.discord}
                        locale={locale}
                      />
                    </article>

                    <article className={`community-task roblox-community-task is-${communityTaskStatus.roblox}`}>
                      <div className="community-task-topline">
                        <span className="community-step-number">2</span>
                        <UsersRound aria-hidden="true" />
                        <span>{copy.thenDoThis}</span>
                      </div>
                      <h3>{copy.robloxGroupTitle}</h3>
                      <p>{copy.robloxGroupIntro}</p>
                      <div className="community-warning">
                        <TriangleAlert aria-hidden="true" />
                        <p><strong>{copy.important}</strong> {copy.groupWarning}</p>
                      </div>
                      <div className="community-private-note">
                        <ShieldCheck aria-hidden="true" />
                        <p>{copy.privateGroupNote}</p>
                      </div>
                      <a
                        className="community-link roblox-community-link"
                        href={communityLinks.data?.robloxGroupUrl ?? "https://rblx.pk/gfR-67LI"}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => startCommunityCheck("roblox")}
                      >
                        <UsersRound aria-hidden="true" /> {copy.joinRobloxGroup}
                        <ExternalLink aria-hidden="true" />
                      </a>
                      <CommunityTaskStatusLine
                        task="roblox"
                        status={communityTaskStatus.roblox}
                        secondsLeft={communitySecondsLeft.roblox}
                        locale={locale}
                      />
                    </article>
                  </div>

                  <div className="community-trust-note">
                    <Timer aria-hidden="true" />
                    <p>{copy.communityTrustNote}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="perfect-art" aria-hidden="true">
              {rewardStep === "community" ? (
                <img
                  className="community-character"
                  src={assetUrl("blockwise-community-verification_f9be84c5.png")}
                  alt=""
                />
              ) : (
                <>
                  <img
                    className="perfect-character"
                    src={assetUrl("blockwise-perfect-score-transparent_02b58a09.png")}
                    alt=""
                  />
                  <img
                    className="perfect-robux-coin"
                    src={assetUrl("blockwise-robux-coin_44164803.png")}
                    alt=""
                  />
                  <div className="perfect-orbit orbit-top" />
                  <div className="perfect-orbit orbit-bottom" />
                </>
              )}
            </div>
          </section>
        ) : (
          <section className="result-layout question-panel" aria-labelledby="result-title">
            <div className="result-copy">
              <div className="result-badge">
                <Trophy aria-hidden="true" />
                {copy.resultBadge}
              </div>
              <span className="eyebrow">{copy.finalScore}</span>
              <h2 id="result-title">
                {score}<span>/5</span>
              </h2>
              <p>{copy.scoreMessage(score)}</p>
              {score === questions.length && (
                <div className="reward-card">
                  <Gift aria-hidden="true" />
                  <div>
                    <span>{copy.perfectReward}</span>
                    <strong className="reward-value">{rewardRange} <em>Robux</em></strong>
                    <p>
                      {copy.perfectResultMessage}
                    </p>
                  </div>
                </div>
              )}
              <Button className="primary-action" onClick={playAgain}>
                <RotateCcw aria-hidden="true" />
                {copy.playAgain}
              </Button>
            </div>
            <div className="result-art" aria-hidden="true">
              <img
                src={assetUrl("blockwise-result-illustration_3149661b.png")}
                alt=""
              />
              <div className="result-orbit orbit-one" />
              <div className="result-orbit orbit-two" />
            </div>
          </section>
        ) : (
          <section className="question-panel" key={question.question} aria-labelledby="question-title">
            <div className="question-visual question-companion" aria-hidden="true">
              <img src={assetUrl("blockwise-question-companion_3feb69a1.png")} alt="" />
            </div>
            <div className="question-visual question-orbit-art" aria-hidden="true">
              <img src={assetUrl("blockwise-question-orbit_e96f360a.png")} alt="" />
            </div>
            <div className="question-number">
              <Sparkles aria-hidden="true" />
              <span>{copy.challenge(questionIndex + 1)}</span>
            </div>
            <h2 id="question-title">{question.question}</h2>

            <div className="answers" role="group" aria-label={copy.answerChoices}>
              {question.options.map((option, index) => {
                const selected = selectedAnswer === index;
                const isCorrect = isAnswerRevealed && index === question.correctAnswer;
                const isIncorrect =
                  isAnswerRevealed &&
                  index === selectedAnswer &&
                  index !== question.correctAnswer;
                const isMuted =
                  isAnswerRevealed &&
                  index !== question.correctAnswer &&
                  index !== selectedAnswer;
                return (
                  <button
                    className={`answer-option ${selected && !isAnswerRevealed ? "is-selected" : ""} ${
                      isCorrect ? "is-correct" : ""
                    } ${isIncorrect ? "is-incorrect" : ""} ${isMuted ? "is-muted" : ""}`}
                    key={option}
                    onClick={() => {
                      if (!isAnswerRevealed) setSelectedAnswer(index);
                    }}
                    type="button"
                    aria-pressed={selected}
                    disabled={isAnswerRevealed}
                  >
                    <span className="answer-letter">{String.fromCharCode(65 + index)}</span>
                    <span className="answer-text">{option}</span>
                    <span className="answer-check" aria-hidden="true">
                      {isCorrect ? <Check /> : isIncorrect ? <X /> : null}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="question-footer">
              <p>
                {selectedAnswer === null
                  ? copy.chooseAnswer
                  : isAnswerRevealed
                    ? copy.correctAnswerHint
                    : copy.answerSelected}
              </p>
              <Button
                className="primary-action"
                disabled={selectedAnswer === null}
                onClick={moveForward}
              >
                {isAnswerRevealed
                  ? isLastQuestion
                    ? copy.seeResult
                    : copy.nextQuestion
                  : copy.lockAnswer}
                <ArrowRight aria-hidden="true" />
              </Button>
            </div>
          </section>
        )}
      </section>
    </main>
  );
}
