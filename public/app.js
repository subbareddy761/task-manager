// DOM elements
const taskForm = document.getElementById('task-form');
const tasksList = document.getElementById('tasks-list');
const formTitle = document.getElementById('form-title');
const taskIdInput = document.getElementById('task-id');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const completedInput = document.getElementById('completed');
const cancelBtn = document.getElementById('cancel-btn');

// API URL
const API_URL = '/api/tasks';

// Event Listeners
document.addEventListener('DOMContentLoaded', getTasks);
taskForm.addEventListener('submit', saveTask);
cancelBtn.addEventListener('click', resetForm);

// Get all tasks from API and display them
async function getTasks() {
  try {
    const response = await fetch(API_URL);
    const tasks = await response.json();
    
    // Clear the tasks list
    tasksList.innerHTML = '';
    
    if (tasks.length === 0) {
      tasksList.innerHTML = '<p>No tasks found. Add one!</p>';
      return;
    }
    
    // Render each task
    tasks.forEach(task => {
      renderTask(task);
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    tasksList.innerHTML = '<p>Error loading tasks. Please try again.</p>';
  }
}

// Render a single task in the UI
function renderTask(task) {
  const taskElement = document.createElement('div');
  taskElement.classList.add('task-item');
  taskElement.innerHTML = `
    <div class="task-title">${task.title}</div>
    <div class="task-description">${task.description || 'No description'}</div>
    <div class="task-status ${task.completed ? 'completed' : 'pending'}">
      ${task.completed ? 'Completed' : 'Pending'}
    </div>
    <div class="task-actions">
      <button class="edit-btn" data-id="${task._id}">Edit</button>
      <button class="delete-btn" data-id="${task._id}">Delete</button>
    </div>
  `;
  
  // Add event listeners to buttons
  const editBtn = taskElement.querySelector('.edit-btn');
  const deleteBtn = taskElement.querySelector('.delete-btn');
  
  editBtn.addEventListener('click', () => editTask(task._id));
  deleteBtn.addEventListener('click', () => deleteTask(task._id));
  
  // Add to the DOM
  tasksList.appendChild(taskElement);
}

// Save task (create or update)
async function saveTask(e) {
  e.preventDefault();
  
  // Get form data
  const taskData = {
    title: titleInput.value,
    description: descriptionInput.value,
    completed: completedInput.checked
  };
  
  const taskId = taskIdInput.value;
  let url = API_URL;
  let method = 'POST';
  
  // If we have a task ID, we're updating an existing task
  if (taskId) {
    url = `${API_URL}/${taskId}`;
    method = 'PUT';
  }
  
  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(taskData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to save task');
    }
    
    // Reset form and refresh tasks list
    resetForm();
    getTasks();
  } catch (error) {
    console.error('Error saving task:', error);
    alert('Failed to save task. Please try again.');
  }
}

// Edit task - populate form with task data
async function editTask(taskId) {
  try {
    const response = await fetch(`${API_URL}/${taskId}`);
    const task = await response.json();
    
    // Populate form
    taskIdInput.value = task._id;
    titleInput.value = task.title;
    descriptionInput.value = task.description || '';
    completedInput.checked = task.completed;
    
    // Update UI
    formTitle.textContent = 'Edit Task';
    cancelBtn.style.display = 'block';
    
    // Scroll to form
    document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
  } catch (error) {
    console.error('Error fetching task details:', error);
    alert('Failed to load task details. Please try again.');
  }
}

// Delete task
async function deleteTask(taskId) {
  if (!confirm('Are you sure you want to delete this task?')) {
    return;
  }
  
  try {
    const response = await fetch(`${API_URL}/${taskId}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete task');
    }
    
    // Refresh tasks list
    getTasks();
  } catch (error) {
    console.error('Error deleting task:', error);
    alert('Failed to delete task. Please try again.');
  }
}

// Reset form to add new task
function resetForm() {
  taskForm.reset();
  taskIdInput.value = '';
  formTitle.textContent = 'Add New Task';
  cancelBtn.style.display = 'none';
}