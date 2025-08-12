import TodoApp from "../components/TodoApp";

export default function Page() {
  return (
    <main className="container">
      <h1 className="title">Todo List</h1>
      <TodoApp />
      <footer className="footer">Built with Next.js</footer>
    </main>
  );
}
