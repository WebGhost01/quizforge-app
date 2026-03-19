import React from "react";
import { Sidebar } from "./Sidebar";
import { motion } from "framer-motion";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 flex flex-col max-w-full overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />
        
        <div className="flex-1 overflow-auto w-full relative z-10 p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-7xl mx-auto w-full"
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
