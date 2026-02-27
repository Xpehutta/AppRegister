// frontend/src/components/ApplicationForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createApplication } from '../api';
import { applicationFields } from '../formConfig';

const ApplicationForm = () => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createApplication(formData);
      navigate(`/applications/${res.data.id}`);
    } catch (err) {
      console.error(err);
      alert('Не удалось создать заявку');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Новая заявка</h2>
      <form onSubmit={handleSubmit}>
        {applicationFields.map(field => (
          <div key={field.name} className="form-group">
            <label htmlFor={field.name}>
              {field.label}{field.required && ' *'}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                id={field.name}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleChange}
                rows={5}
                required={field.required}
                placeholder={field.placeholder || ''}
              />
            ) : field.type === 'select' ? (
              <select
                id={field.name}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleChange}
                required={field.required}
              >
                <option value="">-- Выберите --</option>
                {field.options.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                id={field.name}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleChange}
                required={field.required}
                placeholder={field.placeholder || ''}
              />
            )}
          </div>
        ))}
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Создание...' : 'Создать черновик'}
        </button>
      </form>
    </div>
  );
};

export default ApplicationForm;