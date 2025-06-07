"use client";
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

function Register() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({email: '', username: '', password: '' });

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
      // Firebase Auth registration
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      console.log("Firebase registration successful:", userCredential.user);
      
      // Backend registration
      fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
        .then(res => res.json())
        .then(data => {
          alert(data.message);
          setForm({email: '', username: '', password: '' });
        })
        .catch(err => alert('Error: ' + err));
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLogin = (e) => {
    navigate('/login');
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