'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Navbar from "@/components/Navbar";
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function Login() {
  const router = useRouter();
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  const [form, setForm] = useState({ emailOrUser: '', password: '' });
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is already logged in with Supabase
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setLoggedIn(!!session);
    };
    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let email = form.emailOrUser;
      
      // If user entered username instead of email, look up the email
      if (!form.emailOrUser.includes('@')) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('email')
          .eq('username', form.emailOrUser)
          .single();
        
        if (userError || !userData) {
          alert('Username not found');
          return;
        }
        email = userData.email;
      }

      // Login with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: form.password,
      });

      if (error) {
        alert(error.message);
        return;
      }

      if (data.session) {
        router.push('/home');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleRegister = () => {
    router.push('/register');
  };

  return (
    <div className="Login">
      <Navbar className="bg-white shadow-md w-full p-4" />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        {!loggedIn ? (
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle>Login to your account</CardTitle>
              <CardDescription>
                Enter your email or username below to login to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="emailOrUser">Email or Username</Label>
                    <Input
                      id="emailOrUser"
                      type="text"
                      name="emailOrUser"
                      value={form.emailOrUser}
                      onChange={handleChange}
                      placeholder="m@example.com or username"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                      <a
                        href="#"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </a>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Button onClick={handleSubmit} type="submit" className="w-full">
                Login
              </Button>
              <Button type="button" variant="outline" onClick={handleRegister} className="w-full">
                Register Instead
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">You are already logged in</h2>
            <Button onClick={() => router.push('/home')}>Go to Home</Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;