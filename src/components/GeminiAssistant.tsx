import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Send, Loader2, Bot, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Markdown from "react-markdown";

export default function GeminiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<{ role: 'user' | 'bot', text: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = message;
    setMessage("");
    setChat(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/property-advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });
      const data = await response.json();
      setChat(prev => [...prev, { role: 'bot', text: data.text }]);
    } catch (error) {
      setChat(prev => [...prev, { role: 'bot', text: "Sorry, I'm having trouble connecting right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl bg-slate-900 text-white hover:scale-110 active:scale-95 transition-all z-50 p-0 overflow-hidden"
      >
        <AnimatePresence mode="wait">
            {isOpen ? <X key="x" className="h-6 w-6" /> : <Bot key="bot" className="h-6 w-6" />}
        </AnimatePresence>
        <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-2 border-dashed border-blue-400/30 rounded-full"
        />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-[400px] max-w-[calc(100vw-48px)] z-50"
          >
            <Card className="rounded-[2.5rem] border-slate-200/60 shadow-2xl overflow-hidden h-[550px] flex flex-col">
                <CardHeader className="bg-slate-900 text-white p-6 relative">
                    <CardTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-blue-400" />
                        Urban AI Assistant
                    </CardTitle>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 italic">Expert Real Estate Advice</p>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden p-0 flex flex-col bg-slate-50/30">
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
                        {chat.length === 0 && (
                            <div className="text-center py-10">
                                <Bot className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                                <h4 className="text-sm font-black text-slate-900 uppercase">Ask me anything</h4>
                                <p className="text-xs text-slate-500 mt-2">"Best neighborhood in Lagos for expats?"<br />"Minimum rent in Abuja Maitama?"</p>
                            </div>
                        )}
                        {chat.map((msg, i) => (
                            <div key={i} className={cn(
                                "max-w-[85%] p-4 rounded-3xl text-sm font-medium",
                                msg.role === 'user' ? "bg-slate-100 text-slate-900 ml-auto rounded-tr-none" : "bg-white text-slate-700 shadow-sm border border-slate-100 rounded-tl-none markdown-body"
                            )}>
                                <Markdown>{msg.text}</Markdown>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="bg-white p-4 rounded-3xl rounded-tl-none shadow-sm border border-slate-100 w-fit flex gap-2 items-center">
                                <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Counseling...</span>
                            </div>
                        )}
                    </div>
                    <div className="p-4 bg-white border-t">
                        <form onSubmit={handleSend} className="flex gap-2 bg-slate-100 rounded-full p-1 border border-slate-200">
                            <Input 
                                placeholder="Type your property question..." 
                                className="flex-1 border-none bg-transparent shadow-none focus-visible:ring-0 text-sm font-medium"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                            <Button type="submit" size="icon" className="bg-slate-900 text-white rounded-full h-10 w-10 shadow-lg" disabled={isLoading}>
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
                    </div>
                </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}
