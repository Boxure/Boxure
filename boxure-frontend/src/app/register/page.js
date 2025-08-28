'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/config/supabase';
import Navbar from "@/components/Navbar";
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function Register() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ email: '', username: '', password: '' });

  useEffect(() => {
    // Fetch users from Supabase instead of localhost:5000
    supabase
      .from('users')
      .select('*')
      .then(({ data, error }) => {
        if (error) {
          console.error('Error fetching data:', error);
        } else {
          setUsers(data || []);
        }
      });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form data:', form);
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('Supabase client:', supabase);
    
    try {
      // Supabase Auth registration instead of backend
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            username: form.username,
            display_name: form.username // Also set display name
          }
        }
      });

      console.log('Supabase response:', { data, error });

      if (error) {
        console.error('Supabase error:', error);
        alert(error.message);
        return;
      }

      if (data.user) {
        // Update the users table with username
        const { error: updateError } = await supabase
          .from('users')
          .update({ username: form.username })
          .eq('id', data.user.id);

        // Also update the auth user's display name
        const { error: profileError } = await supabase.auth.updateUser({
          data: { display_name: form.username }
        });

        if (updateError) {
          console.error('Profile update error:', updateError);
        }
        
        if (profileError) {
          console.error('Display name update error:', profileError);
        }

        alert('Registration successful!');
      }

      setForm({ email: '', username: '', password: '' });
    } catch (error) {
      console.error('Catch error:', error);
      alert(error.message);
    }
  };
        
  const handleLogin = () => {
    router.push('/login');
  }

  return (
    <div className="App">
      <Navbar className="bg-white shadow-md w-full p-4" />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Register an account</CardTitle>
            <CardDescription>
              Enter your email below to create a new account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
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
              </div>
            </form>
            </CardContent>
            <CardFooter className="flex-col gap-2">
            <Button type="submit" className="w-full" onClick={handleSubmit}>
              Register
            </Button>
            <Button type="button" variant="outline" onClick={handleLogin} className="w-full">
              Login Instead
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default Register;