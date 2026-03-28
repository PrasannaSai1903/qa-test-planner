import express from 'express';
import cors from 'cors';
import jiraRoutes from '../backend/src/routes/jira';
import llmRoutes from '../backend/src/routes/llm';
import generateRoutes from '../backend/src/routes/generate';
import exportRoutes from '../backend/src/routes/export';
import templateRoutes from '../backend/src/routes/template';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('/tmp')); // Map uploads output to /tmp in Vercel or use disk locally
if (process.env.NODE_ENV !== 'production') {
  app.use('/uploads', express.static('uploads'));
}

app.use('/api/jira', jiraRoutes);
app.use('/api/llm', llmRoutes);
app.use('/api/generate', generateRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/template', templateRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Only listen when running locally, Vercel handles the serverless instantiation
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
