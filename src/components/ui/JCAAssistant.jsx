import React, { useState, useRef, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import { sendMessageToAI, resetChatSession } from '../../services/chatService';
import { MessageSquare, X, Send, Bot, User as UserIcon, Loader2, Sparkles } from 'lucide-react';

const JCAAssistant = () => {
    const { user } = useUser();
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        { role: 'model', text: 'Commands ready. How can I assist you today, Agent?' }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    // Handle Reset on Close (Optional, keep context for now)
    // useEffect(() => { if (!isOpen) resetChatSession(); }, [isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        const response = await sendMessageToAI(input, user);

        setIsLoading(false);
        if (response.success) {
            setMessages(prev => [...prev, { role: 'model', text: response.text }]);
        } else {
            setMessages(prev => [...prev, { role: 'model', text: '⚠️ Connection unstable. System reboot advised.' }]);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">

            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 w-[90vw] md:w-96 h-[500px] glass-panel border border-primary/30 rounded-2xl flex flex-col overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom-10 duration-300 backdrop-blur-xl bg-black/80">

                    {/* Header */}
                    <div className="p-4 border-b border-white/10 bg-gradient-to-r from-primary/10 to-transparent flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Bot className="w-5 h-5 text-primary animate-pulse" />
                            <span className="font-display font-bold text-white tracking-wider">JCA AI CORE</span>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5 text-white/60" />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {msg.role === 'model' && (
                                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 border border-primary/30">
                                        <Bot className="w-4 h-4 text-primary" />
                                    </div>
                                )}

                                <div
                                    className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                            ? 'bg-primary text-black rounded-tr-none font-medium shadow-[0_0_15px_rgba(59,130,246,0.4)]'
                                            : 'bg-white/5 text-white/90 rounded-tl-none border border-white/10'
                                        }`}
                                >
                                    {msg.text}
                                </div>

                                {msg.role === 'user' && (
                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                        <UserIcon className="w-4 h-4 text-white" />
                                    </div>
                                )}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex gap-3 justify-start animate-pulse">
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 border border-primary/30">
                                    <Loader2 className="w-4 h-4 text-primary animate-spin" />
                                </div>
                                <div className="bg-white/5 text-primary/60 text-xs p-3 rounded-2xl rounded-tl-none border border-white/5 flex items-center gap-2">
                                    Processing Neural Request...
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} className="p-3 border-t border-white/10 bg-black/40">
                        <div className="relative flex items-center gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Command the system..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-white text-sm focus:outline-none focus:border-primary/50 transition-all placeholder:text-white/20"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className="absolute right-2 p-2 bg-primary text-black rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:hover:bg-primary transition-all shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Floating Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`group relative flex items-center justify-center w-14 h-14 rounded-full shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all duration-300 ${isOpen
                        ? 'bg-red-500 rotate-90 scale-90'
                        : 'bg-gradient-to-tr from-primary via-blue-500 to-indigo-600 hover:scale-110 hover:rotate-12'
                    }`}
            >
                {isOpen ? (
                    <X className="w-6 h-6 text-white" />
                ) : (
                    <>
                        <Sparkles className="w-6 h-6 text-white animate-pulse" />
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border border-black animate-ping" />
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border border-black" />
                    </>
                )}
            </button>
        </div>
    );
};

export default JCAAssistant;
