import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/api'

export default function CellDetailPage() {
  const { id } = useParams()
  const [cell, setCell] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchCell = async () => {
      try {
        const response = await api.get(`/admin/cells/${id}`)
        setCell(response.data)
      } catch (err) {
        setError('No se pudo cargar la celda')
      }
    }

    fetchCell()
  }, [id])

  if (error) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger">{error}</div>
      </div>
    )
  }

  if (!cell) {
    return (
      <div className="container py-4">
        <p>Cargando...</p>
      </div>
    )
  }

  return (
    <div className="container py-4">
      <h1 className="h3 mb-4">
        Celda {cell.row}-{cell.col}
      </h1>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <p><strong>Seguridad:</strong> {cell.security_level}</p>
          <p><strong>Comida:</strong> {cell.food_level}</p>
          <p><strong>Averias:</strong> {cell.pending_repairs}</p>
          <p><strong>Notas:</strong> {cell.notes || 'Sin notas'}</p>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="h5">Dinosaurios</h2>

          {cell.dinosaurs && cell.dinosaurs.length > 0 ? (
            <ul className="mb-0">
              {cell.dinosaurs.map((dino) => (
                <li key={dino.id}>
                  {dino.nick} - {dino.species}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mb-0">No hay dinosaurios en esta celda.</p>
          )}
        </div>
      </div>
    </div>
  )
}