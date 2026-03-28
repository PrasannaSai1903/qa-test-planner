import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
// import PDFDocument from 'pdfkit'; // REMOVED TO FIX VERCEL CRASH
import * as fs from 'fs';
import * as path from 'path';

export class ExportService {
  static async generateDocx(content: string, fileName: string): Promise<string> {
    const doc = new Document({
      sections: [{
        children: content.split('\n').map((line) => {
          if (line.startsWith('# ')) return new Paragraph({ text: line.replace('# ', ''), heading: HeadingLevel.HEADING_1 });
          if (line.startsWith('## ')) return new Paragraph({ text: line.replace('## ', ''), heading: HeadingLevel.HEADING_2 });
          return new Paragraph({
            children: [new TextRun(line)]
          });
        }),
      }],
    });

    const buffer = await Packer.toBuffer(doc);
    const filePath = path.join('/tmp', `${fileName}.docx`);
    fs.writeFileSync(filePath, buffer);
    return filePath;
  }

  static async generatePdf(content: string, fileName: string): Promise<string> {
    // Enable PDF export using /tmp for Vercel compatibility
    const PDFDocument = require('pdfkit');
    const filePath = path.join('/tmp', `${fileName}.pdf`);
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);
    doc.fontSize(12).text(content);
    doc.end();
    return new Promise((resolve, reject) => {
      stream.on('finish', () => resolve(filePath));
      stream.on('error', reject);
    });
  }

  static async generateMd(content: string, fileName: string): Promise<string> {
    const filePath = path.join('/tmp', `${fileName}.md`);
    fs.writeFileSync(filePath, content);
    return filePath;
  }
}

