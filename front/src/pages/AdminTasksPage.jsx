import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { getEcho } from '../api/echo';

export default function AdminTasksPage() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [assigningId, setAssigningId] = useState(null);

  const loadData = async () => {
    try {
      setError('');

      const [tasksResponse, usersResponse] = await Promise.all([
        api.get('/admin/tasks'),
        api.get('/admin/users'),
      ]);

      setTasks(tasksResponse.data.data);
      setUsers(usersResponse.data.data);
    } catch (err) {
      setError('No se pudieron cargar las tareas o usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    const echo = getEcho();
    const channel = echo.channel('park');

    channel.listen('.task.updated', () => {
      loadData();
    });

    return () => {
      echo.leave('park');
    };
  }, []);

  const assignTask = async (taskId, userId) => {
    if (!userId) return;

    try {
      setAssigningId(taskId);
      await api.patch(`/admin/tasks/${taskId}/assign`, {
        user_id: Number(userId),
      });
      await loadData();
    } catch (err) {
      setError('No se pudo asignar la tarea');
    } finally {
      setAssigningId(null);
    }
  };

  if (loading) {
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
        Cargando tareas...
      </div>
    );
  }

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

      <h1 className="mb-4">Gestion de tareas</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="table-responsive">
        <table className="table table-striped table-bordered align-middle">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Titulo</th>
              <th>Tipo</th>
              <th>Estado</th>
              <th>Prioridad</th>
              <th>Celda</th>
              <th>Usuario</th>
              <th>Asignar</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td>{task.id}</td>
                <td>{task.title}</td>
                <td>{task.type}</td>
                <td>
                  <span className={`badge ${getStatusBadgeClass(task.status)}`}>
                    {task.status}
                  </span>
                </td>
                <td>{task.priority}</td>
                <td>
                  fila {task.cell?.row}, col {task.cell?.col}
                </td>
                <td>{task.user ? `${task.user.name} (${task.user.role})` : 'Sin asignar'}</td>
                <td>
                  <select
                    className="form-select"
                    defaultValue=""
                    disabled={assigningId === task.id}
                    onChange={(e) => assignTask(task.id, e.target.value)}
                  >
                    <option value="">Seleccionar usuario</option>
                    {users
                      .filter((user) => user.role === 'VET' || user.role === 'MAINT')
                      .map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name} - {user.role}
                        </option>
                      ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function getStatusBadgeClass(status) {
  if (status === 'PENDING') return 'text-bg-secondary';
  if (status === 'IN_PROGRESS') return 'text-bg-warning';
  if (status === 'FINISHED') return 'text-bg-success';
  return 'text-bg-dark';
}