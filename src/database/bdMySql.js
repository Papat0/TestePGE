const mysql = require('mysql');
const fs = require('fs');

// Configuração do banco de dados
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  port: '3306',
  password: '@marcel147',
  database: 'bancotestepratico',
});

// Ler o arquivo JSON com os dados
const data = JSON.parse(fs.readFileSync('dados.json', 'utf8'));

// Criar tabelas
connection.connect((err) => {
  if (err) throw err;
  console.log('Conexão estabelecida.');

  // Tabela de usuários
  const usersTable =
    'CREATE TABLE IF NOT EXISTS users (' +
    'id INT AUTO_INCREMENT PRIMARY KEY,' +
    'username VARCHAR(255) NOT NULL,' +
    'password VARCHAR(255) NOT NULL,' +
    'role ENUM("procurador","assessor") NOT NULL' +
    ')';

  // Tabela de processos
  const processesTable =
    'CREATE TABLE IF NOT EXISTS processes (' +
    'id INT AUTO_INCREMENT PRIMARY KEY,' +
    'title VARCHAR(255) NOT NULL,' +
    'description TEXT NOT NULL,' +
    'createdBy INT NOT NULL,' +
    'FOREIGN KEY (createdBy) REFERENCES users(id)' +
    ')';

  // Executar criação das tabelas
  connection.query(usersTable, (err) => {
    if (err) throw err;
    console.log('Tabela de usuários criada com sucesso.');
  });

  connection.query(processesTable, (err) => {
    if (err) throw err;
    console.log('Tabela de processos criada com sucesso.');
  });

  // Inserir dados nos usuários
  const users = data.users;
  const usersInsert = 'INSERT INTO users (username, password, role) VALUES ?';
  const usersValues = users.map((user) => [
    user.username,
    user.password,
    user.role,
  ]);

  connection.query(usersInsert, [usersValues], (err) => {
    if (err) throw err;
    console.log('Dados de usuários inseridos com sucesso.');
  });

  // Inserir dados nos processos
  const processes = data.processes;
  const processesInsert =
    'INSERT INTO processes (title, description, createdBy) VALUES ?';
  const processesValues = processes.map((process) => [
    process.title,
    process.description,
    process.createdBy,
  ]);

  connection.query(processesInsert, [processesValues], (err) => {
    if (err) throw err;
    console.log('Dados de processos inseridos com sucesso.');
  });

  // Encerrar conexão
  connection.end((err) => {
    if (err) throw err;
    console.log('Conexão encerrada.');
  });
});
