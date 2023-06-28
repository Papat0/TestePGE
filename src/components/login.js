import React, { useState } from 'react';
import './login.css';
// Componente da tela de login
function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {

    fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: username, password: password }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Usuário ou senha inválidos');
        }
      })
      .then((data) => {
        // Autenticação bem-sucedida
        onLogin(data.username);
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <div className='tela-login'>
      <h2>Tela de Login</h2>
      <input
        className='input'
        type="text"
        placeholder="Usuário"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className='input'
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Entrar</button>
    </div>
  );
}

export default Login;