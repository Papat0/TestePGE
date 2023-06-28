import React, { useEffect, useState } from 'react';

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const response = await fetch('http://localhost:3000/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.error('Erro ao obter os usuários:', response.status);
      }
    } catch (error) {
      console.error('Erro ao obter os usuários:', error);
    }
  };

  return (
    <div>
      <h1>Lista de Usuários</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            Username: {user.username}, Role: {user.role}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
