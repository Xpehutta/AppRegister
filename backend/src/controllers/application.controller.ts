import { Response } from 'express';
import path from 'path';
import { AuthRequest } from '../middleware/auth.middleware';
import { pool } from '../config/database';
import { env } from '../config/env';
import { AppError } from '../utils/errors';
import { fileService } from '../services/file.service'; // optional, we'll implement directly

// Create a new draft application
export const createApplication = async (req: AuthRequest, res: Response) => {
  const { data } = req.body;
  const userId = req.user!.id;
  const result = await pool.query(
    'INSERT INTO applications (user_id, data, status) VALUES ($1, $2, $3) RETURNING id',
    [userId, data, 'draft']
  );
  res.status(201).json({ id: result.rows[0].id });
};

// List user's applications
export const listApplications = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const result = await pool.query(
    'SELECT id, status, submitted_at, created_at FROM applications WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  res.json(result.rows);
};

// Get a single application by ID (including attachments)
export const getApplication = async (req: AuthRequest, res: Response) => {
  const appId = req.params.id;
  const userId = req.user!.id;
  const appResult = await pool.query(
    'SELECT * FROM applications WHERE id = $1 AND user_id = $2',
    [appId, userId]
  );
  if (appResult.rows.length === 0) {
    throw new AppError('Application not found', 404);
  }
  const application = appResult.rows[0];
  const attachments = await pool.query(
    'SELECT id, filename, uploaded_at FROM attachments WHERE application_id = $1',
    [appId]
  );
  application.attachments = attachments.rows;
  res.json(application);
};

// Submit an application (change status from draft to submitted)
export const submitApplication = async (req: AuthRequest, res: Response) => {
  const appId = req.params.id;
  const userId = req.user!.id;
  const result = await pool.query(
    'UPDATE applications SET status = $1, submitted_at = NOW() WHERE id = $2 AND user_id = $3 AND status = $4 RETURNING id',
    ['submitted', appId, userId, 'draft']
  );
  if (result.rowCount === 0) {
    throw new AppError('Cannot submit (not found or not in draft)', 400);
  }
  // Here you could trigger an email notification asynchronously
  // emailService.sendApplicationSubmitted(...).catch(err => logger.error('Email failed', err));
  res.json({ message: 'Application submitted' });
};

// Upload a file attachment for an application
export const uploadAttachment = async (req: AuthRequest, res: Response) => {
  const applicationId = req.params.id;
  const file = req.file;
  if (!file) {
    throw new AppError('No file uploaded', 400);
  }

  // Verify the user owns this application
  const ownership = await pool.query(
    'SELECT id FROM applications WHERE id = $1 AND user_id = $2',
    [applicationId, req.user!.id]
  );
  if (ownership.rows.length === 0) {
    throw new AppError('Application not found or access denied', 403);
  }

  // Save file record in database
  await pool.query(
    'INSERT INTO attachments (application_id, filename, file_path) VALUES ($1, $2, $3)',
    [applicationId, file.filename, file.path]
  );

  res.status(201).json({
    filename: file.filename,
    path: file.path,
    size: file.size,
  });
};

// Download an attachment (using X-Accel-Redirect)
export const downloadAttachment = async (req: AuthRequest, res: Response) => {
  const { id: applicationId, attachmentId } = req.params;
  const userId = req.user!.id;

  // Verify ownership and fetch attachment details
  const attachment = await pool.query(
    'SELECT a.* FROM attachments a JOIN applications app ON a.application_id = app.id WHERE a.id = $1 AND a.application_id = $2 AND app.user_id = $3',
    [attachmentId, applicationId, userId]
  );
  if (attachment.rows.length === 0) {
    throw new AppError('Attachment not found', 404);
  }

  const filePath = attachment.rows[0].file_path;
  const filename = attachment.rows[0].filename;

  // Compute relative path from the upload root (used by Nginx)
  const relativePath = path.relative(env.uploadPath, filePath);

  // Set headers for Nginx internal redirect
  res.setHeader('X-Accel-Redirect', '/protected-files/' + relativePath);
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  // Prevent direct access
  res.setHeader('X-Accel-Buffering', 'no');
  res.setHeader('Cache-Control', 'no-cache');
  res.end();
};