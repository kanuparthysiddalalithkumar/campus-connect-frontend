import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, RefreshCw, Zap, Calendar, BookOpen } from 'lucide-react';
import api from './api';

// ─── Rule-based engine ────────────────────────────────────────────────────────
function processMessage(text, activities) {
  const q = text.toLowerCase().trim();
  const total = activities.length;

  // helpers
  const byCategory = (cat) => activities.filter(a => a.category?.toLowerCase() === cat.toLowerCase());
  const featured    = activities.filter(a => a.featured);
  const popular     = [...activities].sort((a, b) => b.currentParticipants - a.currentParticipants);
  const upcoming    = [...activities].sort((a, b) => new Date(a.date) - new Date(b.date));
  const full        = activities.filter(a => a.currentParticipants >= a.maxParticipants);

  const fmtActivity = (a) =>
    `📌 *${a.title}* (${a.category})\n📅 ${a.date} at ${a.time}\n📍 ${a.location}\n👥 ${a.currentParticipants}/${a.maxParticipants} participants${a.featured ? ' ⭐ Featured' : ''}`;

  const fmtList = (arr, max = 5) =>
    arr.slice(0, max).map(fmtActivity).join('\n\n') + (arr.length > max ? `\n\n...and ${arr.length - max} more.` : '');

  // greeting
  if (/^(hi|hello|hey|howdy|sup|hola|good\s*(morning|afternoon|evening))/.test(q))
    return `👋 Hey there! I'm the CampusConnect assistant.\n\nI know about **${total} activities** on the platform.\n\nYou can ask me:\n• "Show all events"\n• "Club activities"\n• "Sports events"\n• "Featured events"\n• "Most popular"\n• "Tell me about [event name]"`;

  // total count
  if (/(how many|total|count).*activ/.test(q) || /(how many|total|count).*event/.test(q))
    return `📊 There are **${total} activities** total:\n• 🎭 Clubs: ${byCategory('Club').length}\n• 🏆 Sports: ${byCategory('Sport').length}\n• ⚡ Events: ${byCategory('Event').length}`;

  // all events
  if (/(all|every|list all|show all).*activ|all event/.test(q)) {
    if (!total) return '😕 No activities found right now.';
    return `📋 All **${total} activities**:\n\n${fmtList(activities, 6)}`;
  }

  // categories
  if (/club/.test(q)) {
    const clubs = byCategory('Club');
    return clubs.length ? `🎭 **${clubs.length} Club Activities:**\n\n${fmtList(clubs)}` : '😕 No club activities found.';
  }
  if (/sport/.test(q)) {
    const sports = byCategory('Sport');
    return sports.length ? `🏆 **${sports.length} Sports Activities:**\n\n${fmtList(sports)}` : '😕 No sports activities found.';
  }
  if (/event/.test(q) && !/(all|every|list|show)/.test(q)) {
    const evts = byCategory('Event');
    return evts.length ? `⚡ **${evts.length} Events:**\n\n${fmtList(evts)}` : '😕 No events found.';
  }

  // featured
  if (/featured|highlight|special/.test(q))
    return featured.length ? `⭐ **${featured.length} Featured Activities:**\n\n${fmtList(featured)}` : '😕 No featured activities right now.';

  // popular
  if (/popular|most joined|top|trending/.test(q))
    return `🔥 **Most Popular Activities:**\n\n${fmtList(popular.slice(0, 5))}`;

  // upcoming / by date
  if (/upcoming|soon|next|schedule|date/.test(q))
    return `📅 **Upcoming Activities (by date):**\n\n${fmtList(upcoming.slice(0, 5))}`;

  // full / available
  if (/full|no.*spot|sold out/.test(q))
    return full.length ? `❌ **${full.length} fully booked activities:**\n\n${fmtList(full)}` : '✅ All activities still have open spots!';

  if (/available|open|spot|seat/.test(q)) {
    const open = activities.filter(a => a.currentParticipants < a.maxParticipants);
    return open.length ? `✅ **${open.length} activities with open spots:**\n\n${fmtList(open)}` : '😕 All activities are fully booked.';
  }

  // search by name
  const match = activities.filter(a =>
    a.title?.toLowerCase().includes(q) ||
    a.description?.toLowerCase().includes(q) ||
    (a.tags && a.tags.some(t => q.includes(t.toLowerCase())))
  );
  if (match.length)
    return `🔍 Found **${match.length} match${match.length > 1 ? 'es' : ''}**:\n\n${fmtList(match)}`;

  // categories summary
  if (/categor|type|kind/.test(q))
    return `📂 **Categories on CampusConnect:**\n\n🎭 **Clubs** — ${byCategory('Club').length} activities\n🏆 **Sports** — ${byCategory('Sport').length} activities\n⚡ **Events** — ${byCategory('Event').length} activities`;

  // register help
  if (/register|sign up|join/.test(q))
    return `✅ To **register** for an activity:\n1. Go to Activities page\n2. Click on any activity card\n3. Click **Register Now** button\n\nOr ask me about a specific activity and I'll show you its details!`;

  // help
  if (/help|what can|guide/.test(q))
    return `🤖 **I can help you with:**\n\n• Show all events\n• Club / Sport / Event activities\n• Featured or popular events\n• Upcoming events by date\n• Available spots\n• Search by event name\n• How to register`;

  // fallback
  return `🤔 I didn't understand that. Try:\n• "Show all events"\n• "Club activities"\n• "Featured events"\n• "Most popular"\n• Or type an event name to search!`;
}

