'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function MessagesIndex() {
  const [users, setUsers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetch('http://localhost:5000/api/users', {
        credentials: 'include'
    })
        .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
        })
        .then(setUsers)
        .catch(err => console.error('Failed to load users:', err));
    }, []);


  return (
    <div>
        <Navbar className="bg-white shadow-md w-full p-4" />
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">Messages</h1>
            <ul className="w-full max-w-md space-y-2">
            {users.map(user => (
                <li key={user.id} className="p-4 bg-white shadow rounded hover:bg-gray-50 cursor-pointer"
                    onClick={() => router.push(`/messages/${user.id}`)}>
                {user.username}
                </li>
            ))}
            </ul>
        </div>
    </div>
    
  );
}