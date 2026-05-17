import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp, 
  where,
  limit,
  doc,
  getDoc
} from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Camera, Calendar, Mic, Send, MoreVertical, Paperclip, Loader2, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "sonner";

export default function ChatPage() {
  const { user, profile } = useAuth();
  const [activeChat, setActiveChat] = useState<any>(null);
  const [chats, setChats] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;

    // Fetch user's chats
    const q = query(
      collection(db, "chats"),
      where("participants", "array-contains", user.uid),
      orderBy("updatedAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setChats(chatData);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!activeChat) return;

    const q = query(
      collection(db, "chats", activeChat.id, "messages"),
      orderBy("createdAt", "asc"),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      // Scroll to bottom
      setTimeout(() => {
          if (scrollRef.current) scrollRef.current.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    });

    return () => unsubscribe();
  }, [activeChat]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat || !user) return;

    try {
      await addDoc(collection(db, "chats", activeChat.id, "messages"), {
        text: newMessage,
        senderId: user.uid,
        createdAt: serverTimestamp(),
      });
      setNewMessage("");
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  if (isLoading) return <div className="h-full flex items-center justify-center"><Loader2 className="h-10 w-10 animate-spin" /></div>;

  return (
    <div className="flex h-[calc(100vh-160px)] bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-200/60">
      {/* Chats Sidebar */}
      <div className="w-80 border-r flex flex-col bg-slate-50/50">
        <div className="p-6 border-b bg-white">
           <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">Messages</h2>
        </div>
        <ScrollArea className="flex-1">
           {chats.length > 0 ? chats.map(chat => (
               <button 
                  key={chat.id}
                  onClick={() => setActiveChat(chat)}
                  className={cn(
                      "w-full p-4 flex gap-3 hover:bg-white transition-all text-left border-b border-slate-100",
                      activeChat?.id === chat.id ? "bg-white shadow-sm border-l-4 border-l-slate-900" : ""
                  )}
               >
                   <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                       <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${chat.id}`} />
                       <AvatarFallback>U</AvatarFallback>
                   </Avatar>
                   <div className="flex-1 truncate">
                       <p className="font-bold text-slate-900 text-sm">Property Owner</p>
                       <p className="text-xs text-slate-500 truncate mt-0.5">{chat.lastMessage || 'No messages yet'}</p>
                   </div>
               </button>
           )) : (
                <div className="p-8 text-center text-slate-400">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-10" />
                    <p className="text-sm font-medium">No active conversations</p>
                </div>
           )}
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden">
        {activeChat ? (
          <>
            <div className="p-4 border-b flex items-center justify-between bg-white z-10">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${activeChat.id}`} />
                        <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-black text-slate-900 text-sm uppercase tracking-tight">Property Owner</p>
                        <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest flex items-center gap-1">
                            <span className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse" /> Online
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="rounded-full"><Calendar className="h-5 w-5 text-slate-400" /></Button>
                    <Button variant="ghost" size="icon" className="rounded-full"><MoreVertical className="h-5 w-5 text-slate-400" /></Button>
                </div>
            </div>

            <ScrollArea className="flex-1 p-6 bg-slate-50/30">
               <div className="space-y-6">
                   {messages.map((msg, i) => (
                       <div 
                          key={msg.id} 
                          className={cn(
                              "flex flex-col max-w-[80%]",
                              msg.senderId === user?.uid ? "ml-auto items-end" : "mr-auto items-start"
                          )}
                       >
                           <div className={cn(
                               "p-4 rounded-[2rem] text-sm font-medium shadow-sm",
                               msg.senderId === user?.uid 
                                 ? "bg-slate-900 text-white rounded-br-none" 
                                 : "bg-white text-slate-900 rounded-bl-none border border-slate-100"
                           )}>
                               {msg.text}
                           </div>
                           <span className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-tighter px-2">
                               {msg.createdAt?.seconds ? format(new Date(msg.createdAt.seconds * 1000), 'p') : 'Just now'}
                           </span>
                       </div>
                   ))}
                   <div ref={scrollRef} />
               </div>
            </ScrollArea>

            <div className="p-6 bg-white border-t">
                <form onSubmit={handleSendMessage} className="flex gap-4 items-center bg-slate-100 p-2 rounded-[2rem] border border-slate-200">
                    <div className="flex gap-1 px-2">
                        <Button type="button" variant="ghost" size="icon" className="rounded-full text-slate-400 hover:text-slate-900"><Paperclip className="h-5 w-5" /></Button>
                        <Button type="button" variant="ghost" size="icon" className="rounded-full text-slate-400 hover:text-slate-900"><Camera className="h-5 w-5" /></Button>
                    </div>
                    <Input 
                      placeholder="Type a message..." 
                      className="flex-1 border-none bg-transparent shadow-none focus-visible:ring-0 text-slate-900 font-medium"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <div className="flex gap-2 pr-1">
                        <Button type="button" variant="ghost" size="icon" className="rounded-full text-slate-400 hover:text-slate-900"><Mic className="h-5 w-5" /></Button>
                        <Button type="submit" className="bg-slate-900 h-10 w-10 flex items-center justify-center rounded-full shadow-lg hover:scale-105 transition-all text-white">
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-10 bg-slate-50/30">
              <div className="h-20 w-20 bg-white rounded-[2rem] shadow-xl flex items-center justify-center mb-6">
                  <MessageSquare className="h-10 w-10 text-slate-900" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase mb-2">No active selection</h3>
              <p className="text-slate-500 max-w-xs font-medium italic">Select a conversation from the sidebar to start chatting with verified landlords and agents.</p>
          </div>
        )}
      </div>
    </div>
  );
}
