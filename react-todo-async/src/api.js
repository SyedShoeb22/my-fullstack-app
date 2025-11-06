// src/api.js
// A small fake API for todos. Each function returns a Promise to simulate network calls.
// Internally we use a delay and sometimes inject an error for demonstration.

let fakeDB = [
  { id: 1, text: "Buy milk", done: false },
  { id: 2, text: "Read React docs", done: true },
  { id: 3, text: "Walk the dog", done: false }
];

const randomFail = (chance = 0.12) => Math.random() < chance;

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export async function fetchTodos({ signal } = {}) {
  // support AbortController.signal by checking signal.aborted
  await delay(800 + Math.random() * 700);
  if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
  if (randomFail(0.08)) return Promise.reject(new Error("Network error while fetching todos"));
  // Return a clone so caller can't mutate our fakeDB reference
  return JSON.parse(JSON.stringify(fakeDB));
}

export async function addTodoApi({ text, signal } = {}) {
  await delay(300 + Math.random() * 300);
  if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
  if (!text) return Promise.reject(new Error("Invalid todo text"));
  if (randomFail(0.06)) return Promise.reject(new Error("Failed to add todo"));
  const id = Math.max(0, ...fakeDB.map((t) => t.id)) + 1;
  const newTodo = { id, text, done: false };
  fakeDB.push(newTodo);
  return JSON.parse(JSON.stringify(newTodo));
}

export async function toggleTodoApi({ id, signal } = {}) {
  await delay(200 + Math.random() * 300);
  if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
  const todo = fakeDB.find((t) => t.id === id);
  if (!todo) return Promise.reject(new Error("Todo not found"));
  todo.done = !todo.done;
  if (randomFail(0.05)) return Promise.reject(new Error("Failed to toggle todo"));
  return JSON.parse(JSON.stringify(todo));
}

export async function deleteTodoApi({ id, signal } = {}) {
  await delay(200 + Math.random() * 300);
  if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
  const idx = fakeDB.findIndex((t) => t.id === id);
  if (idx === -1) return Promise.reject(new Error("Todo not found"));
  const [deleted] = fakeDB.splice(idx, 1);
  if (randomFail(0.05)) return Promise.reject(new Error("Failed to delete todo"));
  return JSON.parse(JSON.stringify(deleted));
}
