import { useState, useRef, useEffect } from "react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

// ─── SVG Icon Library ─────────────────────────────────────────────────────────
const Icons = {
  Dashboard: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
      <rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
      <rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
      <rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
    </svg>
  ),
  Messages: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M14 10.667A1.333 1.333 0 0112.667 12H4.667L2 14.667V3.333A1.333 1.333 0 013.333 2h9.334A1.333 1.333 0 0114 3.333v7.334z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Orders: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M13.333 2H2.667A.667.667 0 002 2.667v10.666A.667.667 0 002.667 14h10.666A.667.667 0 0014 13.333V2.667A.667.667 0 0013.333 2z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5.333 5.333h5.334M5.333 8h5.334M5.333 10.667H8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
  Analytics: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 12l3.5-4 3 2.5L12 5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 14h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
  Settings: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M8 1.5v1M8 13.5v1M1.5 8h1M13.5 8h1M3.4 3.4l.7.7M11.9 11.9l.7.7M3.4 12.6l.7-.7M11.9 4.1l.7-.7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
  Search: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M10 10l2.5 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  Paperclip: () => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M13 6.5L6.5 13a4 4 0 01-5.657-5.657l7-7a2.5 2.5 0 013.535 3.536L4.5 11.5a1 1 0 01-1.414-1.414L9.5 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Image: () => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <rect x="1.5" y="1.5" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.3"/>
      <circle cx="5" cy="5" r="1" fill="currentColor"/>
      <path d="M1.5 10l3.5-3.5 2.5 2.5 2-2 3.5 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Send: () => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M13.5 1.5L6.5 8.5M13.5 1.5L9 13.5l-2.5-5-5-2.5 12-4.5z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  File: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M9 2H4.5A1.5 1.5 0 003 3.5v9A1.5 1.5 0 004.5 14h7a1.5 1.5 0 001.5-1.5V6L9 2z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 2v4h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5.5 9h5M5.5 11.5h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  Download: () => (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M6.5 1v8M3.5 6.5l3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M1.5 10.5v1a.5.5 0 00.5.5h9a.5.5 0 00.5-.5v-1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  Dots: () => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <circle cx="7.5" cy="3" r="1" fill="currentColor"/>
      <circle cx="7.5" cy="7.5" r="1" fill="currentColor"/>
      <circle cx="7.5" cy="12" r="1" fill="currentColor"/>
    </svg>
  ),
  Check: () => (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
      <path d="M2 5.5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Plus: () => (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M6.5 2v9M2 6.5h9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
  ChevronRight: () => (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M4.5 3l4 3.5-4 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

// ─── Types ────────────────────────────────────────────────────────────────────
interface ConversationItem {
  id: string;
  participant: { name: string; role: string; avatar: string; online: boolean };
  lastMessage: string;
  time: string;
  unread: number;
  orderId?: string;
}

interface ChatMessage {
  id: string;
  senderId: "me" | "other";
  content: string;
  timestamp: string;
  type: "text" | "file";
  fileName?: string;
  fileSize?: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const conversations: ConversationItem[] = [
  {
    id: "1",
    participant: {
      name: "Sarah Johnson",
      role: "Cloud Architect",
      avatar: "https://i.pravatar.cc/40?img=5",
      online: true,
    },
    lastMessage: "I've just reviewed the scope of work you sent and everything looks solid.",
    time: "2m ago",
    unread: 2,
    orderId: "ORD-2847",
  },
  {
    id: "2",
    participant: {
      name: "Travis Johnson",
      role: "Security Analyst",
      avatar: "https://i.pravatar.cc/40?img=12",
      online: false,
    },
    lastMessage: "The project files have been updated, let me know when you're ready.",
    time: "1h ago",
    unread: 0,
  },
  {
    id: "3",
    participant: {
      name: "Klaus Rodriguez",
      role: "Data Engineer",
      avatar: "https://i.pravatar.cc/40?img=18",
      online: false,
    },
    lastMessage: "Morning — I'm open to adjustments on the Phase 2 delivery.",
    time: "3h ago",
    unread: 1,
  },
  {
    id: "4",
    participant: {
      name: "Alessia Romano",
      role: "Business Strategist",
      avatar: "https://i.pravatar.cc/40?img=25",
      online: true,
    },
    lastMessage: "Sounds great, let me know when you're available for a call.",
    time: "Yesterday",
    unread: 0,
  },
];

const messagesByConv: Record<string, ChatMessage[]> = {
  "1": [
    {
      id: "m1",
      senderId: "other",
      content:
        "Hi there — I've reviewed the scope of work you sent and it's well-structured. I'd like to clarify a few points on the infrastructure migration timeline before we begin.",
      timestamp: "10:14",
      type: "text",
    },
    {
      id: "m2",
      senderId: "me",
      content:
        "Absolutely, happy to walk through any open questions. What specifically would you like to revisit?",
      timestamp: "10:18",
      type: "text",
    },
    {
      id: "m3",
      senderId: "other",
      content:
        "Mainly Phase 2 — I want to confirm the handover criteria before we lock in the sprint schedule. Also wanted to ask about rollback procedures in case of a failed migration.",
      timestamp: "10:22",
      type: "text",
    },
    {
      id: "m4",
      senderId: "me",
      content:
        "Good call. I've extended the Q2 sprint by two additional days to accommodate full validation. I've also drafted a revised roadmap with the rollback protocol included — attaching it now.",
      timestamp: "10:35",
      type: "text",
    },
    {
      id: "m5",
      senderId: "me",
      content: "Revised_Roadmap_v2.pdf",
      timestamp: "10:36",
      type: "file",
      fileName: "Revised_Roadmap_v2.pdf",
      fileSize: "2.4 MB",
    },
    {
      id: "m6",
      senderId: "other",
      content:
        "Perfect — I'll review this with my team and get back to you before end of day. Thank you for being so thorough.",
      timestamp: "10:41",
      type: "text",
    },
  ],
  "2": [
    {
      id: "m1",
      senderId: "other",
      content: "The project files have been updated. Ping me when you're ready to proceed.",
      timestamp: "Yesterday",
      type: "text",
    },
  ],
  "3": [
    {
      id: "m1",
      senderId: "other",
      content:
        "Morning — I'm available to adjust the Phase 2 delivery window if needed. What changes did you have in mind?",
      timestamp: "9:00",
      type: "text",
    },
  ],
  "4": [
    {
      id: "m1",
      senderId: "other",
      content: "Sounds great. Let me know when you're available for a call this week.",
      timestamp: "Mon",
      type: "text",
    },
  ],
};

const navItems = [
  { label: "Dashboard", Icon: Icons.Dashboard },
  { label: "Messages", Icon: Icons.Messages, active: true, badge: 3 },
  { label: "My Orders", Icon: Icons.Orders },
  { label: "Analytics", Icon: Icons.Analytics },
  { label: "Settings", Icon: Icons.Settings },
];

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({
  activeId,
  onSelect,
}: {
  activeId: string;
  onSelect: (id: string) => void;
}) {
  const [search, setSearch] = useState("");
  const filtered = conversations.filter((c) =>
    c.participant.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <aside
      className="flex flex-col bg-white border-r border-gray-100"
      style={{ width: 268, minWidth: 268 }}
    >
      {/* Navigation */}
      <div className="px-4 pt-6 pb-4 border-b border-gray-100">
        {navItems.map(({ label, Icon, active, badge }) => (
          <button
            key={label}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 text-sm font-medium transition-all cursor-pointer ${
              active
                ? "bg-red-700 text-white shadow-sm"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
            }`}
          >
            <span className={active ? "text-white" : "text-gray-400"}>
              <Icon />
            </span>
            <span className="flex-1 text-left">{label}</span>
            {badge && (
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none ${
                  active ? "bg-white text-red-700" : "bg-red-700 text-white"
                }`}
              >
                {badge}
              </span>
            )}
          </button>
        ))}

        <button className="w-full mt-3 flex items-center justify-center gap-2 border-2 border-red-700 text-red-700 text-xs font-bold py-2.5 rounded-xl hover:bg-red-700 hover:text-white transition-all cursor-pointer">
          <Icons.Plus />
          Post a Request
        </button>
      </div>

      {/* Search */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-red-300 transition-colors">
          <span className="text-gray-400 flex-shrink-0">
            <Icons.Search />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations..."
            className="flex-1 bg-transparent text-xs text-gray-600 placeholder-gray-400 focus:outline-none"
          />
        </div>
      </div>

      <div className="px-4 py-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
          Recent
        </span>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {filtered.map((conv) => (
          <button
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className={`w-full flex items-start gap-3 px-4 py-3.5 text-left transition-all border-l-[3px] ${
              activeId === conv.id
                ? "bg-red-50 border-l-red-700"
                : "border-l-transparent hover:bg-gray-50"
            }`}
          >
            <div className="relative flex-shrink-0 mt-0.5">
              <img
                src={conv.participant.avatar}
                alt={conv.participant.name}
                className="w-9 h-9 rounded-full object-cover"
              />
              {conv.participant.online && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-0.5">
                <span
                  className={`text-xs font-semibold truncate ${
                    activeId === conv.id ? "text-red-700" : "text-gray-800"
                  }`}
                >
                  {conv.participant.name}
                </span>
                <span className="text-[10px] text-gray-400 flex-shrink-0 ml-2">
                  {conv.time}
                </span>
              </div>
              <p className="text-[11px] text-gray-500 truncate leading-relaxed">
                {conv.lastMessage}
              </p>
            </div>
            {conv.unread > 0 && (
              <span className="flex-shrink-0 bg-red-700 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center mt-1">
                {conv.unread}
              </span>
            )}
          </button>
        ))}
      </div>
    </aside>
  );
}

// ─── Chat Area ────────────────────────────────────────────────────────────────
function ChatArea({
  conv,
  messages,
  onSend,
}: {
  conv: ConversationItem;
  messages: ChatMessage[];
  onSend: (text: string) => void;
}) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input.trim());
    setInput("");
  };

  return (
    <div className="flex-1 flex flex-col bg-white min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={conv.participant.avatar}
              alt={conv.participant.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            {conv.participant.online && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
            )}
          </div>
          <div>
            <div className="font-bold text-sm text-gray-900 leading-tight">
              {conv.participant.name}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-gray-400">{conv.participant.role}</span>
              {conv.orderId && (
                <>
                  <span className="text-gray-200 text-xs">·</span>
                  <span className="text-xs font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded-md">
                    {conv.orderId}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 rounded-lg border border-gray-200 text-gray-400 flex items-center justify-center hover:border-red-300 hover:text-red-600 transition-all cursor-pointer">
            <Icons.Paperclip />
          </button>
          <button className="w-8 h-8 rounded-lg border border-gray-200 text-gray-400 flex items-center justify-center hover:border-red-300 hover:text-red-600 transition-all cursor-pointer">
            <Icons.Dots />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4" style={{ background: "#fafafa" }}>
        {messages.map((msg, i) => {
          const isMe = msg.senderId === "me";
          const showAvatar =
            !isMe && (i === 0 || messages[i - 1]?.senderId !== "other");

          return (
            <div
              key={msg.id}
              className={`flex items-end gap-3 ${isMe ? "justify-end" : "justify-start"}`}
            >
              {/* Avatar placeholder for threading */}
              {!isMe && (
                <div className="w-7 flex-shrink-0 self-end">
                  {showAvatar ? (
                    <img
                      src={conv.participant.avatar}
                      alt=""
                      className="w-7 h-7 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-7" />
                  )}
                </div>
              )}

              {msg.type === "file" ? (
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl max-w-xs border ${
                    isMe
                      ? "bg-red-700 border-red-700 text-white rounded-br-sm"
                      : "bg-white border-gray-200 text-gray-700 rounded-bl-sm shadow-sm"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isMe ? "bg-red-600" : "bg-red-50"
                    }`}
                  >
                    <span className={isMe ? "text-white" : "text-red-700"}>
                      <Icons.File />
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className={`font-semibold text-xs truncate ${
                        isMe ? "text-white" : "text-gray-800"
                      }`}
                    >
                      {msg.fileName}
                    </div>
                    <div
                      className={`text-[10px] mt-0.5 ${
                        isMe ? "text-red-200" : "text-gray-400"
                      }`}
                    >
                      {msg.fileSize} · PDF Document
                    </div>
                  </div>
                  <button
                    className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all cursor-pointer ${
                      isMe
                        ? "bg-white/20 hover:bg-white/30 text-white"
                        : "bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-700"
                    }`}
                  >
                    <Icons.Download />
                  </button>
                </div>
              ) : (
                <div className={`flex flex-col gap-1 max-w-sm ${isMe ? "items-end" : "items-start"}`}>
                  <div
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      isMe
                        ? "bg-red-700 text-white rounded-br-sm shadow-sm"
                        : "bg-white text-gray-800 rounded-bl-sm border border-gray-100 shadow-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                  <div
                    className={`flex items-center gap-1 text-[10px] text-gray-400 ${
                      isMe ? "justify-end" : "justify-start"
                    }`}
                  >
                    {msg.timestamp}
                    {isMe && (
                      <span className="text-emerald-500">
                        <Icons.Check />
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-8 py-5 border-t border-gray-100 bg-white">
        <div className="flex items-end gap-3">
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 focus-within:border-red-300 focus-within:bg-white transition-all">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Write your message..."
              rows={1}
              className="w-full bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none resize-none leading-relaxed"
              style={{ maxHeight: 120 }}
            />
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
              <div className="flex gap-1">
                <button className="w-7 h-7 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-red-600 flex items-center justify-center transition-all cursor-pointer">
                  <Icons.Paperclip />
                </button>
                <button className="w-7 h-7 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-red-600 flex items-center justify-center transition-all cursor-pointer">
                  <Icons.Image />
                </button>
              </div>
              <span className="text-[10px] text-gray-400 select-none">
                Enter to send · Shift+Enter for new line
              </span>
            </div>
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-11 h-11 bg-red-700 text-white rounded-xl flex items-center justify-center hover:bg-red-800 active:scale-95 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-sm flex-shrink-0 mb-0.5"
          >
            <Icons.Send />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Right Panel ──────────────────────────────────────────────────────────────
function OrderPanel({ conv }: { conv: ConversationItem }) {
  if (!conv.orderId) return null;

  return (
    <aside
      className="border-l border-gray-100 bg-white flex flex-col"
      style={{ width: 240, minWidth: 240 }}
    >
      <div className="px-5 py-5 border-b border-gray-100">
        <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
          Order Details
        </div>
        <div className="bg-red-50 rounded-xl p-4">
          <div className="text-xs font-bold text-red-700 mb-1">{conv.orderId}</div>
          <div className="text-[11px] text-gray-600 leading-relaxed">
            Enterprise Cloud Infrastructure Migration
          </div>
          <div className="h-px bg-red-100 my-3" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-gray-400">Status</span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              IN PROGRESS
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-400">Value</span>
            <span className="text-xs font-bold text-gray-900">$2,450</span>
          </div>
        </div>
      </div>

      <div className="px-5 py-4 border-b border-gray-100">
        <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
          Shared Files
        </div>
        {[
          { name: "Revised_Roadmap_v2.pdf", size: "2.4 MB", date: "Today" },
          { name: "Infrastructure_Audit.pdf", size: "1.1 MB", date: "Mon" },
        ].map((f) => (
          <div
            key={f.name}
            className="flex items-center gap-2 py-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0 group-hover:bg-red-100 transition-colors">
              <span className="text-red-700">
                <Icons.File />
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-medium text-gray-700 truncate">
                {f.name}
              </div>
              <div className="text-[10px] text-gray-400">
                {f.size} · {f.date}
              </div>
            </div>
            <span className="text-gray-300 group-hover:text-red-600 transition-colors">
              <Icons.Download />
            </span>
          </div>
        ))}
      </div>

      <div className="px-5 py-4">
        <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
          Provider
        </div>
        <div className="flex items-center gap-3">
          <img
            src={conv.participant.avatar}
            alt=""
            className="w-9 h-9 rounded-full object-cover"
          />
          <div>
            <div className="text-xs font-semibold text-gray-800">
              {conv.participant.name}
            </div>
            <div className="text-[10px] text-gray-400">{conv.participant.role}</div>
          </div>
        </div>
        <button className="w-full mt-4 flex items-center justify-center gap-1.5 border border-gray-200 text-gray-600 text-xs font-semibold py-2.5 rounded-xl hover:border-red-300 hover:text-red-700 transition-all cursor-pointer">
          View Profile
          <Icons.ChevronRight />
        </button>
      </div>
    </aside>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function MessagingPage() {
  const [activeId, setActiveId] = useState("1");
  const [allMessages, setAllMessages] = useState(messagesByConv);

  const activeConv = conversations.find((c) => c.id === activeId)!;
  const messages = allMessages[activeId] || [];

  const handleSend = (text: string) => {
    const newMsg: ChatMessage = {
      id: `m${Date.now()}`,
      senderId: "me",
      content: text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: "text",
    };
    setAllMessages((prev) => ({
      ...prev,
      [activeId]: [...(prev[activeId] || []), newMsg],
    }));
  };

  return (
    <div
      style={{ minWidth: 1280, fontFamily: "'DM Sans', sans-serif" }}
      className="flex flex-col min-h-screen bg-white"
    >
      <Navbar />
      <div
        className="flex flex-1 overflow-hidden"
        style={{ height: "calc(100vh - 65px)" }}
      >
        <Sidebar activeId={activeId} onSelect={setActiveId} />
        <ChatArea conv={activeConv} messages={messages} onSend={handleSend} />
        <OrderPanel conv={activeConv} />
      </div>
      <Footer />
    </div>
  );
}