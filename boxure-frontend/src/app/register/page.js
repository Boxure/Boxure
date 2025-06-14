'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '@/config/firebase'; // Adjust this path depending on where your firebase config lives

function Register() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ email: '', username: '', password: '' });

  useEffect(() => {
    fetch('http://localhost:5000/api/users')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Firebase registration
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      console.log("Firebase registration successful:", userCredential.user);
      
      // Backend registration (optional)
      const res = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      alert(data.message);

      setForm({ email: '', username: '', password: '' });
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLogin = () => {
    router.push('/login');
  }

  return (
    <div className="App">
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <label>Email:
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>
        <br />
        <label>Username:
          <input type="text" name="username" value={form.username} onChange={handleChange} required />
        </label>
        <br />
        <label>Password:
          <input type="password" name="password" value={form.password} onChange={handleChange} required />
        </label>
        <br />
        <button type="submit">Register</button>
        <button type="button" onClick={handleLogin}>Login Instead</button>
      </form>
    </div>
  );
}

export default Register;