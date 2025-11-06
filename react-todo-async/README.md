---

# 📝 React Todo App

A simple React-based Todo List application built to demonstrate React fundamentals — Components, Props, State, and Hooks (`useState`, `useEffect`).
This app allows users to **add, remove, and toggle** task completion status interactively.

---

## 🚀 Features

* Add new tasks
* Mark tasks as completed/incomplete
* Delete tasks
* Persistent state using browser memory (optional)

---

## 🧰 Tech Stack

* **Frontend:** React.js (Vite or Create React App)
* **Language:** JavaScript (ES6+)
* **Styling:** CSS / Tailwind (optional)

---

## 🧩 Prerequisites

Before you begin, ensure you have installed:

* [Node.js](https://nodejs.org/) (v18 or later)
* npm (comes with Node)

---

## ⚙️ Installation Steps

### 1. Create a React Project

You can use either **Vite** or **Create React App**:

#### Option A — Using Vite (recommended)

```bash
npm create vite@latest react-todo-app --template react
cd react-todo-app
npm install
```

#### Option B — Using Create React App

```bash
npx create-react-app react-todo-app
cd react-todo-app
```

---

### 2. Create Component Structure

Inside `src/`, create the following files:

```
src/
 ├── components/
 │    ├── TodoInput.jsx
 │    ├── TodoList.jsx
 │    └── TodoItem.jsx
 ├── App.jsx
 ├── index.css
 └── main.jsx
```

---

### 3. Implement Components

#### `App.jsx`

```jsx
import React, { useState } from 'react';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import './App.css';

export default function App() {
  const [todos, setTodos] = useState([]);

  const addTodo = (task) => {
    if (task.trim() === '') return;
    setTodos([...todos, { id: Date.now(), text: task, completed: false }]);
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="app-container">
      <h1>React Todo App ✅</h1>
      <TodoInput onAdd={addTodo} />
      <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
    </div>
  );
}
```

#### `TodoInput.jsx`

```jsx
import React, { useState } from 'react';

export default function TodoInput({ onAdd }) {
  const [task, setTask] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(task);
    setTask('');
  };

  return (
    <form onSubmit={handleSubmit} className="todo-input">
      <input
        type="text"
        placeholder="Add a new task..."
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />
      <button type="submit">Add</button>
    </form>
  );
}
```

#### `TodoList.jsx`

```jsx
import React from 'react';
import TodoItem from './TodoItem';

export default function TodoList({ todos, onToggle, onDelete }) {
  return (
    <ul className="todo-list">
      {todos.length === 0 ? <p>No tasks yet!</p> :
        todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        ))
      }
    </ul>
  );
}
```

#### `TodoItem.jsx`

```jsx
import React from 'react';

export default function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <span onClick={() => onToggle(todo.id)}>{todo.text}</span>
      <button onClick={() => onDelete(todo.id)}>❌</button>
    </li>
  );
}
```

---

### 4. Basic Styling (`App.css`)

```css
.app-container {
  text-align: center;
  margin-top: 50px;
  font-family: sans-serif;
}

.todo-input {
  display: flex;
  justify-content: center;
  margin: 20px;
}

.todo-input input {
  padding: 8px;
  width: 200px;
}

.todo-input button {
  margin-left: 10px;
  padding: 8px 12px;
}

.todo-list {
  list-style: none;
  padding: 0;
}

.todo-item {
  margin: 10px;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.todo-item.completed span {
  text-decoration: line-through;
  color: gray;
}
```

---

## 🧪 Testing the App

### 1. Run the development server

```bash
npm run dev
```

### 2. Open in Browser

Navigate to 👉 `http://localhost:5173/` (for Vite) or `http://localhost:3000/` (for Create React App)

### 3. Test Functionality

✅ Add tasks
✅ Click task text to toggle completion
✅ Click ❌ button to delete tasks

---

## 🧱 Folder Structure (Final)

```
react-todo-app/
├── src/
│   ├── components/
│   │   ├── TodoInput.jsx
│   │   ├── TodoList.jsx
│   │   └── TodoItem.jsx
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── package.json
└── README.md
```

---

## 💡 Future Improvements

* Add persistent storage (localStorage)
* Edit existing tasks
* Add filters (All / Completed / Pending)
