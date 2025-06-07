"use client";
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

function Login() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({email: '', password: '' });

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
      // Firebase Authentication
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);
      console.log("Firebase login successful:", userCredential.user);
      
      // Backend login
      fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
        .then(res => res.json())
        .then(data => {
          alert(data.message);
          if (data.message === 'Login successful') {
            navigate('/home');
          }
          setForm({email: '', password: '' });
        })
        .catch(err => alert('Error: ' + err));
    }
    catch (error) {
      alert(error.message);
    }
  };

  const handleRegister = (e) => {
    navigate('/');
  }

  return (
    <div className="Login">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <br />
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