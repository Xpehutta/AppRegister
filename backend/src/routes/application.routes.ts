import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';
import { validate } from '../middleware/validation.middleware';
import {
  createApplication,
  listApplications,
  getApplication,
  submitApplication,
  uploadAttachment,
  downloadAttachment,
} from '../controllers/application.controller';
import {
  createApplicationValidation,
  uploadAttachmentValidation,
} from '../utils/validationSchemas';

const router = Router();

// All application routes require authentication
router.use(authenticate);

// Create a new draft application
router.post('/', validate(createApplicationValidation), createApplication);

// List user's applications
router.get('/', listApplications);

// Get a single application by ID
router.get('/:id', getApplication);

// Submit an application (change status from draft to submitted)
router.post('/:id/submit', submitApplication);

// Upload a file attachment for an application
router.post(
  '/:id/attachments',
  validate(uploadAttachmentValidation),
  upload.single('file'),
  uploadAttachment
);

// Download an attachment
router.get('/:id/attachments/:attachmentId', downloadAttachment);

export default router;