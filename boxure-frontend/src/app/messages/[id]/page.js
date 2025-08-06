'use client';
import { useEffect, useRef, useState } from 'react';
import { io }                          from 'socket.io-client';
import { useParams, useRouter }        from 'next/navigation';
import Navbar                          from '@/components/Navbar';

export default function ChatPage() {
  const { recipient } = useParams();
  const router        = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [messages,    setMessages   ] = useState([]);
  const [draft,       setDraft      ] = useState('');
  const socketRef     = useRef();

  // 0) Load the logged‑in user
  useEffect(() => {
    fetch(`http://localhost:5000/api/users/me`, { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error('Not logged in');
        return res.json();
      })
      .then(data => setCurrentUser(data.user))
      .catch(() => router.push('/login'));
  }, [router]);

  // 1) Fetch history once we know who we are
  useEffect(() => {
    if (!currentUser) return;
    fetch(`http://localhost:5000/api/messages?recipient_id=${recipient}`, {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(setMessages);
  }, [recipient, currentUser]);

  // 2) Connect socket & listen for new messages
  useEffect(() => {
    if (!currentUser) return;
    socketRef.current = io('http://localhost:5000', { withCredentials: true });
    socketRef.current.on('new_message', msg => {
      const isForThisChat =
        (msg.sender_id    === currentUser.id && msg.recipient_id === Number(recipient)) ||
        (msg.recipient_id === currentUser.id && msg.sender_id    === Number(recipient));
      if (isForThisChat) {
        setMessages(m => [...m, msg]);
      }
    });
    return () => socketRef.current.disconnect();
  }, [currentUser, recipient]);

  // 3) Send a message
  const send = async () => {
    if (!draft.trim() || !currentUser) return;
    await fetch(`http://localhost:5000/api/messages`, {
      method:      'POST',
      credentials: 'include',
      headers:     { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender_id:    currentUser.id,
        recipient_id: Number(recipient),
        content:      draft
      }),
    });
    setDraft('');
  };

  // show a loader until we know who we are
  if (!currentUser) return <div>Loading…</div>;

  return (
    <div>
      <Navbar className="bg-white shadow-md w-full p-4" />
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-auto p-4 space-y-2">
          {messages.map(m => (
            <div
              key={m.id}
              className={`
                p-2 rounded max-w-xs
                ${m.sender_id === currentUser.id
                  ? 'bg-blue-100 self-end'
                  : 'bg-gray-100 self-start'}
              `}
            >
              {m.content}
            </div>
          ))}
        </div>
        <div className="p-4 border-t flex gap-2">
          <input
            type="text"
            className="flex-1 border rounded px-2 py-1"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
          />
          <button
            onClick={send}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
