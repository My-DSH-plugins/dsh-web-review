import type { Order } from '../data.ts'

export function OrderTable({ orders, onOpen }: { orders: Order[]; onOpen: (order: Order) => void }) {
  return <section className="results" aria-labelledby="results-title">
    <div className="results-heading"><div><h2 id="results-title">Order list</h2><p>Total 128 results</p></div><button className="button primary">Export data</button></div>
    <div className="table-scroll"><table><thead><tr><th>Order</th><th>Customer</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>{orders.map(order => <tr key={order.id}><td>{order.id}</td><td>{order.customer}</td><td>{order.amount}</td><td><span className={`status ${order.status}`}>{order.status}</span></td><td className="actions"><button className="button secondary" onClick={() => onOpen(order)}>View</button><button className="button primary cancel-order">Cancel order</button></td></tr>)}</tbody>
    </table></div>
  </section>
}
