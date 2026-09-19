import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import {
  Activity,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  CircleCheckBig,
  Eye,
  KeyRound,
  LayoutDashboard,
  Link2,
  LockKeyhole,
  LogOut,
  RefreshCw,
  Save,
  ShieldCheck,
  Trophy,
  UsersRound,
} from "lucide-react";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";

type AdminView = "overview" | "users" | "links";
type CommunityLinkForm = { discordUrl: string; robloxGroupUrl: string };

const LIVE_REFRESH_MS = 5_000;

function formatDate(value: Date | string) {
  return new Date(value).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function MetricCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Eye;
  label: string;
  value: number;
  tone: "blue" | "violet" | "green" | "orange";
}) {
  return (
    <article className={`admin-metric-card admin-metric-${tone}`}>
      <div className="admin-metric-icon"><Icon aria-hidden="true" /></div>
      <div>
        <p>{label}</p>
        <strong>{value.toLocaleString("pt-BR")}</strong>
      </div>
    </article>
  );
}

function ProfileAvatar({ avatarUrl, username }: { avatarUrl: string | null; username: string }) {
  const [imageFailed, setImageFailed] = useState(false);
  const canShowImage = Boolean(avatarUrl) && !imageFailed;

  return canShowImage ? (
    <img src={avatarUrl ?? ""} alt="" referrerPolicy="no-referrer" onError={() => setImageFailed(true)} />
  ) : (
    <span aria-hidden="true">{username.slice(0, 1).toUpperCase()}</span>
  );
}

