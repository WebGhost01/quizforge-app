import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { BrainCircuit, ChefHat, LayoutDashboard, Settings, Trophy } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export function Sidebar() {
  const [location] = useLocation();

  const links = [
    { name: "Quiz Platform", href: "/quizzes", icon: BrainCircuit, color: "text-primary" },
    { name: "Quiz History", href: "/quizzes/history", icon: Trophy, color: "text-accent" },
    { name: "Recipe Manager", href: "/recipes", icon: ChefHat, color: "text-orange-500" },
  ];

  return (
    <div className="w-64 h-screen shrink-0 glass-panel border-r flex flex-col fixed md:relative z-40 hidden md:flex">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-lg shadow-primary/25">
          <BrainCircuit className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-display font-bold text-foreground">Forge<span className="text-primary">Hub</span></h1>
      </div>

      <div className="px-4 py-2">
        <p className="px-4 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Apps</p>
        <div className="space-y-1">
          {links.map((link) => {
            const isActive = location === link.href || (link.href !== '/' && location.startsWith(link.href) && link.name !== 'Quiz History');
            // Slight hack for active state logic above just for visual demo purposes
            const reallyActive = location === link.href || (location.startsWith(link.href) && link.href.length > 1);
            
            return (
              <Link key={link.name} href={link.href} className="block relative">
                <div
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative z-10 font-medium",
                    reallyActive ? "text-primary" : "text-foreground hover:bg-muted"
                  )}
                >
                  <link.icon className={cn("w-5 h-5", reallyActive ? link.color : "text-muted-foreground")} />
                  {link.name}
                </div>
                {reallyActive && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute inset-0 bg-primary/10 rounded-xl z-0"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
      
      <div className="mt-auto p-6">
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-4 rounded-2xl border border-primary/20">
          <h4 className="font-bold text-sm text-foreground mb-1">Upgrade to Pro</h4>
          <p className="text-xs text-muted-foreground mb-3">Get unlimited quizzes and recipes.</p>
          <button className="w-full py-2 bg-foreground text-background text-sm font-bold rounded-lg hover:bg-primary transition-colors">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}
