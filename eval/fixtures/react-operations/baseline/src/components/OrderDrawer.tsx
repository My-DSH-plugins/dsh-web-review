import type { Order } from '../data.ts'

export function OrderDrawer({ order, onClose }: { order: Order; onClose: () => void }) {
  return <div className="drawer-backdrop"><aside className="drawer" aria-label="Order details">
    <header><div><span>Order details</span><h2>{order.id} · {order.customer} · Enterprise Procurement and Custom Services</h2></div><button className="icon-button" aria-label="Close details" onClick={onClose}>×</button></header>
    <dl><div><dt>Customer</dt><dd>{order.customer}</dd></div><div><dt>Amount</dt><dd>{order.amount}</dd></div><div><dt>Status</dt><dd>{order.status}</dd></div></dl>
  </aside></div>
}
