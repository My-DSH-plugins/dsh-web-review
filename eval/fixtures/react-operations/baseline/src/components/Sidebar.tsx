const items = ['Overview', 'Order', 'Customer', 'Products', 'Settings']

export function Sidebar() {
  return <aside className="sidebar" aria-label="Main navigation">
    <div className="brand">Northstar</div>
    <nav>{items.map(item => <a className={`nav-link${item === 'Order' ? ' active' : ''}`} href={`#${item}`} key={item}>{item}</a>)}</nav>
  </aside>
}
