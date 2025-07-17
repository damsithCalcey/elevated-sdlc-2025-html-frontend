// Get references to input, button, and list
const input = document.getElementById("todoInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("todoList");

// When "Add" button is clicked
addBtn.addEventListener("click", () => {
  const task = input.value.trim();

  if (task !== "") {
    // Create a new <li> element
    const listItem = document.createElement("li");
    listItem.textContent = task;

    // Add it to the list
    list.appendChild(listItem);

    // Clear the input
    input.value = "";
  }
});
