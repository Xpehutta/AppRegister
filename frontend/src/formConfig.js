// frontend/src/formConfig.js
export const applicationFields = [
  { name: 'scenarioDescription', label: 'Описание сценария', type: 'textarea', required: true },
  { name: 'mappingToKMD', label: 'Маппинг на имеющийся набор данных в терминах КМД', type: 'textarea', required: false },
  { name: 'masterSources', label: 'Набор мастер-источников', type: 'text', required: true },
  { name: 'sourceTables', label: 'Известные таблицы-источники и алгоритмы расчёта', type: 'textarea', required: false },
  { name: 'subjectAreas', label: 'Предполагаемые предметные области', type: 'text', required: false },
  { name: 'sberCatalogLink', label: 'Ссылка на единый каталог продуктов Сбера', type: 'text', required: false },
  { name: 'businessHistoryDepth', label: 'Глубина бизнес-истории', type: 'text', required: true },
  { name: 'technicalHistoryDepth', label: 'Глубина технической истории', type: 'text', required: true },
  { name: 'idImmutability', label: 'Требования к неизменности идентификаторов', type: 'text', required: true },
  { 
    name: 'actuality', 
    label: 'Актуальность', 
    type: 'select',                     // changed to select
    required: true,
    options: ['T0', 'T-1 22:00', 'T-1 23:59', 'T-2', 'T-3']
  },
  { name: 'entityRelations', label: 'Связи (мостики) между сущностями', type: 'textarea', required: false },
  { name: 'purpose', label: 'Цель заведения', type: 'text', required: true },
  { name: 'tribe', label: 'ГАК/Трайб Заказчика', type: 'text', required: true },
  { name: 'initiator', label: 'Инициатор/ФИО контакта', type: 'text', required: true },
  { name: 'problemDescription', label: 'Описание решаемой проблемы', type: 'textarea', required: false },
  { name: 'businessProcessDescription', label: 'Описание бизнес-процесса или бизнес-продукта', type: 'textarea', required: true },
  { 
    name: 'desiredTimeline', 
    label: 'Желаемый срок реализации и обоснование', 
    type: 'date', 
    required: true 
  },
];