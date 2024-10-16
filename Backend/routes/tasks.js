const express = require('express');
const Task = require('../models/Task');
const authenticateToken = require('../middleware/auth'); // Importação corrigida
const router = express.Router();

// Criar nova tarefa
router.post('/', authenticateToken, async (req, res) => {
  const { title } = req.body;
  try {
    const task = new Task({ title, userId: req.user.userId });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar tarefa' });
  }
});

// Listar tarefas por usuário
router.get('/', authenticateToken, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.userId });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar tarefas' });
  }
});

// Editar tarefa por ID
router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  try {
    const task = await Task.findByIdAndUpdate(id, { title }, { new: true });

    if (!task) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao editar tarefa' });
  }
});

// Deletar tarefa por ID
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }

    res.json({ message: 'Tarefa deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar tarefa' });
  }
});

module.exports = router;
