import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { Layout } from "@/components/Layout";
import QuizLibrary from "@/pages/quiz/QuizLibrary";
import QuizDetail from "@/pages/quiz/QuizDetail";
import TakeQuiz from "@/pages/quiz/TakeQuiz";
import RecipeLibrary from "@/pages/recipe/RecipeLibrary";
import RecipeDetail from "@/pages/recipe/RecipeDetail";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/">
          <Redirect to="/quizzes" />
        </Route>
        
        {/* QuizForge App Routes */}
        <Route path="/quizzes" component={QuizLibrary} />
        <Route path="/quizzes/:id" component={QuizDetail} />
        <Route path="/quizzes/:id/take" component={TakeQuiz} />
        <Route path="/quizzes/history" component={() => <div className="p-8 text-center text-muted-foreground">History view is integrated into individual Quiz Details pages.</div>} />

        {/* RecipeBox App Routes */}
        <Route path="/recipes" component={RecipeLibrary} />
        <Route path="/recipes/:id" component={RecipeDetail} />

        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
