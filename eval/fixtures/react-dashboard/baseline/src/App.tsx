function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="stat-card">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  )
}

const stats = [
  { label: 'Visits Today', value: '12,480' },
  { label: 'Active Users', value: '3,219' },
  { label: 'Conversion Rate', value: '24.6%' },
  { label: 'Total revenue', value: '¥86,400' },
]

export function App() {
  return (
    <div className="dashboard">
      <header className="topbar">
        <div className="avatar" aria-label="User avatar">Li</div>
        <div className="user-info">
          <div className="username">Li Ming</div>
          <div className="role">Product Operations</div>
        </div>
      </header>
      <section className="stats">
        {stats.map((item) => (
          <StatCard key={item.label} label={item.label} value={item.value} />
        ))}
      </section>
    </div>
  )
}
