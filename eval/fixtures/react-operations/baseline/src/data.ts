export interface Order {
  id: string
  customer: string
  amount: string
  status: 'Pending' | 'Shipped' | 'Cancelled'
}

export const orders: Order[] = [
  { id: 'ORD-1048', customer: 'Galaxy Tech', amount: '¥12,800', status: 'Pending' },
  { id: 'ORD-1047', customer: 'Qingshan Trading', amount: '¥8,420', status: 'Shipped' },
  { id: 'ORD-1046', customer: 'Farsight Design', amount: '¥3,260', status: 'Cancelled' },
]
