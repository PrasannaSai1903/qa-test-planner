import { Router } from 'express';
import { ExportService } from '../services/exportService';
import * as path from 'path';
import * as fs from 'fs';

const router = Router();

router.post('/:format', async (req, res) => {
  const { content, fileName } = req.body;
  const format = req.params.format;
  const sanitizedFileName = (fileName || 'test-plan').replace(/[^a-z0-9]/gi, '_').toLowerCase();

  try {
    let filePath = '';
    switch (format) {
      case 'docx':
        filePath = await ExportService.generateDocx(content, sanitizedFileName);
        break;
      case 'pdf':
        filePath = await ExportService.generatePdf(content, sanitizedFileName);
        break;
      case 'md':
        filePath = await ExportService.generateMd(content, sanitizedFileName);
        break;
      default:
        return res.status(400).json({ error: 'Unsupported format' });
    }

    // Set explicit headers based on format for better browser compatibility
    const mimeTypes: { [key: string]: string } = {
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'pdf': 'application/pdf',
      'md': 'text/markdown'
    };

    res.setHeader('Content-Type', mimeTypes[format] || 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${path.basename(filePath)}"`);

    res.sendFile(filePath, (err) => {
      if (err) {
        console.error('File send error:', err);
        if (!res.headersSent) res.status(500).json({ error: 'Failed to send file' });
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
