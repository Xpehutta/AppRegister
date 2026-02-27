import path from 'path';
import { env } from '../config/env';
import { pool } from '../config/database';
import { AppError } from '../utils/errors';

export const fileService = {
  async getAttachmentPath(attachmentId: string, applicationId: string, userId: string) {
    const result = await pool.query(
      'SELECT a.* FROM attachments a JOIN applications app ON a.application_id = app.id WHERE a.id = $1 AND a.application_id = $2 AND app.user_id = $3',
      [attachmentId, applicationId, userId]
    );
    if (result.rows.length === 0) {
      throw new AppError('Attachment not found', 404);
    }
    const filePath = result.rows[0].file_path;
    const filename = result.rows[0].filename;
    const relativePath = path.relative(env.uploadPath, filePath);
    return { relativePath, filename };
  },
};