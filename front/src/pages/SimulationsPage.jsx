import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { getEcho } from '../api/echo';

export default function SimulationsPage() {
  const navigate = useNavigate();

  const [cells, setCells] = useState([]);
  const [selectedCellId, setSelectedCellId] = useState('');
  const [normalCellIds, setNormalCellIds] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [running, setRunning] = useState(false);
  const [lastSimulation, setLastSimulation] = useState(null);

  const loadCells = async () => {
    try {
      const response = await api.get('/admin/cells');
      setCells(response.data.data);
    } catch (err) {
      setError('No se pudieron cargar las celdas');
    }
  };

  useEffect(() => {
    loadCells();

    const echo = getEcho();
    const channel = echo.channel('park');

    channel.listen('.simulation.finished', (event) => {
      setLastSimulation(event.simulation);
      setMessage(`Simulacion ${event.simulation.type} completada con resultado ${event.simulation.result}`);
      loadCells();
    });

    channel.listen('.cell.updated', () => {
      loadCells();
    });

    return () => {
      echo.leave('park');
    };
  }, []);

  const toggleCellForNormal = (cellId) => {
    setNormalCellIds((prev) => {
      if (prev.includes(cellId)) {
        return prev.filter((id) => id !== cellId);
      }

      return [...prev, cellId];
    });
  };

  const runNormalSimulation = async () => {
    try {
      setRunning(true);
      setError('');
      setMessage('');

      const payload = normalCellIds.length > 0 ? { cell_ids: normalCellIds } : {};
      const response = await api.post('/admin/simulations/normal', payload);

      setLastSimulation(response.data.data);
      setMessage('Simulacion normal ejecutada correctamente');
      await loadCells();
    } catch (err) {
      setError('No se pudo ejecutar la simulacion normal');
    } finally {
      setRunning(false);
    }
  };

  const runBreachSimulation = async (random) => {
    try {
      setRunning(true);
      setError('');
      setMessage('');

      const payload = random
        ? { random: true }
        : { cell_id: Number(selectedCellId), random: false };

      await api.post('/admin/simulations/breach', payload);
      await loadCells();
    } catch (err) {
      setError('No se pudo ejecutar la simulacion de brecha');
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="mb-3">
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate('/dashboard')}
        >
          Volver al dashboard
        </button>
      </div>

      <h1 className="mb-4">Simulaciones</h1>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-4">
        <div className="col-12 col-lg-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h4 className="mb-3">Simulacion normal</h4>
              <p className="text-muted">
                Si no seleccionas ninguna celda, se ejecutara sobre todas.
              </p>

              <div className="row g-2">
                {cells.map((cell) => (
                  <div className="col-6" key={cell.id}>
                    <label className="form-check border rounded p-2 w-100">
                      <input
                        className="form-check-input me-2"
                        type="checkbox"
                        checked={normalCellIds.includes(cell.id)}
                        onChange={() => toggleCellForNormal(cell.id)}
                      />
                      Celda ({cell.row},{cell.col})
                    </label>
                  </div>
                ))}
              </div>

              <button
                className="btn btn-primary mt-3"
                disabled={running}
                onClick={runNormalSimulation}
              >
                Lanzar simulacion normal
              </button>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h4 className="mb-3">Simulacion de brecha</h4>

              <label className="form-label">Selecciona una celda</label>
              <select
                className="form-select mb-3"
                value={selectedCellId}
                onChange={(e) => setSelectedCellId(e.target.value)}
              >
                <option value="">Selecciona una celda</option>
                {cells.map((cell) => (
                  <option key={cell.id} value={cell.id}>
                    Celda ({cell.row},{cell.col})
                  </option>
                ))}
              </select>

              <div className="d-flex gap-2 flex-wrap">
                <button
                  className="btn btn-danger"
                  disabled={running || !selectedCellId}
                  onClick={() => runBreachSimulation(false)}
                >
                  Lanzar brecha manual
                </button>

                <button
                  className="btn btn-outline-danger"
                  disabled={running}
                  onClick={() => runBreachSimulation(true)}
                >
                  Lanzar brecha aleatoria
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm mt-4">
        <div className="card-body">
          <h4 className="mb-3">Estado actual de celdas</h4>

          <div className="table-responsive">
            <table className="table table-striped table-bordered align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Celda</th>
                  <th>Seguridad</th>
                  <th>Comida</th>
                  <th>Averias</th>
                </tr>
              </thead>
              <tbody>
                {cells.map((cell) => (
                  <tr key={cell.id}>
                    <td>
                      ({cell.row},{cell.col})
                    </td>
                    <td>{cell.security_level}%</td>
                    <td>{cell.food_level}%</td>
                    <td>{cell.pending_repairs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {lastSimulation && (
            <div className="mt-4">
              <h5>Ultima simulacion</h5>
              <pre className="bg-light p-3 border rounded small">
                {JSON.stringify(lastSimulation, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}