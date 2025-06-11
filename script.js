document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const taskCount = document.getElementById('taskCount');
    const clearCompletedBtn = document.getElementById('clearCompletedBtn');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Focus the input field on page load
    taskInput.focus();

    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const updateTaskCount = () => {
        const pendingTasks = tasks.filter(task => !task.completed).length;
        taskCount.textContent = pendingTasks;
        // Show/hide clear completed button based on if there are completed tasks
        if (tasks.some(task => task.completed)) {
            clearCompletedBtn.style.display = 'inline-block';
        } else {
            clearCompletedBtn.style.display = 'none';
        }
    };

    const renderTasks = () => {
        taskList.innerHTML = ''; // Clear existing tasks

        if (tasks.length === 0) {
            const emptyStateDiv = document.createElement('div');
            emptyStateDiv.className = 'empty-state-message';
            emptyStateDiv.textContent = 'No tasks yet. Add one above!';
            taskList.appendChild(emptyStateDiv);
        } else {
            tasks.forEach((task, index) => {
                const li = document.createElement('li');
                li.className = task.completed ? 'completed' : '';
                // Make list items focusable for accessibility
                li.setAttribute('tabindex', '0');


                if (task.isNew) {
                    li.classList.add('new-item-animation');
                    setTimeout(() => {
                        li.classList.remove('new-item-animation');
                        delete task.isNew;
                    }, 300);
                }

                const taskText = document.createElement('span');
                taskText.className = 'task-text';
                taskText.textContent = task.text;
                taskText.addEventListener('click', () => toggleComplete(index));
                // Allow toggling completion with Enter key when list item is focused
                li.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter' && document.activeElement === li) {
                        toggleComplete(index);
                    }
                });


                const actionsDiv = document.createElement('div');
                actionsDiv.className = 'actions';

                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'delete-btn';
                deleteBtn.textContent = 'Delete';
                deleteBtn.setAttribute('aria-label', `Delete task: ${task.text}`); // Accessibility
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    deleteTask(index);
                });

                actionsDiv.appendChild(deleteBtn);
                li.appendChild(taskText);
                li.appendChild(actionsDiv);
                taskList.appendChild(li);
            });
        }
        updateTaskCount();
        saveTasks();
    };

    const addTask = () => {
        const text = taskInput.value.trim();
        if (text) {
            tasks.push({ text: text, completed: false, isNew: true });
            taskInput.value = '';
            renderTasks();
            taskInput.focus(); // Keep focus on input after adding
        } else {
            alert("Please enter a task!");
        }
    };

    const toggleComplete = (index) => {
        if(tasks[index]) { // Check if task exists
            tasks[index].completed = !tasks[index].completed;
            renderTasks();
        }
    };

    const deleteTask = (index) => {
        tasks.splice(index, 1);
        renderTasks();
        taskInput.focus(); // Return focus to input after deleting for better flow
    };

    const clearCompleted = () => {
        tasks = tasks.filter(task => !task.completed);
        renderTasks();
    };

    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });
    clearCompletedBtn.addEventListener('click', clearCompleted);

    renderTasks(); // Initial render
});
