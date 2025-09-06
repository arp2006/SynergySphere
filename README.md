# SynergySphere

<!DOCTYPE html><html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>To-Do List</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #f4f7f9;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
    }
    .todo-container {
      background: #fff;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      width: 350px;
    }
    h2 {
      text-align: center;
      color: #333;
    }
    .input-section {
      display: flex;
      gap: 10px;
    }
    input[type="text"] {
      flex: 1;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 6px;
    }
    button {
      padding: 10px 15px;
      background: #28a745;
      border: none;
      color: white;
      font-weight: bold;
      border-radius: 6px;
      cursor: pointer;
      transition: 0.3s;
    }
    button:hover {
      background: #218838;
    }
    ul {
      list-style: none;
      padding: 0;
      margin-top: 20px;
    }
    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      background: #f1f1f1;
      margin-bottom: 8px;
      border-radius: 6px;
    }
    .delete-btn {
      background: #dc3545;
      border: none;
      padding: 6px 10px;
      border-radius: 6px;
      color: white;
      cursor: pointer;
      transition: 0.3s;
    }
    .delete-btn:hover {
      background: #c82333;
    }
  </style>
</head>
<body>
  <div class="todo-container">
    <h2>📝 To-Do List</h2>
    <div class="input-section">
      <input type="text" id="taskInput" placeholder="Add a new task...">
      <button onclick="addTask()">Add</button>
    </div>
    <ul id="taskList"></ul>
  </div>  <script>
    function addTask() {
      let taskInput = document.getElementById("taskInput");
      let taskText = taskInput.value.trim();

      if (task
