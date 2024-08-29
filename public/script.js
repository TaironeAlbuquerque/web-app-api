if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('sw.js');
    });
}
document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');
    let editingTaskId = null;
  
    // Função para carregar tarefas
    const loadTasks = async () => {
      const response = await fetch('http://localhost:5000/api/tasks');
      const tasks = await response.json();
      taskList.innerHTML = '';
      tasks.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `
          <span>${task.title} - ${task.description}</span>
          <button class="complete-btn ${task.completed ? 'completed' : ''}" onclick="toggleCompleted('${task._id}', ${!task.completed})">
            ${task.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
          </button>
          <button class="edit-btn" onclick="editTask('${task._id}', '${task.title}', '${task.description}')">
            Edit
          </button>
          <button onclick="deleteTask('${task._id}')">Delete</button>
        `;
        taskList.appendChild(li);
      });
    };
  
    // Função para adicionar ou atualizar uma tarefa
    taskForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = document.getElementById('title').value;
      const description = document.getElementById('description').value;
  
      const url = editingTaskId 
        ? `http://localhost:5000/api/tasks/${editingTaskId}` 
        : 'http://localhost:5000/api/tasks';
  
      const method = editingTaskId ? 'PUT' : 'POST';
  
      await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
      });
  
      editingTaskId = null;
      taskForm.reset();
      loadTasks();
    });
  
    // Função para editar uma tarefa
    window.editTask = (id, title, description) => {
      editingTaskId = id;
      document.getElementById('title').value = title;
      document.getElementById('description').value = description;
      document.querySelector('button[type="submit"]').textContent = 'Update Task';
    };
  
    // Função para marcar tarefa como concluída/incompleta
    window.toggleCompleted = async (id, completed) => {
      await fetch(`http://localhost:5000/api/tasks/${id}/completed`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed }),
      });
      loadTasks();
    };
  
    // Função para deletar uma tarefa
    window.deleteTask = async (id) => {
      await fetch(`http://localhost:5000/api/tasks/${id}`, { method: 'DELETE' });
      loadTasks();
    };
  
    // Carregar as tarefas na inicialização
    loadTasks();
  });
  
  