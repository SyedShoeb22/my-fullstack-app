// src/components/TodoItem.jsx
import React from "react";

export default function TodoItem({ todo, onToggle, onDelete, disabled }) {
  return (
    <li style={{ display: "flex", gap: 12, alignItems: "center", padding: 8 }}>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={() => onToggle(todo)}
        disabled={disabled}
      />
      <span style={{ textDecoration: todo.done ? "line-through" : "none", flex: 1 }}>
        {todo.text}
      </span>
      <button onClick={() => onDelete(todo)} disabled={disabled}>
        Delete
      </button>
    </li>
  );
}
