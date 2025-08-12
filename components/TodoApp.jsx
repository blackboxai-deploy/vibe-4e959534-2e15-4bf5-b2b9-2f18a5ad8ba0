"use client";

import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "next_todo_items_v1";

function uid() {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setTodos(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch {}
  }, [todos]);

  const filtered = useMemo(() => {
    switch (filter) {
      case "active":
        return todos.filter((t) => !t.completed);
      case "completed":
        return todos.filter((t) => t.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  function addTodo(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    setTodos((prev) => [{ id: uid(), text: trimmed, completed: false }, ...prev]);
    setText("");
  }

  function toggleTodo(id) {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  }

  function deleteTodo(id) {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  function clearCompleted() {
    setTodos((prev) => prev.filter((t) => !t.completed));
  }

  const remaining = todos.filter((t) => !t.completed).length;

  return (
    <section className="card" aria-label="Todo List">
      <form onSubmit={addTodo} className="row" aria-label="Add todo">
        <label htmlFor="newTodo" className="srOnly">Add a task</label>
        <input
          id="newTodo"
          className="input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What needs to be done?"
          autoComplete="off"
        />
        <button className="button primary" type="submit" disabled={!text.trim()}>Add</button>
      </form>

      <div className="toolbar">
        <div className="filters" role="tablist" aria-label="Filter todos">
          <button
            type="button"
            className={`filterBtn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
            role="tab"
            aria-selected={filter === "all"}
          >All</button>
          <button
            type="button"
            className={`filterBtn ${filter === "active" ? "active" : ""}`}
            onClick={() => setFilter("active")}
            role="tab"
            aria-selected={filter === "active"}
          >Active</button>
          <button
            type="button"
            className={`filterBtn ${filter === "completed" ? "active" : ""}`}
            onClick={() => setFilter("completed")}
            role="tab"
            aria-selected={filter === "completed"}
          >Completed</button>
        </div>
        <div aria-live="polite">{remaining} left</div>
      </div>

      <ul className="list">
        {filtered.map((t) => (
          <li key={t.id} className="item">
            <input
              id={`chk_${t.id}`}
              className="checkbox"
              type="checkbox"
              checked={t.completed}
              onChange={() => toggleTodo(t.id)}
            />
            <label htmlFor={`chk_${t.id}`} className={`text ${t.completed ? "completed" : ""}`}>
              {t.text}
            </label>
            <button className="iconBtn" aria-label="Delete" onClick={() => deleteTodo(t.id)}>
              ✕
            </button>
          </li>
        ))}
      </ul>

      <div className="toolbar">
        <span>{todos.length} total</span>
        <button className="button" onClick={clearCompleted} disabled={!todos.some((t) => t.completed)}>
          Clear completed
        </button>
      </div>
    </section>
  );
}
