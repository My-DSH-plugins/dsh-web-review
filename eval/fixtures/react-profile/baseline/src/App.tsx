const AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 96 96'%3E%3Crect width='96' height='96' rx='48' fill='%234c6ef5'/%3E%3Ccircle cx='48' cy='38' r='15' fill='%23fff'/%3E%3Cellipse cx='48' cy='80' rx='24' ry='18' fill='%23fff'/%3E%3C/svg%3E"

export function App() {
  return (
    <div className="profile">
      <div className="info">
        <img className="avatar" src={AVATAR} />
        <h1 className="name">Li Lei</h1>
        <p className="bio">A frontend engineer focused on product experience</p>
      </div>
    </div>
  )
}
