import { Router } from 'express';
import multer from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import { TemplateService } from '../services/templateService';

const router = Router();
const uploadDir = '/tmp/uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const upload = multer({ dest: uploadDir });

router.post('/upload', upload.single('template'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({ 
    message: 'Template uploaded successfully', 
    filename: req.file.originalname,
    path: req.file.path 
  });
});

router.get('/default', (req, res) => {
  const defaultPath = TemplateService.getDefaultTemplatePath();
  res.json({ 
    filename: 'Test Plan - Project1 - SOAP .docx',
    path: defaultPath 
  });
});

export default router;
