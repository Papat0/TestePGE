const express = require('express');
const mysql = require('mysql');
const cors = require('cors');


const app = express();
app.use(express.json());


const corsOptions = {
  origin: 'http://localhost:3001', // Pode alterar para '*' englobando todo mundo
  optionsSuccessStatus: 200 // Algumas versões de navegadores podem enviar uma solicitação de opções antes da solicitação real, então é bom responder a ela com 200.
};

app.use(cors(corsOptions));

// Configuração do banco de dados
const dbConfig = {
  host: '127.0.0.1',
  user: 'root',
  port: '3306',
  password: '@marcel147',
  database: 'bancotestepratico',
};

const connection = mysql.createConnection(dbConfig);

app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});


// Endpoint para criar um usuário (procurador ou assessor)
app.post('/users', (req, res) => {
  const { username, password, role } = req.body;

  connection.query(
    'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
    [username, password, role],
    (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao criar o usuário.' });
      }

      return res.status(201).json({ id: results.insertId });
    }
  );
});

// Endpoint para buscar usuários (procurador ou assessor)
app.get('/users', (req, res) => {
  connection.query('SELECT * FROM users', (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao obter os usuários.' });
    }

    const serializedResults = JSON.parse(JSON.stringify(results));
    return res.json(serializedResults);
  });
});


// Endpoint para autenticar um usuário (login)
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  connection.query(
    'SELECT id, role FROM users WHERE username = ? AND password = ?',
    [username, password],
    (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao realizar o login.' });
      }

      if (results.length === 0) {
        return res.status(401).json({ error: 'Credenciais inválidas.' });
      }

      const user = results[0];
      return res.json({ id: user.id, role: user.role });
    }
  );
});

// Endpoint para criar um processo judicial
app.post('/processes', (req, res) => {
  const { title, description } = req.body;

  connection.query(
    'INSERT INTO processes (title, description) VALUES (?, ?)',
    [title, description],
    (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao criar o processo.' });
      }

      return res.status(201).json({ id: results.insertId });
    }
  );
});

// Endpoint para atualizar um processo judicial
app.put('/processes/:id', (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  connection.query(
    'UPDATE processes SET title = ?, description = ? WHERE id = ?',
    [title, description, id],
    (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao atualizar o processo.' });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ error: 'Processo não encontrado.' });
      }

      return res.json({ message: 'Processo atualizado com sucesso.' });
    }
  );
});

// Endpoint para excluir logicamente um processo judicial
app.delete('/processes/:id', (req, res) => {
  const { id } = req.params;

  connection.query(
    'UPDATE processes SET arquivado = 1 WHERE id = ?',
    [id],
    (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao excluir o processo.' });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ error: 'Processo não encontrado.' });
      }

      return res.json({ message: 'Processo excluído com sucesso.' });
    }
  );
});

// Endpoint para realizar a tramitação de um processo judicial
app.post('/processes/:id/tramitacao', (req, res) => {
  const { id } = req.params;
  const { origem, destino } = req.body;

  connection.beginTransaction((error) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao iniciar a transação.' });
    }

    connection.query(
      'UPDATE processes SET origem = ?, destino = ? WHERE id = ?',
      [origem, destino, id],
      (error, results) => {
        if (error) {
          console.error(error);
          connection.rollback(() => {
            res.status(500).json({ error: 'Erro ao tramitar o processo.' });
          });
        }

        connection.commit((error) => {
          if (error) {
            console.error(error);
            connection.rollback(() => {
              res.status(500).json({ error: 'Erro ao confirmar a transação.' });
            });
          }

          res.json({ message: 'Processo tramitado com sucesso.' });
        });
      }
    );
  });
});

// Endpoint para arquivar ou desarquivar um processo judicial
app.put('/processes/:id/arquivar', (req, res) => {
  const { id } = req.params;
  const { arquivado } = req.body;

  connection.query(
    'UPDATE processes SET arquivado = ? WHERE id = ?',
    [arquivado, id],
    (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao atualizar o processo.' });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ error: 'Processo não encontrado.' });
      }

      return res.json({ message: 'Processo atualizado com sucesso.' });
    }
  );
});

app.listen(3000, () => {
  console.log('API server is running on http://localhost:3000');
});
