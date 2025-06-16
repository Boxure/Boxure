'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '@/config/firebase';  // assuming you put your firebase config in lib/firebase.js

function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Firebase login
      const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);
      console.log("Firebase login successful:", userCredential.user);
      
      // Optional backend call
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (data.message === 'Login successful') {
        router.push('/home');
      } else {
        alert(data.message);
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
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label>Email:
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>
        <br />
        <label>Password:
          <input type="password" name="password" value={form.password} onChange={handleChange} required />
        </label>
        <br />
        <button type="submit">Login</button>
        <button type="button" onClick={handleRegister}>Register Instead</button>
      </form>
    </div>
  );
}

export default Login;