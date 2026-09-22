#!/usr/bin/env python3
"""
ARIYO Smart College Management System - Python AI Assistant Engine
Provides campus domain reasoning, policy answering, and AI chat processing.
Can be invoked standalone or via IPC from the Express server.
"""

import sys
import os
import json
import re
import urllib.request
import urllib.error

CAMPUS_KNOWLEDGE = {
    "name": "ARIYO Smart College Management System",
    "motto": "Smart Campus. Smarter Future.",
    "policies": {
        "attendance": (
            "Students must maintain a minimum of 75% attendance in each enrolled course to be eligible "
            "for semester end-term examinations. Students falling between 65% and 74% due to documented "
            "medical emergencies or official university representation may apply for condonation through their Department HOD."
        ),
        "grading": (
            "ARIYO follows a 10-Point Relative & Absolute Grading System:\n"
            "• A+ (90-100%): 10.0 Grade Point (Outstanding)\n"
            "• A  (80-89%) : 9.0 Grade Point (Excellent)\n"
            "• B+ (70-79%) : 8.0 Grade Point (Very Good)\n"
            "• B  (60-69%) : 7.0 Grade Point (Good)\n"
            "• C  (50-59%) : 6.0 Grade Point (Above Average)\n"
            "• P  (40-49%) : 4.0 Grade Point (Pass)\n"
            "• F  (<40%)   : 0.0 Grade Point (Fail / Re-appear)\n"
            "CGPA = Total Weighted Grade Points / Total Credits registered."
        ),
        "assignments": (
            "Assignments carry 20% of continuous internal evaluation. Students can upload submissions "
            "directly through the student portal in PDF, DOCX, or ZIP formats. Submissions turned in after the due date "
            "are automatically flagged as 'Late'."
        ),
        "exams": (
            "Semester evaluation comprises Continuous Internal Assessment (30% internal, 20% assignments, 25% practical) "
            "and End-Semester Examination (25%). Admit cards are generated 7 days prior to exams for students with >=75% attendance."
        ),
        "library": (
            "The Central Digital Library is open Monday to Saturday from 8:00 AM to 10:00 PM. "
            "Students may borrow up to 5 books for 14 days, with 24/7 access to IEEE Xplore, ACM Digital Library, and Springer."
        ),
        "emergency": (
            "• Campus Security & Safety: +1 (555) 019-9111 (Ext. 101)\n"
            "• 24/7 Health Center & Ambulance: +1 (555) 019-9112 (Ext. 102)\n"
            "• Student Mental Health & Counseling: +1 (555) 019-9113 (Ext. 103)\n"
            "• IT Helpdesk & Portal Support: support@ariyo.edu (Ext. 104)"
        ),
        "departments": (
            "ARIYO houses 5 core academic schools:\n"
            "1. Department of Computer Science & Engineering (HOD: Dr. Alan Turing)\n"
            "2. Department of Electrical & Electronics (HOD: Dr. Nikola Tesla)\n"
            "3. Department of Mechanical Engineering (HOD: Dr. Ada Lovelace)\n"
            "4. Department of Civil & Environmental Engineering (HOD: Dr. Isambard Brunel)\n"
            "5. School of Management & Business Studies (HOD: Dr. Peter Drucker)"
        )
    }
}

DEFAULT_SUGGESTIONS = [
    "What is the minimum attendance requirement?",
    "Explain how CGPA and grades are calculated",
    "Where can I submit assignments?",
    "List campus emergency contact numbers",
    "Tell me about college departments and HODs"
]

def query_gemini_rest(prompt: str, system_prompt: str, api_key: str) -> str:
    """Call Gemini 3.8 Flash via REST API from Python if GEMINI_API_KEY is available."""
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key={api_key}"
    payload = {
        "contents": [
            {
                "role": "user",
                "parts": [{"text": prompt}]
            }
        ],
        "systemInstruction": {
            "parts": [{"text": system_prompt}]
        },
        "generationConfig": {
            "temperature": 0.3,
            "maxOutputTokens": 1024,
        }
    }
    
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json", "User-Agent": "aistudio-build"}
    )
    
    with urllib.request.urlopen(req, timeout=12) as response:
        result = json.loads(response.read().decode("utf-8"))
        candidates = result.get("candidates", [])
        if candidates and "content" in candidates[0]:
            parts = candidates[0]["content"].get("parts", [])
            if parts and "text" in parts[0]:
                return parts[0]["text"]
    raise Exception("Empty or malformed response from Gemini REST endpoint.")

