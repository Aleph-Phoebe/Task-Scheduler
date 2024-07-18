const taskInput = document.getElementById("task");
const priorityInput = document.getElementById("priority");
const deadlineInput = document.getElementById("deadline");
const addTaskButton = document.getElementById("add-task");
const taskList = document.getElementById("task-list");
const deleteBtn = document.getElementById("deleteBtn");

addTaskButton.addEventListener("click", () => {
  const task = taskInput.value;
  const priority = priorityInput.value;
  const deadline = deadlineInput.value;
  if (task.trim() === "" || deadline === "") {
    alert("Select a date for the task completion.");
    return; // If date is empty don't add a task
  }

  const selectedDate = new Date(deadline);
  const currentDate = new Date();

  if (selectedDate <= currentDate) {
    alert("Select a date for the task completion in the future.");
    return; // If date is for the past don't add task
  }

  const taskItem = document.createElement("div");
  taskItem.classList.add("task");
  taskItem.innerHTML = `
    <p>${task}</p>
    <p>Priority: ${priority}</p>
    <p>Deadline: ${deadline}</p>
    <button class="mark-done">Mark Done</button>
    <button class="mark-undone" style="display:none">Undone</button>
  `;

  taskList.appendChild(taskItem);

  taskInput.value = "";
  priorityInput.value = "top";
  deadlineInput.value = "";
});

taskList.addEventListener("click", (event) => {
  if (event.target.classList.contains("mark-done")) {
    const taskItem = event.target.parentElement;
    taskItem.style.backgroundColor = "#f2f2f2";
    event.target.disabled = true;
    event.target.nextElementSibling.style.display = "inline-block";
  }

  if (event.target.classList.contains("mark-undone")) {
    const taskItem = event.target.parentElement;
    taskItem.style.backgroundColor = "";
    event.target.style.display = "none";
    taskItem.querySelector(".mark-done").disabled = false;
  }
});


deleteBtn.addEventListener("click", () => {
  const tasks = taskList.querySelectorAll(".task");
  tasks.forEach((task) => {
    const markDoneBtn = task.querySelector(".mark-done");
    if (markDoneBtn.disabled) {
      task.remove(); // A task cannot be deleted unless it is marked done
    }
  });
});
