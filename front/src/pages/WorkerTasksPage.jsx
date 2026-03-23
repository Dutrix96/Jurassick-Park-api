import { useEffect, useState } from 'react';
import api from '../api/api';
import { getEcho } from '../api/echo';

export default function WorkerTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const loadTasks = async () => {
    try {
      setError('');
      const response = await api.get('/tasks/my-tasks');
      setTasks(response.data.data);
    } catch (err) {
      setError('No se pudieron cargar las tareas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();

    const echo = getEcho();
    const channel = echo.channel('park');

    channel.listen('.task.updated', () => {
      loadTasks();
    });

    return () => {
      echo.leave('park');
    };
  }, []);

  const updateStatus = async (taskId, status) => {
    try {
      setUpdatingId(taskId);
      await api.patch(`/tasks/${taskId}/status`, { status });
      await loadTasks();
    } catch (err) {
      setError('No se pudo actualizar la tarea');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return <div className="container py-4">Cargando tareas...</div>;
  }

  return (
    <div className="container py-4">
      <h1 className="mb-4">Mis tareas</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      {tasks.length === 0 ? (
        <div className="alert alert-info">No tienes tareas asignadas.</div>
      ) : (
        <div className="row g-3">
          {tasks.map((task) => (
            <div className="col-12 col-lg-6" key={task.id}>
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title mb-0">{task.title}</h5>
                    <span className={`badge ${getStatusBadgeClass(task.status)}`}>
                      {task.status}
                    </span>
                  </div>

                  <p className="mb-2">
                    <strong>Tipo:</strong> {task.type}
                  </p>

                  <p className="mb-2">
                    <strong>Prioridad:</strong> {task.priority}
                  </p>

                  <p className="mb-2">
                    <strong>Celda:</strong> fila {task.cell?.row}, columna {task.cell?.col}
                  </p>

                  <p className="mb-3">
                    <strong>Estado de la celda:</strong>{' '}
                    comida {task.cell?.food_level}% | seguridad {task.cell?.security_level}% | averias {task.cell?.pending_repairs}
                  </p>

                  <div className="d-flex gap-2 flex-wrap">
                    <button
                      className="btn btn-warning"
                      disabled={updatingId === task.id || task.status === 'IN_PROGRESS'}
                      onClick={() => updateStatus(task.id, 'IN_PROGRESS')}
                    >
                      Marcar en progreso
                    </button>

                    <button
                      className="btn btn-success"
                      disabled={updatingId === task.id || task.status === 'FINISHED'}
                      onClick={() => updateStatus(task.id, 'FINISHED')}
                    >
                      Marcar finalizada
                    </button>

                    <button
                      className="btn btn-secondary"
                      disabled={updatingId === task.id || task.status === 'PENDING'}
                      onClick={() => updateStatus(task.id, 'PENDING')}
                    >
                      Volver a pendiente
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function getStatusBadgeClass(status) {
  if (status === 'PENDING') return 'text-bg-secondary';
  if (status === 'IN_PROGRESS') return 'text-bg-warning';
  if (status === 'FINISHED') return 'text-bg-success';
  return 'text-bg-dark';
}