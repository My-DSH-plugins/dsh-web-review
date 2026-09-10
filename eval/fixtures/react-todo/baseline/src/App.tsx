import { useState } from 'react'

function NavItem({ label }: { label: string }) {
  return <li className="nav-item">{label}</li>
}

export function App() {
  const [todos, setTodos] = useState(['Write eval cases', 'Fix preview proxy', 'Update docs'])
  return (
    <div className="layout">
      <nav className="sidebar">
        <ul className="nav-list">
          <NavItem label="Inbox" />
          <NavItem label="Starred" />
          <NavItem label="Drafts" />
        </ul>
      </nav>
      <main className="content">
        <h1 className="title">Todo list</h1>
        <ul className="todos">
          {todos.map((todo) => <li key={todo} className="todo-item">{todo}</li>)}
        </ul>
        <button className="add-button" onClick={() => setTodos([...todos, 'New task'])}>Add task</button>
      </main>
    </div>
  )
}
