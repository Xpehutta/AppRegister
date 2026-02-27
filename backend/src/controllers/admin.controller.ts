import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { pool } from '../config/database';
import { AppError } from '../utils/errors';

export const listAllApplications = async (req: AuthRequest, res: Response) => {
  const result = await pool.query(
    'SELECT a.*, u.email FROM applications a JOIN users u ON a.user_id = u.id ORDER BY a.created_at DESC'
  );
  res.json(result.rows);
};

export const updateApplicationStatus = async (req: AuthRequest, res: Response) => {
  const appId = req.params.id;
  const { status, comment } = req.body;
  const adminId = req.user!.id;

  await pool.query('BEGIN');
  const updateResult = await pool.query(
    'UPDATE applications SET status = $1 WHERE id = $2 RETURNING id',
    [status, appId]
  );
  if (updateResult.rowCount === 0) {
    await pool.query('ROLLBACK');
    throw new AppError('Application not found', 404);
  }
  await pool.query(
    'INSERT INTO reviews (application_id, admin_id, comment, new_status) VALUES ($1, $2, $3, $4)',
    [appId, adminId, comment, status]
  );
  await pool.query('COMMIT');
  res.json({ message: 'Status updated' });
};