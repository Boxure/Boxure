"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/config/supabase';
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const QUESTION_MARK_IMG = "https://upload.wikimedia.org/wikipedia/commons/5/55/Question_Mark.svg"; // public domain

function Market() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Fetch items from Supabase and log for debugging
    const fetchItems = async () => {
      const { data, error } = await supabase
        .from('items')
        .select('*');
      
      console.log('Supabase items response:', { data, error });
      
      if (error) {
        console.error('Error fetching items:', error);
      } else {
        console.log('Items found:', data);
        setItems(data || []);
      }
    };
    
    fetchItems();
  }, []);

  useEffect(() => {
    // Check Supabase auth session and get user data
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setLoggedIn(true);
          
          // Get username from users table
          const { data: userData, error } = await supabase
            .from('users')
            .select('username')
            .eq('id', session.user.id)
            .single();
          
          if (userData && !error) {
            setUsername(userData.username);
          } else {
            // Fallback to email if username not found
            setUsername(session.user.email);
          }
        } else {
          setLoggedIn(false);
          setUsername("");
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setLoggedIn(false);
        setUsername("");
      }
    };

    checkUser();
  }, []);

  return (
    <div className="Market">
      <Navbar className="bg-white shadow-md w-full p-4" />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-extrabold text-gray-800 text-center mb-2">
        Welcome{loggedIn && username ? `, ${username}` : ""} to the{" "}
        <span className="text-indigo-600">Marketplace</span>!
      </h1>
      <p className="text-gray-500 text-lg mb-6">
        Discover unique boxes or share your own creations.
      </p>
        <div ><Link href="/home"><Button variant="outline">Home</Button></Link></div>
        {loggedIn ? (
          <Link href="/add-box"><Button>Add Your Own Box</Button></Link>
        ) : (
          <p>You must be logged in to add a box.</p>
        )}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "24px",
            marginTop: "32px"
          }}
        >
          {items.map(item => (
            <div
              key={item.id}
              onClick={() => router.push(`/market/${item.id}`)}
              style={{
                cursor: "pointer",
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                aspectRatio: '1 / 1',
                width: '100%',
                justifyContent: 'center',
                background: '#fff'
              }}
            >
              <img
                src={item.image_url || QUESTION_MARK_IMG}
                alt={item.name}
                style={{
                  width: '60%',
                  height: '60%',
                  objectFit: 'cover',
                  marginBottom: '12px',
                  borderRadius: '4px',
                  background: '#f0f0f0'
                }}
                onError={e => { e.target.src = QUESTION_MARK_IMG; }}
              />
              <h2 style={{ fontSize: '1.1rem', textAlign: 'center', margin: 0, color: '#000' }}>{item.name}</h2>
              <p style={{ fontSize: '0.9rem', textAlign: 'center', margin: 0, color: '#000' }}>{item.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Market;
