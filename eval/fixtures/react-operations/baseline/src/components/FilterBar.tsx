export function FilterBar() {
  return <section className="filter-bar" aria-label="Order filters">
    <div className="filter-heading"><strong>Filter orders</strong><span>Quickly narrow the results</span></div>
    <label>Status<select defaultValue="all"><option value="all">All statuses</option><option>Pending</option><option>Shipped</option></select></label>
    <label>Search<input type="search" placeholder="Order number or customer" /></label>
    <button className="button secondary">Apply Filters</button>
  </section>
}
