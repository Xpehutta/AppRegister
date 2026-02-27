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
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Compute storage technology options based on selected product
  const getStorageOptions = () => {
    const product = formData.product;
    if (product === 'БВД') {
      return ['GreenPlum', 'Hadoop'];
    } else if (product === 'ЕСС') {
      return ['Hadoop'];
    }
    return []; // no product selected yet
  };

  // Handle product change: update formData and possibly set storageTechnology
  const handleProductChange = (e) => {
    const newProduct = e.target.value;
    setFormData(prev => {
      const newData = { ...prev, product: newProduct };
      // If product is ЕСС, automatically set storageTechnology to Hadoop
      if (newProduct === 'ЕСС') {
        newData.storageTechnology = 'Hadoop';
      } else {
        // Clear storageTechnology when switching to БВД (user will choose)
        delete newData.storageTechnology;
      }
      return newData;
    });
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
        {applicationFields.map(field => {
          // Special handling for product (uses custom onChange)
          if (field.name === 'product') {
            return (
              <div key={field.name} className="form-group">
                <label htmlFor={field.name}>
                  {field.label}{field.required && ' *'}
                </label>
                <select
                  id={field.name}
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleProductChange}
                  required={field.required}
                >
                  <option value="">-- Выберите --</option>
                  {field.options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            );
          }

          // Special handling for storageTechnology with dynamic options
          if (field.name === 'storageTechnology') {
            const options = getStorageOptions();
            const isDisabled = formData.product === 'ЕСС'; // disable if product is ЕСС (only one option)
            return (
              <div key={field.name} className="form-group">
                <label htmlFor={field.name}>
                  {field.label}{field.required && ' *'}
                </label>
                <select
                  id={field.name}
                  name={field.name}
                  value={formData[field.name] || (options.length === 1 ? options[0] : '')}
                  onChange={handleChange}
                  required={field.required}
                  disabled={isDisabled}
                >
                  {options.length > 0 && (
                    <>
                      {!isDisabled && <option value="">-- Выберите --</option>}
                      {options.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </>
                  )}
                </select>
                {isDisabled && (
                  <small style={{ color: '#666' }}>Значение установлено автоматически (Hadoop)</small>
                )}
              </div>
            );
          }

          // Default rendering for other fields
          return (
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
          );
        })}
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Создание...' : 'Создать черновик'}
        </button>
      </form>
    </div>
  );
};

export default ApplicationForm;