import React, { useEffect, useState } from 'react';
import { getAllApplications, updateApplicationStatus } from '../api';

const AdminApplicationsList = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [comment, setComment] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await getAllApplications();
      setApplications(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id) => {
    try {
      await updateApplicationStatus(id, newStatus, comment);
      setSelectedApp(null);
      setNewStatus('');
      setComment('');
      fetchApplications();
    } catch (err) {
      alert('Ошибка обновления статуса');
    }
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <h2>Все заявки (админ панель)</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Пользователь</th>
            <th>Статус</th>
            <th>Подана</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {applications.map(app => (
            <tr key={app.id}>
              <td>{app.id}</td>
              <td>{app.email}</td>
              <td>{app.status}</td>
              <td>{app.submitted_at ? new Date(app.submitted_at).toLocaleString('ru-RU') : '-'}</td>
              <td>
                <button onClick={() => setSelectedApp(app)} className="btn">Изменить статус</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedApp && (
        <div className="modal">
          <h3>Изменить статус заявки {selectedApp.id}</h3>
          <div className="form-group">
            <label>Новый статус</label>
            <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
              <option value="">Выберите...</option>
              <option value="submitted">Подана</option>
              <option value="under_review">На рассмотрении</option>
              <option value="accepted">Принята</option>
              <option value="rejected">Отклонена</option>
            </select>
          </div>
          <div className="form-group">
            <label>Комментарий (необязательно)</label>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows="3"></textarea>
          </div>
          <button onClick={() => handleUpdate(selectedApp.id)} className="btn" disabled={!newStatus}>Обновить</button>
          <button onClick={() => setSelectedApp(null)} className="btn btn-danger">Отмена</button>
        </div>
      )}
    </div>
  );
};

export default AdminApplicationsList;