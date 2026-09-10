interface Product {
  id: number
  title: string
  price: string
}

const products: Product[] = [
  { id: 1, title: 'Starlight Projector', price: '¥129' },
  { id: 2, title: 'Magnetic Levitation Speaker', price: '¥299' },
  { id: 3, title: 'Retro Mechanical Keyboard', price: '¥459' },
  { id: 4, title: 'Desktop Moss Planter', price: '¥89' },
  { id: 5, title: 'Portable Coffee Pour-Over Kettle', price: '¥158' },
  { id: 6, title: 'Cloud Ambience Night Light', price: '¥69' },
]

export function App() {
  return (
    <div className="page">
      <header className="header">
        <h1 className="shop-title">Magic Shop</h1>
        <p className="shop-subtitle">Featured picks · Limited-time offer</p>
      </header>
      <main className="products">
        {products.map((product) => (
          <article key={product.id} className="product-card">
            <h2 className="product-title">{product.title}</h2>
            <p className="price">{product.price}</p>
            <button className="buy" type="button">Add to cart</button>
          </article>
        ))}
      </main>
    </div>
  )
}
