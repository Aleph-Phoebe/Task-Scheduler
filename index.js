const apiUrl = "http://localhost:3000/tasks";

const taskInput = document.getElementById("task");
const priorityInput = document.getElementById("priority");
const deadlineInput = document.getElementById("deadline");
const addTaskButton = document.getElementById("add-task");
const taskList = document.getElementById("task-list");
const deleteBtn = document.getElementById("deleteBtn");
const editTaskButton = document.getElementById("edit-task");
let taskItemToEdit = null;

// Function to fetch tasks from server and add them
async function fetchAndRenderTasks() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const tasks = await response.json();
    renderTasks(tasks);
  } catch (error) {
    console.error("Error getting tasks:", error);
  }
}

// Function to add tasks from the server
function renderTasks(tasks) {
  taskList.innerHTML = "";
  tasks.forEach((task) => {
    const taskItem = createTaskElement(task);
    taskList.appendChild(taskItem);
  });
}

function createTaskElement(task) {
  const taskItem = document.createElement("div");
  taskItem.classList.add("task"); // Please create a task
  taskItem.dataset.taskId = task.id;
  taskItem.innerHTML = `
    <p>${task.task}</p>
    <p>Priority: ${task.priority}</p>
    <p>Deadline: ${task.deadline}</p>
    <button class="mark-done">Mark Done</button>
    <button class="mark-undone" style="display:none">Undone</button>
    <button class="edit-task">Edit Task</button>
    <button class="delete-task">Delete Task</button>
  `;
  return taskItem;
}

// Fetch tasks when the page loads
window.addEventListener("load", fetchAndRenderTasks);

// Add Task button event listener
addTaskButton.addEventListener("click", async () => {
  const task = taskInput.value;
  const priority = priorityInput.value;
  const deadline = deadlineInput.value;
  if (task.trim() === "" || deadline === "") {
    alert("Select a date for the task completion.");
    return;
  }

  const selectedDate = new Date(deadline);
  const currentDate = new Date();
  // Date should be in the present or the future
  if (selectedDate <= currentDate) {
    alert("Select a date for the task completion in the future.");
    return;
  }

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "json",
      },
      body: JSON.stringify({ task, priority, deadline }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    fetchAndRenderTasks(); // Fetch and output tasks after adding new task

    taskInput.value = "";
    priorityInput.value = "top";
    deadlineInput.value = "";
  } catch (error) {
    console.error("Error adding task:", error);
  }
});

// Edit and Delete Task button event listener using event listener
taskList.addEventListener("click", async (event) => {
  const taskItem = event.target.closest(".task");
  if (!taskItem) return;
  const taskId = taskItem.dataset.taskId;
  if (event.target.classList.contains("edit-task")) {
    const taskText = taskItem.querySelector("p:first-child").textContent;
    const priorityText = taskItem
      .querySelector("p:nth-child(2)")
      .textContent.split(": ")[1];
    const deadlineText = taskItem
      .querySelector("p:nth-child(3)")
      .textContent.split(": ")[1];

    taskInput.value = taskText;
    priorityInput.value = priorityText;
    deadlineInput.value = deadlineText;

    addTaskButton.style.display = "none";
    editTaskButton.style.display = "inline-block";
    taskItemToEdit = taskItem;
  }

  if (event.target.classList.contains("mark-done")) {
    try {
      const response = await fetch(`${apiUrl}/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "json",
        },
        body: JSON.stringify({ done: true }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      fetchAndRenderTasks(); // After marking done and show undefined
    } catch (error) {
      console.error("Error marking task as done:", error);
    }
  }

  if (event.target.classList.contains("mark-undone")) {
    try {
      const response = await fetch(`${apiUrl}/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ done: false }), // Assuming your server expects done
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      fetchAndRenderTasks(); // Fetch and render tasks after marking undone
    } catch (error) {
      console.error("Error marking task as undone:", error);
    }
  }

  if (event.target.classList.contains("delete-task")) {
    try {
      const response = await fetch(`${apiUrl}/${taskId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      taskItem.remove(); // Remove task from UI after deleting from server
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  }
});

// Update Task button event listener
editTaskButton.addEventListener("click", async () => {
  const editedTask = taskInput.value;
  const editedPriority = priorityInput.value;
  const editedDeadline = deadlineInput.value;
  const taskId = taskItemToEdit.dataset.taskId;

  if (editedTask.trim() === "" || editedDeadline === "") {
    alert("Select a date for the task completion.");
    return;
  }

  const selectedDate = new Date(editedDeadline);
  const currentDate = new Date();
  // Date has to be in the present or the future
  if (selectedDate <= currentDate) {
    alert("Select a date for the task completion in the future.");
    return;
  }

  try {
    const response = await fetch(`${apiUrl}/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "json",
      },
      body: JSON.stringify({
        task: editedTask,
        priority: editedPriority,
        deadline: editedDeadline,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    fetchAndRenderTasks(); // Fetch and render tasks after updating task

    taskInput.value = "";
    priorityInput.value = "top";
    deadlineInput.value = "";
    addTaskButton.style.display = "inline-block";
    editTaskButton.style.display = "none";

    taskItemToEdit = null;
  } catch (error) {
    console.error("Error updating task:", error);
  }
});

// Delete Task button event listener
deleteBtn.addEventListener("click", async () => {
  const tasks = taskList.querySelectorAll(".task");
  tasks.forEach(async (task) => {
    const markDoneBtn = task.querySelector(".mark-done");
    if (markDoneBtn.disabled) {
      const taskId = task.dataset.taskId;

      try {
        const response = await fetch(`${apiUrl}/${taskId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        task.remove(); // Remove task from server after deleting
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
  });
});
