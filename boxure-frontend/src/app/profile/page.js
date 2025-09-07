"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { supabase } from '@/config/supabase';
import Navbar from "@/components/Navbar";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {NavigationMenuItem} from "@/components/ui/navigation-menu";

const QUESTION_MARK_IMG = "https://upload.wikimedia.org/wikipedia/commons/5/55/Question_Mark.svg"; // public domain

function Profile() {
    const [items, setItems] = useState([]);
    const [loggedIn, setLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const router = useRouter();
    const handleMarket = () => {
        router.push("/market");
    };
    const handleLogin = () => {
        router.push("/login");
    };
    const handleRegister = () => {
        router.push("/register");
    };
    const handleProfile = () => {
        router.push("/profile")};



    useEffect(() => {
        // Fetch items from Supabase and log for debugging
        const fetchItems = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            const { data, error } = await supabase
                .from('items')
                .select('*')
                .eq('owner', session.user.id);

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
        <div>
            <Navbar className="bg-white shadow-md w-full p-4" />

            <Avatar onClick ={handleProfile} className="h-8 w-8 cursor-pointer">
                <AvatarImage src="" alt="User Avatar" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <NavigationMenuItem>
                {loggedIn ? (
                    <p>Welcome {username}</p>
                ) : null}
            </NavigationMenuItem>
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

    );
}
export default Profile;