def answer_query_local(query: str, role: str = "STUDENT", user_name: str = "Student") -> dict:
    """Intelligent rule-based campus expert fallback for Python engine."""
    q = query.lower()
    
    if any(w in q for w in ["attendance", "present", "absent", "percentage", "shortage", "condonation", "bunk"]):
        reply = (
            f"Hello {user_name}! In the ARIYO Smart Campus, attendance is tracked digitally.\n\n"
            f"📌 **Attendance Policy Highlights:**\n"
            f"{CAMPUS_KNOWLEDGE['policies']['attendance']}\n\n"
            f"💡 **Tip:** You can check your live subject-wise attendance percentages anytime in the **'My Attendance'** tab."
        )
        suggestions = ["How is CGPA computed?", "Upcoming exams", "Contact HOD"]
        intent = "attendance_inquiry"

    elif any(w in q for w in ["cgpa", "gpa", "grade", "grading", "marks", "result", "score", "pass"]):
        reply = (
            f"Here is how academic evaluations and grading work at ARIYO:\n\n"
            f"{CAMPUS_KNOWLEDGE['policies']['grading']}\n\n"
            f"📊 **Weightage Distribution:**\n"
            f"{CAMPUS_KNOWLEDGE['policies']['exams']}"
        )
        suggestions = ["What is the attendance requirement?", "Where can I view my results?", "Assignment weightage"]
        intent = "grading_inquiry"

    elif any(w in q for w in ["assignment", "homework", "project", "submission", "submit", "deadline", "late"]):
        reply = (
            f"📝 **Assignment & Submission Guidelines:**\n\n"
            f"{CAMPUS_KNOWLEDGE['policies']['assignments']}\n\n"
            f"• To submit an assignment: Go to **Assignments** in your dashboard, click **'Submit Solution'**, and attach your document.\n"
            f"• Faculty will grade and provide constructive feedback directly through the portal."
        )
        suggestions = ["Explain the grading scale", "View my timetable", "Ask about attendance"]
        intent = "assignment_inquiry"

    elif any(w in q for w in ["emergency", "security", "ambulance", "hospital", "police", "helpdesk", "contact", "phone", "number"]):
        reply = (
            f"🚨 **ARIYO Campus Emergency & Support Hotlines:**\n\n"
            f"{CAMPUS_KNOWLEDGE['policies']['emergency']}\n\n"
            f"All emergency numbers are operational 24/7 with immediate campus response units."
        )
        suggestions = ["Digital library hours", "Campus events", "Contact department"]
        intent = "emergency_inquiry"

    elif any(w in q for w in ["department", "hod", "head", "faculty", "dean", "school", "branches"]):
        reply = (
            f"🏫 **Academic Departments & Leadership at ARIYO:**\n\n"
            f"{CAMPUS_KNOWLEDGE['policies']['departments']}\n\n"
            f"Each department is equipped with modern research laboratories and dedicated student advisory committees."
        )
        suggestions = ["Minimum attendance rule", "How to submit assignments", "Library hours"]
        intent = "department_inquiry"

    elif any(w in q for w in ["library", "book", "borrow", "journal", "ieee"]):
        reply = (
            f"📚 **Central Digital Library Information:**\n\n"
            f"{CAMPUS_KNOWLEDGE['policies']['library']}\n\n"
            f"Digital reading kiosks and study rooms are available on Floors 2 and 3."
        )
        suggestions = ["Emergency contacts", "Grading system", "Attendance policy"]
        intent = "library_inquiry"

    elif any(w in q for w in ["hi", "hello", "hey", "who are you", "what can you do", "help"]):
        reply = (
            f"👋 Greetings {user_name}! I am **Ariyo AI Assistant**, powered by Python intelligence & Gemini for the Smart Campus System.\n\n"
            f"I can assist you with:\n"
            f"• **Academic Policies:** 75% attendance regulations, medical condonations\n"
            f"• **Evaluations:** 10-point CGPA calculation, exam structure, results\n"
            f"• **Coursework:** Assignment submissions, deadlines, curriculum subjects\n"
            f"• **Campus Life:** Timetables, departmental HODs, library access, emergency numbers\n\n"
            f"What would you like to know today?"
        )
        suggestions = DEFAULT_SUGGESTIONS
        intent = "greeting"

    else:
        reply = (
            f"Thank you for reaching out, {user_name}. Regarding '{query}':\n\n"
            f"As your ARIYO Campus Assistant, I can provide immediate information on courses, attendance criteria (75% minimum), "
            f"assignments, grading policies, and campus amenities. If your query requires administrative intervention, you may also "
            f"consult your respective department office or submit an inquiry through the administration desk."
        )
        suggestions = DEFAULT_SUGGESTIONS
        intent = "general_inquiry"

    return {
        "reply": reply,
        "suggestions": suggestions,
        "source": "python-campus-engine",
        "intent": intent
    }

