document.addEventListener('DOMContentLoaded', () => {
    const taskList = document.getElementById('taskList');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskInput = document.getElementById('taskInput');
    const dueDateInput = document.getElementById('dueDateInput');
    const taskCount = document.getElementById('taskCount');

    // Carregar tarefas
    const loadTasks = async () => {
        const response = await fetch('http://localhost:3000/api/tasks');
        const tasks = await response.json();
        taskList.innerHTML = '';
        let count = tasks.length;
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.innerHTML = `<span>${task.name} - Entrega: ${new Date(task.dueDate).toLocaleDateString()}</span>
                            <button onclick="deleteTask('${task._id}')">Excluir</button>`;
            taskList.appendChild(li);
        });
        taskCount.textContent = count;
    };

    // Adicionar tarefa
    addTaskBtn.addEventListener('click', async () => {
        const name = taskInput.value.trim();
        const dueDate = dueDateInput.value;
        if (name && dueDate) {
            await fetch('http://localhost:3000/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, dueDate })
            });
            taskInput.value = '';
            dueDateInput.value = '';
            loadTasks();
        }
    });

    // Deletar tarefa
    window.deleteTask = async (id) => {
        await fetch(`http://localhost:3000/api/tasks/${id}`, { method: 'DELETE' });
        loadTasks();
    };

    loadTasks();
});