export default function AdminPanel() {
  const utils = trpc.useUtils();
  const [view, setView] = useState<AdminView>("overview");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [linkForm, setLinkForm] = useState<CommunityLinkForm>({ discordUrl: "", robloxGroupUrl: "" });
  const [linkNotice, setLinkNotice] = useState("");
  const session = trpc.admin.session.useQuery(undefined, { retry: false });
  const authenticated = session.data?.authenticated === true;
  const liveQueryOptions = {
    enabled: authenticated,
    retry: false,
    refetchInterval: LIVE_REFRESH_MS,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
  } as const;
  const metrics = trpc.adminDashboard.metrics.useQuery(undefined, liveQueryOptions);
  const profiles = trpc.adminDashboard.robloxProfiles.useQuery(undefined, liveQueryOptions);
  const communityLinks = trpc.adminDashboard.communityLinks.useQuery(undefined, liveQueryOptions);
  const login = trpc.admin.login.useMutation({
    onSuccess: async () => {
      setFormError("");
      setPassword("");
      await session.refetch();
    },
    onError: () => setFormError("E-mail ou senha inválidos. Tente novamente."),
  });
  const logout = trpc.admin.logout.useMutation({
    onSuccess: async () => {
      setView("overview");
      await session.refetch();
    },
  });
  const saveCommunityLinks = trpc.adminDashboard.updateCommunityLinks.useMutation({
    onSuccess: async () => {
      setLinkNotice("Links publicados. As telas públicas receberão a atualização em instantes.");
      await Promise.all([
        utils.adminDashboard.communityLinks.invalidate(),
        utils.publicConfig.communityLinks.invalidate(),
      ]);
    },
    onError: () => setLinkNotice("Não foi possível salvar os links. Revise os endereços e tente novamente."),
  });

  useEffect(() => {
    if (communityLinks.data) {
      setLinkForm(communityLinks.data);
    }
  }, [communityLinks.data?.discordUrl, communityLinks.data?.robloxGroupUrl]);

  function submitLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    login.mutate({ email: email.trim(), password });
  }

  function submitLinks(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLinkNotice("");
    saveCommunityLinks.mutate(linkForm);
  }

  if (session.isLoading) {
    return <main className="admin-auth-page"><div className="admin-pulse-loader" aria-label="Carregando painel" /></main>;
  }

  if (!authenticated) {
    return (
      <main className="admin-auth-page">
        <section className="admin-login-shell" aria-labelledby="admin-login-title">
          <div className="admin-login-art" aria-hidden="true">
            <div className="admin-login-gateway-mark"><ShieldCheck /></div>
            <span className="admin-login-route route-one" />
            <span className="admin-login-route route-two" />
            <span className="admin-orbit admin-orbit-one" />
            <span className="admin-orbit admin-orbit-two" />
            <span className="admin-grid-dot dot-one" />
            <span className="admin-grid-dot dot-two" />
            <div className="admin-login-art-caption"><span>BLOCKWISE OPS</span><strong>Ambiente de controle</strong></div>
          </div>
          <form className="admin-login-card" onSubmit={submitLogin}>
            <span className="admin-eyebrow"><LockKeyhole aria-hidden="true" /> Área restrita</span>
            <h1 id="admin-login-title">Controle Blockwise</h1>
            <p>Acesse as métricas reais, perfis confirmados e os links da comunidade.</p>

            <label htmlFor="admin-email">E-mail administrativo</label>
            <Input id="admin-email" type="email" autoComplete="username" value={email} onChange={event => setEmail(event.target.value)} placeholder="seu@email.com" required />
            <label htmlFor="admin-password">Senha</label>
            <Input id="admin-password" type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} placeholder="••••••••••••" required />
            {formError && <p className="admin-login-error" role="alert">{formError}</p>}
            <Button className="admin-login-button" type="submit" disabled={login.isPending}>
              {login.isPending ? <><RefreshCw className="is-loading" /> Verificando acesso</> : <><KeyRound /> Entrar no painel <ArrowRight /></>}
            </Button>
            <p className="admin-login-security"><LockKeyhole aria-hidden="true" /> Sessão protegida e exclusiva para administração.</p>
          </form>
        </section>
      </main>
    );
  }

  const currentMetrics = metrics.data ?? {
    totalVisits: 0,
    uniqueVisitors: 0,
    quizCompletions: 0,
    perfectScores: 0,
    robloxProfiles: 0,
  };
  const conversion = currentMetrics.uniqueVisitors
    ? Math.round((currentMetrics.quizCompletions / currentMetrics.uniqueVisitors) * 100)
    : 0;
  const perfectRate = currentMetrics.quizCompletions
    ? Math.round((currentMetrics.perfectScores / currentMetrics.quizCompletions) * 100)
    : 0;
  const pageTitle = view === "overview" ? "Visão geral" : view === "users" ? "Usuários Roblox" : "Links da comunidade";
  const latestSync = Math.max(metrics.dataUpdatedAt, profiles.dataUpdatedAt, communityLinks.dataUpdatedAt);

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand"><span className="admin-brand-icon"><BarChart3 /></span><span>BLOCKWISE <em>OPS</em></span></div>
        <p className="admin-sidebar-label">Operação</p>
        <nav aria-label="Navegação do painel">
          <button className={view === "overview" ? "is-active" : ""} onClick={() => setView("overview")}><LayoutDashboard /> Visão geral</button>
          <button className={view === "users" ? "is-active" : ""} onClick={() => setView("users")}><UsersRound /> Usuários Roblox <span>{currentMetrics.robloxProfiles}</span></button>
          <button className={view === "links" ? "is-active" : ""} onClick={() => setView("links")}><Link2 /> Links</button>
        </nav>
        <div className="admin-sidebar-status"><span /> Sincronização automática</div>
        <Button className="admin-logout" variant="ghost" onClick={() => logout.mutate()} disabled={logout.isPending}><LogOut /> Sair do painel</Button>
      </aside>

      <section className="admin-content">
        <header className="admin-header">
          <div>
            <span className="admin-eyebrow">Painel administrativo</span>
            <h1>{pageTitle}</h1>
          </div>
          <div className="admin-live-indicator" aria-live="polite"><span /><div><strong>Dados em tempo real</strong><small>{latestSync ? `Atualizado ${formatDate(new Date(latestSync))}` : "Aguardando primeira leitura"}</small></div></div>
        </header>

        {view === "overview" && (
          <>
            <div className="admin-metrics-grid">
              <MetricCard icon={Eye} label="Visitas no site" value={currentMetrics.totalVisits} tone="blue" />
              <MetricCard icon={UsersRound} label="Pessoas únicas" value={currentMetrics.uniqueVisitors} tone="violet" />
              <MetricCard icon={CheckCircle2} label="Quiz concluídos" value={currentMetrics.quizCompletions} tone="green" />
              <MetricCard icon={Trophy} label="Pontuação 5/5" value={currentMetrics.perfectScores} tone="orange" />
            </div>
            <div className="admin-insight-grid">
              <article className="admin-chart-card">
                <div className="admin-card-heading"><div><span>Desempenho do funil</span><h2>Participação no quiz</h2></div><Activity /></div>
                <div className="admin-funnel">
                  <div><span>Visitantes únicos</span><strong>{currentMetrics.uniqueVisitors.toLocaleString("pt-BR")}</strong><i style={{ width: "100%" }} /></div>
                  <div><span>Quiz concluídos</span><strong>{currentMetrics.quizCompletions.toLocaleString("pt-BR")}</strong><i style={{ width: `${Math.max(conversion, currentMetrics.quizCompletions ? 8 : 0)}%` }} /></div>
                  <div><span>Pontuação perfeita</span><strong>{currentMetrics.perfectScores.toLocaleString("pt-BR")}</strong><i style={{ width: `${Math.max(perfectRate, currentMetrics.perfectScores ? 8 : 0)}%` }} /></div>
                </div>
              </article>
              <article className="admin-highlight-card">
                <span className="admin-eyebrow">Solicitações</span>
                <strong>{currentMetrics.robloxProfiles.toLocaleString("pt-BR")}</strong>
                <h2>contas Roblox confirmadas</h2>
                <p>Os perfis confirmados aparecem na categoria Usuários com dados públicos e etapa atual da recompensa.</p>
                <button onClick={() => setView("users")}>Ver usuários <ArrowRight /></button>
              </article>
            </div>
          </>
        )}

        {view === "users" && (
          <section className="admin-users-card">
            <div className="admin-card-heading"><div><span>Contas confirmadas</span><h2>Usuários e recompensas</h2></div><UsersRound /></div>
            {profiles.isLoading ? <div className="admin-empty-state"><RefreshCw className="is-loading" /> Carregando perfis confirmados</div> : profiles.data?.length ? (
              <div className="admin-user-table-wrap"><table><thead><tr><th>Jogador</th><th>Idioma</th><th>Preferência</th><th>Entrega</th><th>Status</th><th>Atualizado</th></tr></thead><tbody>
                {profiles.data.map(profile => <tr key={profile.id}><td><span className="admin-user-cell"><ProfileAvatar avatarUrl={profile.avatarUrl} username={profile.username} /><b>{profile.displayName}<small>@{profile.username}</small></b></span></td><td><span className="admin-locale">{profile.locale.toUpperCase()}</span></td><td>{profile.rewardPreference.toLocaleString(profile.locale === "pt" ? "pt-BR" : "en-US")} Robux</td><td>{profile.deliveryMethod === "plus" ? "Roblox Plus" : profile.deliveryMethod === "group" ? "Grupo" : "A escolher"}</td><td><span className={`admin-status status-${profile.rewardStatus}`}>{profile.rewardStatus === "community_step" ? "Comunidade" : profile.rewardStatus === "delivery_selected" ? "Entrega" : "Perfil confirmado"}</span></td><td>{formatDate(profile.updatedAt)}</td></tr>)}
              </tbody></table></div>
            ) : <div className="admin-empty-state"><UsersRound /> Nenhum perfil Roblox confirmado ainda. Os dados aparecerão aqui quando os jogadores concluírem o fluxo.</div>}
          </section>
        )}

        {view === "links" && (
          <section className="admin-links-card">
            <div className="admin-card-heading"><div><span>Configuração pública</span><h2>Destinos da comunidade</h2></div><Link2 /></div>
            <p className="admin-links-intro">Altere os destinos oficiais sem publicar uma nova versão. O quiz e a página inicial consultam esta configuração automaticamente.</p>
            <form className="admin-links-form" onSubmit={submitLinks}>
              <label htmlFor="discord-url">Convite do Discord</label>
              <Input id="discord-url" type="url" inputMode="url" placeholder="https://discord.gg/..." value={linkForm.discordUrl} onChange={event => setLinkForm(current => ({ ...current, discordUrl: event.target.value }))} required />
              <label htmlFor="roblox-group-url">Link do grupo Roblox</label>
              <Input id="roblox-group-url" type="url" inputMode="url" placeholder="https://rblx.pk/..." value={linkForm.robloxGroupUrl} onChange={event => setLinkForm(current => ({ ...current, robloxGroupUrl: event.target.value }))} required />
              <div className="admin-links-actions"><Button className="admin-links-save" type="submit" disabled={saveCommunityLinks.isPending || communityLinks.isLoading}>{saveCommunityLinks.isPending ? <><RefreshCw className="is-loading" /> Salvando</> : <><Save /> Salvar links</>}</Button>{linkNotice && <p className={saveCommunityLinks.isError ? "is-error" : "is-success"} role="status"><CircleCheckBig aria-hidden="true" /> {linkNotice}</p>}</div>
            </form>
            <div className="admin-links-footnote"><ShieldCheck aria-hidden="true" /> Apenas URLs HTTPS são aceitas para proteger os visitantes do Blockwise.</div>
          </section>
        )}
      </section>
    </main>
  );
}
