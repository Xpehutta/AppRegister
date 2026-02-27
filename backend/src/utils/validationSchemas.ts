import { body, param } from 'express-validator';

export const createApplicationValidation = [
  body('data').isObject().withMessage('data must be an object'),
];

export const uploadAttachmentValidation = [
  param('id').isUUID().withMessage('Invalid application ID'),
];

export const updateStatusValidation = [
  param('id').isUUID(),
  body('status').isIn(['submitted', 'under_review', 'accepted', 'rejected']),
  body('comment').optional().isString(),
];