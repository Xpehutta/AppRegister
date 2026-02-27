import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getApplication, submitApplication, uploadAttachment, downloadAttachment } from '../api';

const ApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchApplication();
  }, [id]);

  const fetchApplication = async () => {
    try {
      const res = await getApplication(id);
      setApplication(res.data);
    } catch (err) {
      console.error(err);
      alert('Заявка не найдена');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      await submitApplication(id);
      fetchApplication(); // refresh
    } catch (err) {
      alert('Не удалось отправить заявку');
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    try {
      await uploadAttachment(id, selectedFile);
      setSelectedFile(null);
      fetchApplication(); // refresh attachments
    } catch (err) {
      alert('Ошибка загрузки файла');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (attachmentId, filename) => {
    try {
      const res = await downloadAttachment(id, attachmentId);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Ошибка скачивания');
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (!application) return <div>Заявка не найдена</div>;

  return (
    <div>
      <h2>Детали заявки</h2>
      <p><strong>Статус:</strong> {application.status}</p>
      <p><strong>Подана:</strong> {application.submitted_at ? new Date(application.submitted_at).toLocaleString('ru-RU') : 'Не подана'}</p>
      <h3>Данные заявки</h3>
      <pre>{JSON.stringify(application.data, null, 2)}</pre>

      {application.status === 'draft' && (
        <div>
          <button onClick={handleSubmit} className="btn">Отправить заявку</button>
        </div>
      )}

      <h3>Вложения</h3>
      {application.attachments && application.attachments.length > 0 ? (
        <ul>
          {application.attachments.map(att => (
            <li key={att.id}>
              {att.filename} (загружено {new Date(att.uploaded_at).toLocaleString('ru-RU')})
              <button onClick={() => handleDownload(att.id, att.filename)} className="btn">Скачать</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Нет вложений.</p>
      )}

      {application.status === 'draft' && (
        <div>
          <h4>Загрузить новое вложение</h4>
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleUpload} disabled={!selectedFile || uploading} className="btn">
            {uploading ? 'Загрузка...' : 'Загрузить'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ApplicationDetail;