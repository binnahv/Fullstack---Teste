const API_URL = 'http://localhost:5002/api';


async function register() {
  const username = document.getElementById('register-username').value;
  const password = document.getElementById('register-password').value;

  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      alert('Registrado com sucesso! Faça login.');
      showLogin();
    } else {
      const errorData = await res.json();
      alert(errorData.message || 'Erro ao registrar');
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
    alert('Erro ao registrar');
  }
}


async function login() {
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('token', data.token);
      loadTasks();
    } else {
      alert(data.error || 'Login falhou');
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
    alert('Erro de rede ou servidor indisponível.');
  }
}


async function loadTasks() {
  document.getElementById('login-form').style.display = 'none';
  document.getElementById('register-form').style.display = 'none';
  document.getElementById('task-container').style.display = 'block';

  try {
    const res = await fetch(`${API_URL}/tasks`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    const tasks = await res.json();

    if (res.ok) {
      const taskList = document.getElementById('task-list');
      taskList.innerHTML = tasks
        .map(
          (task) => `
            <li>
              <span>${task.title}</span>
              <button onclick="editTask('${task._id}', '${task.title}')">Editar</button>
              <button onclick="deleteTask('${task._id}')">Deletar</button>
            </li>`
        )
        .join('');
    } else {
      alert('Erro ao carregar tarefas');
    }
  } catch (error) {
    console.error('Erro ao carregar tarefas:', error);
    alert('Erro ao carregar tarefas');
  }
}


async function addTask() {
  const title = document.getElementById('new-task').value;

  if (!title.trim()) {
    alert('O título da tarefa não pode ser vazio.');
    return;
  }

  try {
    const res = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ title }),
    });

    if (res.ok) {
      document.getElementById('new-task').value = ''; 
      loadTasks();
    } else {
      alert('Erro ao adicionar tarefa');
    }
  } catch (error) {
    console.error('Erro ao adicionar tarefa:', error);
    alert('Erro ao adicionar tarefa');
  }
}


async function editTask(id, oldTitle) {
  const newTitle = prompt('Edite a tarefa:', oldTitle);

  if (!newTitle || !newTitle.trim()) {
    alert('O título da tarefa não pode ser vazio.');
    return;
  }

  try {
    const res = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ title: newTitle }),
    });

    if (res.ok) {
      loadTasks();
    } else {
      alert('Erro ao editar a tarefa');
    }
  } catch (error) {
    console.error('Erro ao editar tarefa:', error);
    alert('Erro ao editar tarefa');
  }
}


async function deleteTask(id) {
  if (!confirm('Tem certeza que deseja deletar esta tarefa?')) return;

  try {
    const res = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (res.ok) {
      loadTasks();
    } else {
      alert('Erro ao deletar a tarefa');
    }
  } catch (error) {
    console.error('Erro ao deletar tarefa:', error);
    alert('Erro ao deletar tarefa');
  }
}


function showRegister() {
  document.getElementById('login-form').style.display = 'none';
  document.getElementById('register-form').style.display = 'block';
}


function showLogin() {
  document.getElementById('login-form').style.display = 'block';
  document.getElementById('register-form').style.display = 'none';
}