// ─── Message formatting ───────────────────────────────────────────────────────
function FormattedText({ text }) {
  return (
    <div style={{ fontSize: 13, lineHeight: 1.7 }}>
      {text.split('\n').map((line, i) => {
        const bold = line.replace(/\*\*(.*?)\*\*/g, (_, m) => `<b>${m}</b>`);
        return (
          <div key={i} style={{ marginBottom: line === '' ? 4 : 0 }}
            dangerouslySetInnerHTML={{ __html: bold || '&nbsp;' }} />
        );
      })}
    </div>
  );
}

// ─── Bubble ───────────────────────────────────────────────────────────────────
function Bubble({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <div style={{ display: 'flex', flexDirection: isUser ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: 8, animation: 'ccSlideUp .22s ease' }}>
      <div style={{ width: 28, height: 28, borderRadius: 10, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: isUser ? 'linear-gradient(135deg,#16a34a,#22c55e)' : 'linear-gradient(135deg,#7c3aed,#6d28d9)', boxShadow: isUser ? '0 2px 8px rgba(22,163,74,.35)' : '0 2px 8px rgba(124,58,237,.35)' }}>
        {isUser ? <User size={13} color="#fff" /> : <Bot size={13} color="#fff" />}
      </div>
      <div style={{ maxWidth: '80%', background: isUser ? 'linear-gradient(135deg,#16a34a,#22c55e)' : '#fff', color: isUser ? '#fff' : '#1f2937', padding: '10px 14px', borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px', border: isUser ? 'none' : '1px solid rgba(22,163,74,.15)', boxShadow: isUser ? '0 4px 16px rgba(22,163,74,.25)' : '0 2px 12px rgba(22,163,74,.08)' }}>
        {isUser ? <span style={{ fontSize: 13 }}>{msg.content}</span> : <FormattedText text={msg.content} />}
        <div style={{ fontSize: 10, marginTop: 5, color: isUser ? 'rgba(255,255,255,.6)' : '#6b7280', textAlign: isUser ? 'right' : 'left' }}>{msg.time}</div>
      </div>
    </div>
  );
}

// ─── Typing dot ───────────────────────────────────────────────────────────────
function Typing() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
      <div style={{ width: 28, height: 28, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#7c3aed,#6d28d9)', flexShrink: 0 }}>
        <Bot size={13} color="#fff" />
      </div>
      <div style={{ background: '#fff', border: '1px solid rgba(22,163,74,.15)', borderRadius: '16px 16px 16px 4px', padding: '12px 16px', display: 'flex', gap: 5 }}>
        {[0, 1, 2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#16a34a', animation: `ccDot 1.2s ${i * .2}s ease-in-out infinite` }} />)}
      </div>
    </div>
  );
}

const QUICK = [
  { text: 'Show all events', icon: <Calendar size={11} /> },
  { text: 'Club activities', icon: <Zap size={11} /> },
  { text: 'Featured events', icon: <BookOpen size={11} /> },
];

const fmt = (d) => d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Chatbot() {
  const [open, setOpen]       = useState(false);
  const [input, setInput]     = useState('');
  const [typing, setTyping]   = useState(false);
  const [activities, setActivities] = useState([]);
  const [loaded, setLoaded]   = useState(false);
  const [messages, setMessages] = useState([{
    id: 0, role: 'assistant', time: fmt(new Date()),
    content: `👋 Hi! I'm the **CampusConnect Assistant**.\n\nI can answer questions about all campus events, categories, dates, locations, registrations and more — no internet needed!\n\nTry asking me something! 💬`,
  }]);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  // fetch activities once
  useEffect(() => {
    if (loaded) return;
    api.get('/activities').then(r => { setActivities(r.data || []); setLoaded(true); }).catch(() => setLoaded(true));
  }, [loaded]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, typing]);
  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 80); }, [open]);

  const send = (text) => {
    const msg = (text ?? input).trim();
    if (!msg) return;
    setInput('');

    const userMsg = { id: Date.now(), role: 'user', content: msg, time: fmt(new Date()) };
    setMessages(p => [...p, userMsg]);
    setTyping(true);

    setTimeout(() => {
      const reply = !loaded
        ? '⏳ Loading activity data... Please try again in a moment.'
        : processMessage(msg, activities);
      setMessages(p => [...p, { id: Date.now() + 1, role: 'assistant', content: reply, time: fmt(new Date()) }]);
      setTyping(false);
    }, 500);
  };

  const clear = () => setMessages([{ id: Date.now(), role: 'assistant', time: fmt(new Date()), content: `🔄 Chat cleared! Ask me anything about campus events.` }]);

  return (
    <>
      <style>{`
        @keyframes ccSlideUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes ccDot { 0%,100%{transform:translateY(0);opacity:.4} 50%{transform:translateY(-4px);opacity:1} }
        @keyframes ccPop { from{opacity:0;transform:scale(.88) translateY(18px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes ccPulse { 0%{box-shadow:0 0 0 0 rgba(22,163,74,.5)} 70%{box-shadow:0 0 0 12px rgba(22,163,74,0)} 100%{box-shadow:0 0 0 0 rgba(22,163,74,0)} }
        .cc-no-scroll::-webkit-scrollbar { display: none; }
        .cc-no-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* FAB */}
      <button id="chatbot-fab" aria-label="Open assistant" onClick={() => setOpen(p => !p)}
        style={{ position:'fixed', bottom:28, right:28, zIndex:200, width:54, height:54, borderRadius:17, border:'none', background: open ? 'linear-gradient(135deg,#dc2626,#f43f5e)' : 'linear-gradient(135deg,#16a34a,#22c55e)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', boxShadow: open ? '0 8px 28px rgba(220,38,38,.4)' : '0 8px 28px rgba(22,163,74,.4)', transition:'all .3s cubic-bezier(.34,1.56,.64,1)', animation: open ? 'none' : 'ccPulse 2.5s infinite' }}>
        {open ? <X size={21} /> : <MessageCircle size={21} />}
      </button>

      {/* Panel */}
      {open && (
        <div id="chatbot-panel"
          style={{ position:'fixed', bottom:92, right:28, zIndex:199, width:370, maxHeight:'76vh', display:'flex', flexDirection:'column', background:'#fff', border:'1px solid rgba(22,163,74,.2)', borderRadius:22, boxShadow:'0 24px 80px rgba(0,0,0,.14),0 8px 32px rgba(22,163,74,.1)', overflow:'hidden', animation:'ccPop .28s cubic-bezier(.34,1.56,.64,1)' }}>

          {/* Header */}
          <div style={{ padding:'14px 16px', background:'linear-gradient(135deg,#15803d,#16a34a,#22c55e)', display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:12, background:'rgba(255,255,255,.2)', display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid rgba(255,255,255,.3)', fontSize:18 }}>🎓</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:700, color:'#fff', fontFamily:'Plus Jakarta Sans' }}>CampusConnect Assistant</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,.75)', display:'flex', alignItems:'center', gap:4 }}>
                <span style={{ width:6, height:6, borderRadius:'50%', background:'#4ade80', boxShadow:'0 0 6px #4ade80', display:'inline-block' }} />
                {loaded ? `${activities.length} activities loaded` : 'Loading data...'}
              </div>
            </div>
            <button id="chatbot-clear" onClick={clear} title="Clear chat"
              style={{ background:'rgba(255,255,255,.15)', border:'1px solid rgba(255,255,255,.25)', borderRadius:10, padding:'6px 8px', color:'#fff', cursor:'pointer', display:'flex', alignItems:'center' }}>
              <RefreshCw size={14} />
            </button>
          </div>

          {/* Quick chips */}
          <div className="cc-no-scroll" style={{ display:'flex', gap:6, padding:'10px 12px 10px', overflowX:'auto', flexWrap:'nowrap' }}>
            {QUICK.map((p, i) => (
              <button key={i} onClick={() => send(p.text)}
                style={{ display:'flex', alignItems:'center', gap:4, padding:'5px 10px', borderRadius:20, border:'1px solid rgba(22,163,74,.25)', background:'#fff', color:'var(--green-dark)', fontSize:11, fontWeight:600, whiteSpace:'nowrap', cursor:'pointer', flexShrink:0, transition:'all .2s' }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(22,163,74,.08)'; e.currentTarget.style.borderColor='rgba(22,163,74,.5)'; }}
                onMouseLeave={e => { e.currentTarget.style.background='#fff'; e.currentTarget.style.borderColor='rgba(22,163,74,.25)'; }}>
                {p.icon} {p.text}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div style={{ flex:1, overflowY:'auto', padding:'12px', display:'flex', flexDirection:'column', gap:12, minHeight:0 }}>
            {messages.map(m => <Bubble key={m.id} msg={m} />)}
            {typing && <Typing />}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding:'10px 12px', borderTop:'1px solid rgba(22,163,74,.1)', background:'rgba(240,253,244,.5)' }}>
            <div style={{ display:'flex', gap:8, alignItems:'center', background:'#fff', borderRadius:14, border:'1.5px solid rgba(22,163,74,.25)', padding:'7px 7px 7px 14px' }}>
              <input ref={inputRef} id="chatbot-input" value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); send(); } }}
                placeholder="Ask about events, dates, categories..."
                style={{ flex:1, border:'none', outline:'none', background:'transparent', fontSize:13, color:'#1f2937', fontFamily:'Inter,sans-serif' }} />
              <button id="chatbot-send" onClick={() => send()} disabled={!input.trim()}
                style={{ width:32, height:32, borderRadius:10, border:'none', background: input.trim() ? 'linear-gradient(135deg,#16a34a,#22c55e)' : 'rgba(22,163,74,.1)', color: input.trim() ? '#fff' : 'rgba(22,163,74,.4)', display:'flex', alignItems:'center', justifyContent:'center', cursor: input.trim() ? 'pointer' : 'not-allowed', transition:'all .2s', boxShadow: input.trim() ? '0 3px 10px rgba(22,163,74,.3)' : 'none' }}>
                <Send size={14} />
              </button>
            </div>
            <div style={{ textAlign:'center', fontSize:10, color:'var(--text-muted)', marginTop:5 }}>Press Enter to send</div>
          </div>
        </div>
      )}
    </>
  );
}
