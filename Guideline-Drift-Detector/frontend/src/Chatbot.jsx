import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from './apiService';
import { MessageSquare, X, Send, Bot, User, Sparkles } from 'lucide-react';

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', text: 'Hi Dr., I am your Clinical AI Assistant. Ask me about recent guideline changes, patient impacts, or organizational conflicts.' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setLoading(true);

        const reply = await sendChatMessage(userMsg);
        
        setMessages(prev => [...prev, { role: 'assistant', text: reply }]);
        setLoading(false);
    };

    if (!isOpen) {
        return (
            <button 
                onClick={() => setIsOpen(true)}
                style={{
                    position: 'fixed', bottom: '2rem', right: '2rem',
                    width: '60px', height: '60px', borderRadius: '30px',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                    color: 'white', border: 'none', boxShadow: '0 10px 25px -5px rgba(59,130,246,0.5)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    animation: 'pulse 2s infinite', zIndex: 1000
                }}
            >
                <Sparkles size={28} />
            </button>
        );
    }

    return (
        <div className="glass-card" style={{
            position: 'fixed', bottom: '2rem', right: '2rem',
            width: '380px', height: '550px',
            display: 'flex', flexDirection: 'column',
            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.15)',
            zIndex: 1000, overflow: 'hidden', animation: 'slideUp 0.3s ease-out'
        }}>
            <div style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                padding: '1rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Bot size={24} color="#60a5fa" />
                    <strong style={{ fontSize: '1.1rem' }}>Clinical Assistant</strong>
                </div>
                <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}>
                    <X size={24} />
                </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--bg-color)' }}>
                {messages.map((m, i) => (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                        <div style={{
                            maxWidth: '85%', padding: '1rem', borderRadius: '12px',
                            background: m.role === 'user' ? '#3b82f6' : '#fff',
                            color: m.role === 'user' ? '#fff' : '#0f172a',
                            border: m.role === 'assistant' ? '1px solid var(--card-border)' : 'none',
                            boxShadow: 'var(--shadow-sm)'
                        }}>
                            <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.5 }}>{m.text}</p>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            {m.role === 'user' ? <User size={12}/> : <Bot size={12}/>} {m.role === 'user' ? 'You' : 'AI Assistant'}
                        </span>
                    </div>
                ))}
                {loading && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', padding: '0.5rem' }}>
                        <span className="typing-dot" style={{ animation: 'blink 1.4s infinite 0.2s' }}>.</span>
                        <span className="typing-dot" style={{ animation: 'blink 1.4s infinite 0.4s' }}>.</span>
                        <span className="typing-dot" style={{ animation: 'blink 1.4s infinite 0.6s' }}>.</span>
                        <style>{`@keyframes blink { 0% { opacity: .2; } 20% { opacity: 1; } 100% { opacity: .2; } }`}</style>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} style={{ display: 'flex', padding: '1rem', borderTop: '1px solid var(--card-border)', background: '#fff' }}>
                <input 
                    type="text" 
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Ask a clinical question..." 
                    style={{ flex: 1, border: 'none', background: 'var(--bg-color)', padding: '0.75rem 1rem', borderRadius: '20px 0 0 20px', outline: 'none' }}
                />
                <button type="submit" disabled={!input.trim() || loading} style={{
                    background: 'var(--primary)', color: 'white', border: 'none', padding: '0 1rem',
                    borderRadius: '0 20px 20px 0', cursor: 'pointer', display: 'flex', alignItems: 'center'
                }}>
                    <Send size={18} />
                </button>
            </form>
        </div>
    );
}
