if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('sw.js');
    });
}
document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const taskForm = document.getElementById('task-form');
  const taskInput = document.getElementById('task-input');
  const taskList = document.getElementById('task-list');

  const token = localStorage.getItem('token');

  if (!token) {
      document.getElementById('auth').style.display = 'block';
  } else {
      loadTasks();
      document.getElementById('task-manager').style.display = 'block';
  }

  registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('register-name').value;
      const email = document.getElementById('register-email').value;
      const password = document.getElementById('register-password').value;

      try {
          await fetch('/api/auth/register', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ name, email, password })
          });
          alert('Registro bem-sucedido, agora faça login');
      } catch (err) {
          alert('Erro ao registrar');
      }
  });

  loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;

      try {
          const response = await fetch('/api/auth/login', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ email, password })
          });
          const data = await response.json();
          localStorage.setItem('token', data.token);
          location.reload();
      } catch (err) {
          alert('Erro ao fazer login');
      }
  });

  taskForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = taskInput.value;

      try {
          await fetch('/api/tasks', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({ title })
          });
          taskInput.value = '';
          loadTasks();
      } catch (err) {
          alert('Erro ao adicionar tarefa');
      }
  });

  taskList.addEventListener('click', async (e) => {
      if (e.target.classList.contains('edit')) {
          const li = e.target.parentElement;
          const title = prompt('Editar tarefa:', li.querySelector('span').textContent);

          if (title) {
              try {
                  await fetch(`/api/tasks/${li.dataset.id}`, {
                      method: 'PUT',
                      headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${localStorage.getItem('token')}`
                      },
                      body: JSON.stringify({ title })
                  });
                  loadTasks();
              } catch (err) {
                  alert('Erro ao editar tarefa');
              }
          }
      }

      if (e.target.classList.contains('delete')) {
          const li = e.target.parentElement;

          try {
              await fetch(`/api/tasks/${li.dataset.id}`, {
                  method: 'DELETE',
                  headers: {
                      'Authorization': `Bearer ${localStorage.getItem('token')}`
                  }
              });
              loadTasks();
          } catch (err) {
              alert('Erro ao deletar tarefa');
          }
      }

      if (e.target.classList.contains('toggle')) {
          const li = e.target.parentElement;
          const completed = !li.classList.contains('completed');

          try {
              await fetch(`/api/tasks/${li.dataset.id}`, {
                  method: 'PUT',
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${localStorage.getItem('token')}`
                  },
                  body: JSON.stringify({ completed })
              });
              loadTasks();
          } catch (err) {
              alert('Erro ao marcar tarefa');
          }
      }
  });

  async function loadTasks() {
      try {
          const response = await fetch('/api/tasks', {
              headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
          });
          const tasks = await response.json();
          taskList.innerHTML = '';

          tasks.forEach(task => {
              const li = document.createElement('li');
              li.dataset.id = task._id;
              li.classList.add(task.completed ? 'completed' : '');

              li.innerHTML = `
                  <span>${task.title}</span>
                  <button class="toggle">${task.completed ? 'Desmarcar' : 'Marcar'}</button>
                  <button class="edit">Editar</button>
                  <button class="delete">Deletar</button>
              `;
              taskList.appendChild(li);
          });
      } catch (err) {
          alert('Erro ao carregar tarefas');
      }
  }
});
