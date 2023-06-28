import React, { useState } from 'react';

function Dashboard({ username, onLogout }) {
  const [selectedBox, setSelectedBox] = useState('Entrada');

  const handleBoxSelection = (box) => {
    setSelectedBox(box);
  };

  return (
    <div>
      <h2>Bem-vindo(a), {username}!</h2>
      <button onClick={onLogout}>Sair</button>

      <h3>Selecione uma caixa:</h3>
      <button onClick={() => handleBoxSelection('Entrada')}>Entrada</button>
      <button onClick={() => handleBoxSelection('Saída')}>Saída</button>
      <button onClick={() => handleBoxSelection('Arquivados')}>Arquivados</button>

      <h4>Caixa selecionada: {selectedBox}</h4>

      {/* Aqui você pode exibir os processos correspondentes à caixa selecionada */}
    </div>
  );
}

export default Dashboard;