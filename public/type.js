const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const taskCount = document.getElementById('task-count');
const emptyMessage = document.getElementById('empty-message');

async function loadTasks() {
  try {
    const response = await fetch('/api/tasks');
    const tasks = await response.json();
    renderTasks(tasks);
  } catch (error) {
    console.error('Помилка завантаження завдань:', error);
  }
}

function renderTasks(tasks) {
  taskList.innerHTML = '';
  taskCount.textContent = tasks.length;
  emptyMessage.style.display = tasks.length === 0 ? 'block' : 'none';

  tasks.forEach((task) => {
    const li = document.createElement('li');
    li.className = 'task-item';

    const leftPart = document.createElement('div');

    const idSpan = document.createElement('span');
    idSpan.className = 'task-id';
    idSpan.textContent = `#${task.id}`;

    const titleSpan = document.createElement('span');
    titleSpan.className = 'task-title';
    titleSpan.textContent = task.title;

    leftPart.append(idSpan, titleSpan);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Видалити';
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    li.append(leftPart, deleteBtn);
    taskList.appendChild(li);
  });
}

taskForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const title = taskInput.value.trim();
  if (!title) return;

  try {
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title }),
    });

    if (response.ok) {
      taskInput.value = '';
      await loadTasks();
    }
  } catch (error) {
    console.error('Помилка додавання завдання:', error);
  }
});

async function deleteTask(id) {
  try {
    const response = await fetch(`/api/tasks/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      await loadTasks();
    }
  } catch (error) {
    console.error('Помилка видалення завдання:', error);
  }
}

loadTasks();