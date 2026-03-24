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
  const [simulations, setSimulations] = useState([]);
  const [selectedSimulation, setSelectedSimulation] = useState(null);

  const loadCells = async () => {
    try {
      const response = await api.get('/admin/cells');
      setCells(response.data.data);
    } catch (err) {
      setError('No se pudieron cargar las celdas');
    }
  };

  const loadSimulations = async () => {
    try {
      const response = await api.get('/admin/simulations');
      setSimulations(response.data.data);
    } catch (err) {
      setError('No se pudieron cargar las simulaciones');
    }
  };

  useEffect(() => {
    loadCells();
    loadSimulations();

    const echo = getEcho();
    const channel = echo.channel('park');

    channel.listen('.simulation.finished', (event) => {
      setLastSimulation(event.simulation);
      setSelectedSimulation(event.simulation);
      setMessage(`Simulacion ${event.simulation.type} completada con resultado ${event.simulation.result}`);
      loadCells();
      loadSimulations();
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
      setSelectedSimulation(response.data.data);
      setMessage('Simulacion normal ejecutada correctamente');
      await loadCells();
      await loadSimulations();
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

      const response = await api.post('/admin/simulations/breach', payload);

      setLastSimulation(response.data.data);
      setSelectedSimulation(response.data.data);
      setMessage('Simulacion de brecha ejecutada correctamente');
      await loadCells();
      await loadSimulations();
    } catch (err) {
      setError('No se pudo ejecutar la simulacion de brecha');
    } finally {
      setRunning(false);
    }
  };

  const renderSimulationReport = (simulation) => {
    if (!simulation || !simulation.report) {
      return <p className="text-muted mb-0">No hay informe disponible.</p>;
    }

    const report = simulation.report;

    return (
      <div className="mt-3">
        <div className="mb-3">
          <p className="mb-1">
            <strong>Tipo:</strong> {simulation.type}
          </p>
          <p className="mb-1">
            <strong>Resultado:</strong> {simulation.result}
          </p>
          <p className="mb-1">
            <strong>Lanzada por:</strong> {simulation.triggered_by}
          </p>
          <p className="mb-0">
            <strong>Celda afectada:</strong>{' '}
            {simulation.affected_cell_id ? simulation.affected_cell_id : 'No aplica'}
          </p>
        </div>

        {report.cells && report.cells.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-striped table-bordered align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Celda</th>
                  <th>Comida antes</th>
                  <th>Comida despues</th>
                  <th>Seguridad antes</th>
                  <th>Seguridad despues</th>
                  <th>Averias antes</th>
                  <th>Averias despues</th>
                </tr>
              </thead>
              <tbody>
                {report.cells.map((cell, index) => (
                  <tr key={index}>
                    <td>
                      ({cell.position?.row},{cell.position?.col})
                    </td>
                    <td>{cell.food_before ?? '-'}</td>
                    <td>{cell.food_after ?? '-'}</td>
                    <td>{cell.security_before ?? '-'}</td>
                    <td>{cell.security_after ?? '-'}</td>
                    <td>{cell.repairs_before ?? '-'}</td>
                    <td>{cell.repairs_after ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-muted">No hay celdas registradas en este informe.</p>
        )}

        {report.summary && (
          <div className="mt-3">
            <h6>Resumen</h6>
            <pre className="bg-light p-3 border rounded small mb-0">
              {JSON.stringify(report.summary, null, 2)}
            </pre>
          </div>
        )}

        {report.events && (
          <div className="mt-3">
            <h6>Eventos</h6>
            <pre className="bg-light p-3 border rounded small mb-0">
              {JSON.stringify(report.events, null, 2)}
            </pre>
          </div>
        )}
      </div>
    );
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
              <h5>Ultima simulacion ejecutada</h5>
              {renderSimulationReport(lastSimulation)}
            </div>
          )}
        </div>
      </div>

      <div className="card shadow-sm mt-4">
        <div className="card-body">
          <h4 className="mb-3">Historial de simulaciones</h4>

          {simulations.length === 0 ? (
            <p className="text-muted mb-0">Todavia no hay simulaciones guardadas.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-bordered align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Tipo</th>
                    <th>Resultado</th>
                    <th>Usuario</th>
                    <th>Celda afectada</th>
                    <th>Fecha</th>
                    <th>Accion</th>
                  </tr>
                </thead>
                <tbody>
                  {simulations.map((simulation) => (
                    <tr key={simulation.id}>
                      <td>{simulation.id}</td>
                      <td>{simulation.type}</td>
                      <td>{simulation.result}</td>
                      <td>
                        {simulation.triggeredBy?.name
                          ? simulation.triggeredBy.name
                          : simulation.triggered_by}
                      </td>
                      <td>
                        {simulation.affected_cell_id
                          ? simulation.affected_cell_id
                          : 'No aplica'}
                      </td>
                      <td>
                        {simulation.created_at
                          ? new Date(simulation.created_at).toLocaleString()
                          : '-'}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => setSelectedSimulation(simulation)}
                        >
                          Ver informe
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {selectedSimulation && (
        <div className="card shadow-sm mt-4">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="mb-0">
                Informe de simulacion #{selectedSimulation.id}
              </h4>
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setSelectedSimulation(null)}
              >
                Cerrar informe
              </button>
            </div>

            {renderSimulationReport(selectedSimulation)}
          </div>
        </div>
      )}
    </div>
  );
}