// src/components/TodoList.jsx
import React, { useEffect, useState, useRef } from "react";
import Spinner from "./Spinner";
import TodoItem from "./TodoItem";
import {
  fetchTodos,
  addTodoApi,
  toggleTodoApi,
  deleteTodoApi,
} from "../api";

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adding, setAdding] = useState(false);
  const [text, setText] = useState("");
  const pendingOps = useRef(new Set()); // track ids of optimistic operations (UI lock)
  const controllerRef = useRef(null);

  // Load initial todos (useEffect + async/await + cleanup)
  useEffect(() => {
    const controller = new AbortController();
    controllerRef.current = controller;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchTodos({ signal: controller.signal });
        setTodos(data);
      } catch (err) {
        if (err.name === "AbortError") {
          // ignore — unmounted
          return;
        }
        setError(err.message || "Unknown error while loading todos");
      } finally {
        setLoading(false);
      }
    }

    load();

    // cleanup on unmount
    return () => {
      controller.abort();
    };
  }, []); // empty deps: run once on mount

  // retry helper
  const retryLoad = async () => {
    setLoading(true);
    setError(null);
    try {
      const controller = new AbortController();
      controllerRef.current = controller;
      const data = await fetchTodos({ signal: controller.signal });
      setTodos(data);
    } catch (err) {
      if (err.name === "AbortError") return;
      setError(err.message || "Unknown error while loading todos");
    } finally {
      setLoading(false);
    }
  };

  // optimistic add
  const handleAdd = async (e) => {
    e?.preventDefault?.();
    const trimmed = text.trim();
    if (!trimmed) return;
    setAdding(true);
    setError(null);
    // optimistic todo with temporary negative id
    const tempId = -Date.now();
    const optimistic = { id: tempId, text: trimmed, done: false };
    setTodos((t) => [optimistic, ...t]);
    setText("");

    try {
      const real = await addTodoApi({ text: trimmed });
      setTodos((current) => current.map((it) => (it.id === tempId ? real : it)));
    } catch (err) {
      // roll back: remove optimistic
      setTodos((current) => current.filter((it) => it.id !== tempId));
      setError(err.message || "Failed to add todo");
    } finally {
      setAdding(false);
    }
  };

  // toggle with simple UI lock for the item
  const handleToggle = async (todo) => {
    pendingOps.current.add(todo.id);
    setTodos((t) => t.map((it) => (it.id === todo.id ? { ...it, done: !it.done } : it)));
    try {
      await toggleTodoApi({ id: todo.id });
    } catch (err) {
      // revert toggle on failure
      setTodos((t) => t.map((it) => (it.id === todo.id ? { ...it, done: !it.done } : it)));
      setError(err.message || "Failed to toggle todo");
    } finally {
      pendingOps.current.delete(todo.id);
      // force re-render by updating a dummy state (but here we setTodos to same array to trigger re-render)
      setTodos((t) => [...t]);
    }
  };

  // optimistic delete: hide immediately, but restore on failure
  const handleDelete = async (todo) => {
    const backup = todos;
    setTodos((t) => t.filter((it) => it.id !== todo.id));
    try {
      await deleteTodoApi({ id: todo.id });
    } catch (err) {
      setTodos(backup); // restore
      setError(err.message || "Failed to delete todo");
    }
  };

  return (
    <div style={{ maxWidth: 640, margin: "24px auto", padding: 16 }}>
      <h2>Async Todo (Promises & async/await)</h2>

      <form onSubmit={handleAdd} style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          placeholder="New task..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={adding}
          style={{ flex: 1 }}
        />
        <button type="submit" disabled={adding}>
          {adding ? "Adding..." : "Add"}
        </button>
      </form>

      {loading ? (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Spinner />
          <div>Loading tasks...</div>
        </div>
      ) : error ? (
        <div style={{ color: "crimson" }}>
          <div>Error: {error}</div>
          <div style={{ marginTop: 8 }}>
            <button onClick={retryLoad}>Retry</button>
          </div>
        </div>
      ) : todos.length === 0 ? (
        <div>No tasks. Add one above.</div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleToggle}
              onDelete={handleDelete}
              disabled={pendingOps.current.has(todo.id)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
