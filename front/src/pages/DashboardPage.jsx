import { Link, useNavigate } from 'react-router-dom'

export default function DashboardPage() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">Panel de administracion</h1>
          <p className="text-muted mb-0">
            Bienvenido, {user.name} ({user.role})
          </p>
        </div>

        <button className="btn btn-outline-danger" onClick={handleLogout}>
          Cerrar sesion
        </button>
      </div>

      <div className="row g-3">
        <div className="col-md-4">
          <Link to="/cells" className="btn btn-primary w-100 py-3">
            Gestionar celdas
          </Link>
        </div>
      </div>
    </div>
  )
}