import { Router } from 'express';
import { GoogleGenAI } from '@google/genai';
import { spawn } from 'child_process';
import path from 'path';
import { db } from '../db/database';
import { AuthenticatedRequest } from '../middleware/auth';

const router = Router();

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Helper to execute Python AI Engine
function runPythonAI(message: string, role: string, userName: string): Promise<any> {
  return new Promise((resolve) => {
    const scriptPath = path.join(process.cwd(), 'server', 'ai_bot.py');
    const inputPayload = JSON.stringify({
      message,
      role,
      name: userName,
    });

    const pyProcess = spawn('python3', [scriptPath, inputPayload], {
      env: process.env,
    });

    let stdoutData = '';
    let stderrData = '';

    pyProcess.stdout.on('data', (chunk) => {
      stdoutData += chunk.toString();
    });

    pyProcess.stderr.on('data', (chunk) => {
      stderrData += chunk.toString();
    });

    pyProcess.on('close', (code) => {
      if (stdoutData.trim()) {
        try {
          // Extract JSON part if any log precedes
          const jsonStart = stdoutData.indexOf('{');
          const jsonStr = jsonStart !== -1 ? stdoutData.slice(jsonStart) : stdoutData;
          const parsed = JSON.parse(jsonStr);
          return resolve(parsed);
        } catch (parseErr) {
          console.warn('[Python AI] JSON parse error, raw output:', stdoutData);
        }
      }

      // Fallback response if python script fails
      resolve({
        reply: `ARIYO Smart Campus Assistant: Regarding "${message}". Students must maintain 75% attendance to qualify for end-term examinations. CGPA is computed across all credit courses on a 10-point scale.`,
        suggestions: [
          'What is the attendance requirement?',
          'How is CGPA calculated?',
          'Where can I submit assignments?',
        ],
        source: 'python-fallback',
      });
    });

    pyProcess.on('error', (err) => {
      console.warn('[Python AI] Process spawn error:', err);
      resolve({
        reply: `ARIYO AI Assistant: Greetings! Attendance threshold is 75%, and evaluations follow the 10-point grading system.`,
        suggestions: ['Attendance rules', 'Grading scale', 'Emergency contacts'],
        source: 'system-fallback',
      });
    });
  });
}

// POST /api/ai/chat
router.post('/chat', async (req: AuthenticatedRequest, res) => {
  const { message, forcePython, conversationHistory } = req.body;

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({
      success: false,
      message: 'A message query is required.',
    });
  }

  const query = message.trim();
  const role = req.user?.role || 'STUDENT';
  const userName = req.user?.name || 'Student';

  // If user requested Python directly or if GEMINI_API_KEY is not configured
  if (forcePython || !process.env.GEMINI_API_KEY) {
    const pythonResult = await runPythonAI(query, role, userName);
    return res.json({
      success: true,
      data: {
        reply: pythonResult.reply,
        suggestions: pythonResult.suggestions || [],
        provider: 'Python Campus Intelligence Engine (Python 3.10)',
        intent: pythonResult.intent || 'general',
      },
    });
  }

  // Live College Context summary for Gemini
  const activeStudentCount = db.students.length;
  const departmentsCount = db.departments.length;
  const facultyCount = db.faculty.length;
  const activeAssignmentsCount = db.assignments.length;

  const systemInstruction = `You are "Ariyo AI Smart Campus Assistant", the intelligent academic and administrative assistant for ARIYO - Smart College Management System.
You speak in a polite, highly helpful, and academically authoritative manner.
Current Campus Live Facts:
- Total Enrolled Students: ${activeStudentCount}
- Academic Departments: ${departmentsCount} (Computer Science & Eng, Electrical & Electronics, Mechanical, Civil, Business Admin)
- Active Faculty: ${facultyCount}
- Active Course Assignments: ${activeAssignmentsCount}
- Attendance Rule: Minimum 75% attendance is strictly required to qualify for semester examinations. Students between 65%-74% must apply for medical condonation via their HOD.
- Grading Scale: 10-Point Absolute scale (A+=10.0 for 90-100%, A=9.0 for 80-89%, B+=8.0 for 70-79%, B=7.0 for 60-69%, C=6.0 for 50-59%, P=4.0 for 40-49%, F=0.0 for <40%).
- Evaluation Breakdown: 30% internal continuous assessments, 20% assignments, 25% practical, 25% final exams.
- User Context: The user chatting with you is named "${userName}" with role "${role}".
Answer questions concisely with clean formatting and markdown bullet points when appropriate.`;

  try {
    const client = getGeminiClient();
    if (client) {
      const response = await client.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: query,
        config: {
          systemInstruction,
          temperature: 0.3,
          maxOutputTokens: 1024,
        },
      });

      const replyText = response.text || '';
      if (replyText.trim()) {
        return res.json({
          success: true,
          data: {
            reply: replyText,
            suggestions: [
              'What is the attendance requirement?',
              'Explain the 10-point CGPA grading scale',
              'How do I submit assignments online?',
              'List campus emergency numbers',
            ],
            provider: 'Gemini 3.8 Flash + Campus Context',
          },
        });
      }
    }
  } catch (geminiErr) {
    console.warn('[AI Routes] Gemini call encountered an issue, seamlessly switching to Python AI Engine:', geminiErr);
  }

  // Graceful fallback to Python AI Engine
  const pythonResult = await runPythonAI(query, role, userName);
  return res.json({
    success: true,
    data: {
      reply: pythonResult.reply,
      suggestions: pythonResult.suggestions || [],
      provider: 'Python Campus Intelligence Engine (Python 3.10)',
      intent: pythonResult.intent || 'general',
    },
  });
});

// GET /api/ai/suggestions - Quick prompt ideas
router.get('/suggestions', (req, res) => {
  return res.json({
    success: true,
    data: [
      {
        category: 'Attendance & Exams',
        prompt: 'What is the minimum attendance requirement to take semester exams?',
      },
      {
        category: 'Grading & CGPA',
        prompt: 'How is the 10-point CGPA calculated at ARIYO?',
      },
      {
        category: 'Assignments',
        prompt: 'How do I submit assignments and what happens if I submit late?',
      },
      {
        category: 'Departments & HODs',
        prompt: 'Who are the Head of Departments for Computer Science and Engineering?',
      },
      {
        category: 'Emergency & Safety',
        prompt: 'What are the 24/7 campus security and health center contact numbers?',
      },
    ],
  });
});

export default router;
