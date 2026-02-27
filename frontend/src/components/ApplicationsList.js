import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getApplications } from '../api';

const ApplicationsList = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getApplications();
        setApplications(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <h2>Мои заявки</h2>
      <Link to="/applications/new" className="btn">Создать новую заявку</Link>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Статус</th>
            <th>Дата подачи</th>
            <th>Дата создания</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {applications.map(app => (
            <tr key={app.id}>
              <td>{app.id}</td>
              <td>{app.status}</td>
              <td>{app.submitted_at ? new Date(app.submitted_at).toLocaleString('ru-RU') : '-'}</td>
              <td>{new Date(app.created_at).toLocaleString('ru-RU')}</td>
              <td>
                <Link to={`/applications/${app.id}`}>Просмотр</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicationsList;