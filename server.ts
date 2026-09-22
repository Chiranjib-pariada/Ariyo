import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { authMiddleware } from './server/middleware/auth';
import authRoutes from './server/routes/authRoutes';
import studentRoutes from './server/routes/studentRoutes';
import facultyRoutes from './server/routes/facultyRoutes';
import departmentRoutes from './server/routes/departmentRoutes';
import courseRoutes from './server/routes/courseRoutes';
import attendanceRoutes from './server/routes/attendanceRoutes';
import assignmentRoutes from './server/routes/assignmentRoutes';
import resultRoutes from './server/routes/resultRoutes';
import timetableRoutes from './server/routes/timetableRoutes';
import noticeRoutes from './server/routes/noticeRoutes';
import eventRoutes from './server/routes/eventRoutes';
import notificationRoutes from './server/routes/notificationRoutes';
import adminRoutes from './server/routes/adminRoutes';
import aiRoutes from './server/routes/aiRoutes';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parsing middlewares
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Global Auth Token Extractor
  app.use(authMiddleware);

  // Health and System Status
  app.get('/api/health', (req, res) => {
    res.json({
      success: true,
      status: 'operational',
      app: 'ARIYO - Smart College Management System',
      tagline: 'Smart Campus. Smarter Future.',
      timestamp: new Date().toISOString(),
    });
  });

  // REST API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/students', studentRoutes);
  app.use('/api/faculty', facultyRoutes);
  app.use('/api/departments', departmentRoutes);
  app.use('/api', courseRoutes); // /api/courses and /api/subjects
  app.use('/api/attendance', attendanceRoutes);
  app.use('/api/assignments', assignmentRoutes);
  app.use('/api/results', resultRoutes);
  app.use('/api/timetable', timetableRoutes);
  app.use('/api/notices', noticeRoutes);
  app.use('/api/events', eventRoutes);
  app.use('/api/notifications', notificationRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/ai', aiRoutes);

  // Centralized Error Handling Middleware
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Unhandled Server Error:', err);
    res.status(500).json({
      success: false,
      message: err?.message || 'Internal server error occurred.',
    });
  });

  // Vite middleware for development vs static production serve
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ARIYO] Smart Campus System running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[ARIYO] Fatal startup error:', err);
  process.exit(1);
});
