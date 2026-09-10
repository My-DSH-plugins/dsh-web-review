import { useState } from 'react'
import { FilterBar } from './components/FilterBar.tsx'
import { MetricCard } from './components/MetricCard.tsx'
import { OrderDrawer } from './components/OrderDrawer.tsx'
import { OrderTable } from './components/OrderTable.tsx'
import { Sidebar } from './components/Sidebar.tsx'
import { orders, type Order } from './data.ts'

export function App() {
  const [selected, setSelected] = useState<Order | null>(orders[0]!)
  return <div className="app-shell"><Sidebar /><main className="main-content">
    <header className="page-heading"><div><p>Operations Console</p><h1>Order management</h1></div><button className="button primary">New Order</button></header>
    <FilterBar />
    <section className="metrics" aria-label="Order Metrics"><MetricCard label="Today’s orders" value="128" delta="vs. yesterday +12%" /><MetricCard label="Pending" value="24" delta="Needs timely follow-up" /><MetricCard label="Deals this month" value="¥842,600" delta="Target completion 76%" /></section>
    <OrderTable orders={orders} onOpen={setSelected} />
  </main>{selected !== null && <OrderDrawer order={selected} onClose={() => setSelected(null)} />}</div>
}
