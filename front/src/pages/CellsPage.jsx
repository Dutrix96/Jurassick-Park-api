import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/api'

export default function CellsPage() {
  const [cells, setCells] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchCells = async () => {
      try {
        const response = await api.get('/admin/cells')
        setCells(response.data)
      } catch (err) {
        setError('No se pudieron cargar las celdas')
      }
    }

    fetchCells()
  }, [])

  return (
    <div className="container py-4">
      <h1 className="h3 mb-4">Celdas del parque</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-3">
        {cells.map((cell) => (
          <div key={cell.id} className="col-md-4 col-lg-3">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h2 className="h5">Celda {cell.row}-{cell.col}</h2>
                <p className="mb-1">Seguridad: {cell.security_level}</p>
                <p className="mb-1">Comida: {cell.food_level}</p>
                <p className="mb-3">Averias: {cell.pending_repairs}</p>

                <Link to={`/cells/${cell.id}`} className="btn btn-outline-primary btn-sm">
                  Ver detalle
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}