def process_chat(payload: dict) -> dict:
    """Entry point for processing chat queries."""
    query = payload.get("message", "").strip()
    role = payload.get("role", "STUDENT")
    user_name = payload.get("name", "Student")
    api_key = os.environ.get("GEMINI_API_KEY", "")

    if not query:
        return {
            "reply": "Please ask a question about ARIYO courses, attendance, assignments, or campus facilities.",
            "suggestions": DEFAULT_SUGGESTIONS,
            "source": "python-engine"
        }

    # If Gemini API key is available, attempt Gemini generation with rich campus system prompt
    if api_key:
        system_instruction = (
            "You are the official AI Assistant for ARIYO Smart College Management System. "
            "You provide courteous, accurate, and concise guidance to students, faculty, and administrators. "
            "Core College Facts: "
            "1. Attendance: Minimum 75% mandatory attendance required for examinations. "
            "2. Grading: 10-point GPA scale (A+=10, A=9, B+=8, B=7, C=6, P=4, F=0). "
            "3. Internal assessment: 30% internal, 20% assignments, 25% practical, 25% final exam. "
            "4. Submissions: Online via student dashboard. "
            "5. Emergency security: +1 (555) 019-9111. "
            "Keep answers well-structured with bullet points and clear formatting."
        )
        try:
            gemini_reply = query_gemini_rest(query, system_instruction, api_key)
            if gemini_reply:
                return {
                    "reply": gemini_reply,
                    "suggestions": DEFAULT_SUGGESTIONS[:3],
                    "source": "gemini-3.8-flash (via python bridge)",
                    "intent": "llm_answer"
                }
        except Exception as e:
            # Fall back smoothly to local domain knowledge engine
            sys.stderr.write(f"[Python AI Bot] Gemini REST call note: {e}\n")

    # Local python domain knowledge reasoning
    return answer_query_local(query, role=role, user_name=user_name)

if __name__ == "__main__":
    # If run with arguments or stdin
    try:
        input_data = ""
        if len(sys.argv) > 1 and sys.argv[1].startswith("{"):
            input_data = sys.argv[1]
        elif len(sys.argv) > 1 and sys.argv[1] == "--test":
            input_data = json.dumps({"message": "What is the attendance policy?", "role": "STUDENT", "name": "Alex"})
        else:
            input_data = sys.stdin.read()

        if input_data.strip():
            data = json.loads(input_data)
        else:
            data = {"message": "Hello", "role": "STUDENT", "name": "Student"}

        response = process_chat(data)
        print(json.dumps(response, indent=2))
    except Exception as exc:
        err_res = {
            "reply": f"ARIYO AI Service Error: {str(exc)}",
            "suggestions": DEFAULT_SUGGESTIONS,
            "source": "python-error-fallback"
        }
        print(json.dumps(err_res))
