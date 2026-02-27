import React, { useState, useEffect } from 'react';

const STORAGE_KEY = 'integratedDatasetConfig';

const DatasetConfigForm = () => {
  const [formData, setFormData] = useState({
    scenarioDescription: '',
    mappingToKMD: '',
    masterSources: '',
    sourceTables: '',
    subjectAreas: '',
    sberCatalogLink: '',
    businessHistoryDepth: '',
    technicalHistoryDepth: '',
    idImmutability: '',
    actuality: '',
    entityRelations: '',
    purpose: '',
    tribe: '',
    initiator: '',
    problemDescription: '',
    businessProcessDescription: '',
    desiredTimeline: '',
  });

  // Load saved data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setFormData(JSON.parse(saved));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData, null, 2));
    alert('Configuration saved to localStorage. You can also copy the JSON below.');
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(formData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'integrated-dataset-config.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <h2>Интегрированный набор данных – Конфигурация</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Описание сценария *</label>
          <textarea
            name="scenarioDescription"
            value={formData.scenarioDescription}
            onChange={handleChange}
            required
            rows="3"
            placeholder="Высокоуровневое описание группы задач потребителя..."
          />
        </div>

        <div className="form-group">
          <label>Маппинг на имеющийся набор данных в терминах КМД</label>
          <textarea
            name="mappingToKMD"
            value={formData.mappingToKMD}
            onChange={handleChange}
            rows="2"
            placeholder="Например: Все действующие договора типа..."
          />
        </div>

        <div className="form-group">
          <label>Набор мастер-источников *</label>
          <input
            type="text"
            name="masterSources"
            value={formData.masterSources}
            onChange={handleChange}
            required
            placeholder="Например: PostgreSQL (заявки), локальная ФС (вложения)"
          />
        </div>

        <div className="form-group">
          <label>Известные таблицы-источники и алгоритмы расчёта</label>
          <textarea
            name="sourceTables"
            value={formData.sourceTables}
            onChange={handleChange}
            rows="2"
            placeholder="Таблицы: applications, attachments, users..."
          />
        </div>

        <div className="form-group">
          <label>Предполагаемые предметные области</label>
          <input
            type="text"
            name="subjectAreas"
            value={formData.subjectAreas}
            onChange={handleChange}
            placeholder="Управление заявками, документооборот"
          />
        </div>

        <div className="form-group">
          <label>Ссылка на единый каталог продуктов Сбера</label>
          <input
            type="text"
            name="sberCatalogLink"
            value={formData.sberCatalogLink}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Глубина бизнес-истории *</label>
          <input
            type="text"
            name="businessHistoryDepth"
            value={formData.businessHistoryDepth}
            onChange={handleChange}
            required
            placeholder="например, 5 лет"
          />
        </div>

        <div className="form-group">
          <label>Глубина технической истории *</label>
          <input
            type="text"
            name="technicalHistoryDepth"
            value={formData.technicalHistoryDepth}
            onChange={handleChange}
            required
            placeholder="отсутствует / 1 год / ..."
          />
        </div>

        <div className="form-group">
          <label>Требования к неизменности идентификаторов *</label>
          <input
            type="text"
            name="idImmutability"
            value={formData.idImmutability}
            onChange={handleChange}
            required
            placeholder="например, идентификаторы заявок и пользователей"
          />
        </div>

        <div className="form-group">
          <label>Актуальность *</label>
          <input
            type="text"
            name="actuality"
            value={formData.actuality}
            onChange={handleChange}
            required
            placeholder="например, real‑time"
          />
        </div>

        <div className="form-group">
          <label>Связи (мостики) между сущностями</label>
          <textarea
            name="entityRelations"
            value={formData.entityRelations}
            onChange={handleChange}
            rows="3"
            placeholder="Опишите связи между сущностями..."
          />
        </div>

        <div className="form-group">
          <label>Цель заведения *</label>
          <input
            type="text"
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            required
            placeholder="Цель создания данного набора данных"
          />
        </div>

        <div className="form-group">
          <label>ГАК/Трайб Заказчика *</label>
          <input
            type="text"
            name="tribe"
            value={formData.tribe}
            onChange={handleChange}
            required
            placeholder="например, Цифровые сервисы / Трайб «Клиентский опыт»"
          />
        </div>

        <div className="form-group">
          <label>Инициатор/ФИО контакта *</label>
          <input
            type="text"
            name="initiator"
            value={formData.initiator}
            onChange={handleChange}
            required
            placeholder="Иванов Иван Иванович, email"
          />
        </div>

        <div className="form-group">
          <label>Описание решаемой проблемы</label>
          <textarea
            name="problemDescription"
            value={formData.problemDescription}
            onChange={handleChange}
            rows="3"
            placeholder="Какие проблемы решает сервис..."
          />
        </div>

        <div className="form-group">
          <label>Описание бизнес-процесса или бизнес-продукта *</label>
          <textarea
            name="businessProcessDescription"
            value={formData.businessProcessDescription}
            onChange={handleChange}
            required
            rows="3"
            placeholder="Опишите процесс..."
          />
        </div>

        <div className="form-group">
          <label>Желаемый срок реализации и обоснование *</label>
          <textarea
            name="desiredTimeline"
            value={formData.desiredTimeline}
            onChange={handleChange}
            required
            rows="2"
            placeholder="Срок и риски при несоблюдении"
          />
        </div>

        <button type="submit" className="btn">Сохранить в localStorage</button>
        <button type="button" className="btn" onClick={handleExport} style={{ marginLeft: '10px' }}>
          Экспорт JSON
        </button>
      </form>

      <h3>Текущая конфигурация (JSON)</h3>
      <pre>{JSON.stringify(formData, null, 2)}</pre>
    </div>
  );
};

export default DatasetConfigForm;