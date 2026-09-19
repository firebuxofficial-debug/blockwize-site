/**
 * Style reminder — Arcade Editorial: an asymmetric, high-contrast quiz shell
 * with calm dark framing and a bright, focused question stage.
 */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Redirect, Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Landing from "./pages/Landing";
import AdminPanel from "./pages/AdminPanel";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path="/">
        <Redirect to="/home/en" />
      </Route>
      <Route path="/home/en"><Landing locale="en" /></Route>
      <Route path="/home/pt"><Landing locale="pt" /></Route>
      <Route path="/en"><Home locale="en" /></Route>
      <Route path="/pt"><Home locale="pt" /></Route>
      <Route path="/admin/painel"><AdminPanel /></Route>
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
