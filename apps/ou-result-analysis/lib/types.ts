// ─── Types for OU Results Analytics ────────────────────────────────────────────

export interface SubjectResult {
  code: string;
  name: string;
  credits: number;
  gradePoints: number;
  grade: string;
}

export interface SemesterResult {
  semester: number;
  result: string; // "PASSED-7.33", "PROMOTED--", "ALREADY PROMOTED--", etc.
  sgpa: number | null;
  cgpa: number | null;
  isPassed: boolean;
  isPromoted: boolean;
}

export interface StudentResult {
  id: number;
  rollnumber: string;
  name: string;
  fatherName: string;
  gender: string;
  course: string;
  medium: string;
  subjects: SubjectResult[];
  semesterResults: SemesterResult[];
  resultReleaseMonthYear: string;
  createdAt: string;
}

export interface APIResponse {
  success: boolean;
  data: APIResultEntry[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface APIResultEntry {
  id: number;
  rollnumber: string;
  html_response: string;
  result_release_month_year: string;
  createdAt: string;
}

// ─── Semester 3 Subjects (CSE/IT) ─────────────────────────────────────────────
export const SEMESTER_3_SUBJECTS: Record<string, string> = {
  "301E": "OOP USING JAVA",
  "301F": "OOP USING JAVA LAB",
  "302P": "APPLIED OPERATIONS RESEARCH",
  "316": "BASIC ELECTRONICS",
  "391": "EFFECTIVE TECH.COMM.IN ENGLISH",
  "318": "DISCRETE MATHEMATICS",
  "319": "LOGIC AND SWITCHING THEORY",
  "367": "BASIC ELECTRONICS LAB",
  "371": "DATA STRUCTURES LAB",
  "317": "DATA STRUCTURES",
};

// ─── Grade Mapping ────────────────────────────────────────────────────────────
export const GRADE_POINTS_MAP: Record<string, number> = {
  "S": 10,
  "O": 10,
  "A+": 9,
  "A": 9,
  "B+": 8,
  "B": 8,
  "C": 7,
  "D": 6,
  "E": 5,
  "F": 0,
  "Ab": -1, // Absent
};

export const GRADE_TO_MARKS_RANGE: Record<string, string> = {
  "S": "90-100 (Outstanding)",
  "O": "90-100 (Outstanding)",
  "A+": "80-89",
  "A": "70-79",
  "B+": "60-69",
  "B": "50-59",
  "C": "45-49",
  "D": "40-44",
  "E": "35-39",
  "F": "0-34 (Fail)",
  "Ab": "Absent",
};

// ─── Analytics Types ──────────────────────────────────────────────────────────
export interface OverviewStats {
  totalStudents: number;
  passedStudents: number;         // All who cleared the semester (PASSED + PROMOTED + ALREADY PROMOTED)
  passedNoBacklogs: number;       // Students with "PASSED" and NO F grades in Sem 3 subjects
  promotedWithBacklogs: number;   // Students with "PROMOTED" status (passed with backlogs)
  studentsWithFGrades: number;    // Students who have at least one F grade in Sem 3
  failedStudents: number;         // Truly failed (neither passed nor promoted)
  passPercentage: number;         // passedNoBacklogs / totalStudents
  distinctionCount: number;       // Students with SGPA >= 8.5
  firstClassCount: number;        // Students with SGPA >= 7.0 and < 8.5
  secondClassCount: number;       // Students with SGPA >= 5.0 and < 7.0
  totalBacklogs: number;          // Total F grades across all students in Sem 3 subjects
  averageSGPA: number;
}

// Per-subject grade breakdown for meaningful analysis
export interface SubjectGradeBreakdown {
  code: string;
  name: string;
  sCount: number;
  aCount: number;
  bCount: number;
  cCount: number;
  dCount: number;
  eCount: number;
  fCount: number;
  abCount: number;
  totalAppeared: number;
}

export interface GradeDistribution {
  grade: string;
  count: number;
  percentage: number;
  color: string;
}

export interface SubjectAnalytics {
  code: string;
  name: string;
  totalAppeared: number;
  totalPassed: number;
  passPercentage: number;
  totalFailed: number;
  totalAbsent: number;
  averageGradePoints: number;
  gradeDistribution: Record<string, number>;
  difficulty: "Easy" | "Medium" | "Hard";
}

export interface SemesterAnalytics {
  semester: number;
  totalStudents: number;
  passedStudents: number;
  passPercentage: number;
  averageSGPA: number;
  subjects: SubjectAnalytics[];
  gradeDistribution: GradeDistribution[];
  subjectGradeBreakdown: SubjectGradeBreakdown[];  // Per-subject S/A/B/C/D/E/F breakdown
  overviewStats: OverviewStats;
}
