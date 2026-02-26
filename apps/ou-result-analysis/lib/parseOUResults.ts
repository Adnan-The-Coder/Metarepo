import {
  StudentResult,
  SubjectResult,
  SemesterResult,
  APIResultEntry,
  SEMESTER_3_SUBJECTS,
  OverviewStats,
  GradeDistribution,
  SubjectAnalytics,
  SemesterAnalytics,
  SubjectGradeBreakdown,
} from "./types";

// ─── HTML Parser ──────────────────────────────────────────────────────────────

/**
 * Parses a single student's HTML response
 */
export function parseStudentHTML(entry: APIResultEntry): StudentResult | null {
  const html = entry.html_response;
  
  try {
    // Extract Personal Details
    const rollnumber = entry.rollnumber;
    
    // Extract name (after "Name" label)
    let name = "";
    const nameMatch = html.match(/Name<\/font><\/td>\s*<td[^>]*><b><font[^>]*>\s*([^<]+)<\/font><\/b><\/td>/i);
    if (nameMatch) {
      name = nameMatch[1].trim();
    }
    
    // Extract father's name
    let fatherName = "";
    const fatherMatch = html.match(/Father's Name<\/font><\/td>\s*<td[^>]*><b><font[^>]*>([^<]+)<\/font><\/b><\/td>/i);
    if (fatherMatch) {
      fatherName = fatherMatch[1].trim();
    }
    
    // Extract gender
    let gender = "";
    const genderMatch = html.match(/Gender<\/font><\/td>\s*[\s\S]*?<td[^>]*><b>\s*<font[^>]*>([^<]+)<\/font><\/b><\/td>/i);
    if (genderMatch) {
      gender = genderMatch[1].trim();
    }
    
    // Extract course
    let course = "";
    const courseMatch = html.match(/Course<\/font><\/td>\s*<td[^>]*><b><font[^>]*>([^<]+)<\/font><\/b><\/td>/i);
    if (courseMatch) {
      course = courseMatch[1].trim();
    }
    
    // Extract medium
    let medium = "";
    const mediumMatch = html.match(/Medium<\/font><\/td>\s*[\s\S]*?<td[^>]*><b><font[^>]*>\s*([^<]+)<\/font><\/b><\/td>/i);
    if (mediumMatch) {
      medium = mediumMatch[1].trim();
    }
    
    // ─── Extract Subjects ─────────────────────────────────────────────────────
    const subjects: SubjectResult[] = [];
    
    // Find Marks Details section
    const marksStart = html.indexOf("Marks Details");
    const resultStart = html.indexOf(">Result<", marksStart);
    
    if (marksStart > -1 && resultStart > marksStart) {
      const marksSection = html.substring(marksStart, resultStart);
      
      // Match each subject row: Code | Subject | Credits | Grade Points | Grade
      const subjectRowRegex = /<tr><td[^>]*><b><font[^>]*>&nbsp;([^<\s]+)\s*<\/font><\/b><\/td>\s*<td[^>]*><b><font[^>]*>&nbsp;([^<]+)&nbsp;<\/font><\/b><\/td>\s*<td[^>]*><b><font[^>]*>&nbsp;(\d+)\s*<\/font><\/b><\/td>\s*<td[^>]*><b><font[^>]*>&nbsp;([^\s<]+)\s*<\/font><\/b><\/td>\s*<td[^>]*><b><font[^>]*>&nbsp;([^\s<]+)\s*<\/font><\/b><\/td>/gi;
      
      let match;
      while ((match = subjectRowRegex.exec(marksSection)) !== null) {
        const gradePointsStr = match[4].trim();
        const gradePoints = gradePointsStr === "-" ? -1 : parseInt(gradePointsStr, 10);
        
        subjects.push({
          code: match[1].trim(),
          name: match[2].trim(),
          credits: parseInt(match[3].trim(), 10),
          gradePoints: isNaN(gradePoints) ? -1 : gradePoints,
          grade: match[5].trim(),
        });
      }
    }
    
    // ─── Extract Semester Results ─────────────────────────────────────────────
    const semesterResults: SemesterResult[] = [];
    
    // Find Result section
    const resultSectionStart = html.indexOf(">Result<");
    if (resultSectionStart > -1) {
      const resultSection = html.substring(resultSectionStart);
      
      // Match semester result rows
      const semRegex = /<td[^>]*><b>\s*<font[^>]*>\s*(\d+)\s*<\/font><\/b><\/td>\s*<td[^>]*><b>\s*<font[^>]*>\s*([^<]+)<\/font><\/b><\/td>\s*<td[^>]*><b>\s*<font[^>]*>\s*([^<]+)<\/font><\/b><\/td>/gi;
      
      let semMatch;
      while ((semMatch = semRegex.exec(resultSection)) !== null) {
        const semester = parseInt(semMatch[1].trim(), 10);
        const resultStr = semMatch[2].trim();
        const cgpaStr = semMatch[3].trim();
        
        // Parse SGPA from result string like "PASSED-7.33" or "PROMOTED--"
        let sgpa: number | null = null;
        const sgpaMatch = resultStr.match(/(\d+\.?\d*)/);
        if (sgpaMatch) {
          sgpa = parseFloat(sgpaMatch[1]);
        }
        
        // Determine pass status
        const isPassed = resultStr.includes("PASSED") || 
                        resultStr.includes("COMPLETED") ||
                        resultStr.includes("PROMOTED") ||
                        resultStr.includes("ALREADY PROMOTED");
        
        const isPromoted = resultStr.includes("PROMOTED");
        
        let cgpa: number | null = null;
        if (cgpaStr && cgpaStr !== "-") {
          const cgpaNum = parseFloat(cgpaStr);
          if (!isNaN(cgpaNum)) cgpa = cgpaNum;
        }
        
        semesterResults.push({
          semester,
          result: resultStr,
          sgpa,
          cgpa,
          isPassed,
          isPromoted,
        });
      }
    }
    
    return {
      id: entry.id,
      rollnumber,
      name,
      fatherName,
      gender,
      course,
      medium,
      subjects,
      semesterResults,
      resultReleaseMonthYear: entry.result_release_month_year,
      createdAt: entry.createdAt,
    };
  } catch (error) {
    console.error("Error parsing HTML for roll number:", entry.rollnumber, error);
    return null;
  }
}

/**
 * Parses all API results into StudentResult array
 */
export function parseAllResults(entries: APIResultEntry[]): StudentResult[] {
  const results: StudentResult[] = [];
  
  for (const entry of entries) {
    const parsed = parseStudentHTML(entry);
    if (parsed) {
      results.push(parsed);
    }
  }
  
  return results;
}

// ─── Analytics Computation ────────────────────────────────────────────────────

/**
 * Computes overview statistics for a given semester
 * 
 * Key definitions:
 * - passedNoBacklogs: Students with result "PASSED" AND no F grades in Sem 3 subjects
 * - promotedWithBacklogs: Students with result "PROMOTED" (passed semester but have backlogs)
 * - studentsWithFGrades: Students who have at least one F grade in Sem 3 subjects
 */
export function computeOverviewStats(
  students: StudentResult[],
  semester: number
): OverviewStats {
  const totalStudents = students.length;
  const sem3SubjectCodes = Object.keys(SEMESTER_3_SUBJECTS);
  
  let passedNoBacklogs = 0;     // PASSED status + no F grades
  let promotedWithBacklogs = 0; // PROMOTED status
  let studentsWithFGrades = 0;  // Has at least one F grade
  let distinctionCount = 0;
  let firstClassCount = 0;
  let secondClassCount = 0;
  let totalBacklogs = 0;
  let totalSGPA = 0;
  let sgpaCount = 0;
  
  for (const student of students) {
    // Find semester result for this semester
    const semResult = student.semesterResults.find(r => r.semester === semester);
    
    // Count F grades in Sem 3 subjects for this student
    let studentFCount = 0;
    for (const subject of student.subjects) {
      if (semester === 3 && sem3SubjectCodes.includes(subject.code)) {
        if (subject.grade === "F") {
          studentFCount++;
          totalBacklogs++;
        }
      }
    }
    
    if (studentFCount > 0) {
      studentsWithFGrades++;
    }
    
    if (semResult) {
      // Check if PROMOTED (passed with backlogs)
      if (semResult.isPromoted) {
        promotedWithBacklogs++;
      } 
      // Check if PASSED with no F grades
      else if (semResult.result.includes("PASSED") && studentFCount === 0) {
        passedNoBacklogs++;
        
        // Classification based on SGPA for students who passed cleanly
        if (semResult.sgpa !== null) {
          if (semResult.sgpa >= 8.5) {
            distinctionCount++;
          } else if (semResult.sgpa >= 7.0) {
            firstClassCount++;
          } else if (semResult.sgpa >= 5.0) {
            secondClassCount++;
          }
        }
      }
      
      // Track SGPA for all who have it (for average calculation)
      if (semResult.sgpa !== null) {
        totalSGPA += semResult.sgpa;
        sgpaCount++;
      }
    }
  }
  
  // All students who passed (with or without backlogs)
  const passedStudents = passedNoBacklogs + promotedWithBacklogs;
  
  // Failed = truly failed (not passed, not promoted)
  const failedStudents = totalStudents - passedStudents;
  
  // Pass percentage = students who passed with NO backlogs
  const passPercentage = totalStudents > 0 ? (passedNoBacklogs / totalStudents) * 100 : 0;
  const averageSGPA = sgpaCount > 0 ? totalSGPA / sgpaCount : 0;
  
  return {
    totalStudents,
    passedStudents,
    passedNoBacklogs,
    promotedWithBacklogs,
    studentsWithFGrades,
    failedStudents,
    passPercentage,
    distinctionCount,
    firstClassCount,
    secondClassCount,
    totalBacklogs,
    averageSGPA,
  };
}

/**
 * Computes grade distribution across all students for a semester
 */
export function computeGradeDistribution(
  students: StudentResult[],
  semester: number
): GradeDistribution[] {
  const gradeCount: Record<string, number> = {
    "S": 0,
    "A": 0,
    "B": 0,
    "C": 0,
    "D": 0,
    "E": 0,
    "F": 0,
    "Ab": 0,
  };
  
  const sem3SubjectCodes = Object.keys(SEMESTER_3_SUBJECTS);
  
  let totalGrades = 0;
  
  for (const student of students) {
    for (const subject of student.subjects) {
      // For semester 3, only count sem 3 subjects
      if (semester === 3 && !sem3SubjectCodes.includes(subject.code)) {
        continue;
      }
      
      const grade = subject.grade;
      if (Object.prototype.hasOwnProperty.call(gradeCount, grade)) {
        gradeCount[grade]++;
        totalGrades++;
      }
    }
  }
  
  const gradeColors: Record<string, string> = {
    "S": "#06b6d4",   // cyan - Outstanding
    "A": "#10b981",   // emerald - Excellent
    "B": "#84cc16",   // lime - Good
    "C": "#f59e0b",   // amber - Average
    "D": "#f97316",   // orange - Below Average
    "E": "#ef4444",   // red - Poor
    "F": "#6b7280",   // gray - Fail
    "Ab": "#374151",  // dark gray - Absent
  };
  
  const gradeLabels: Record<string, string> = {
    "S": "S (Outstanding)",
    "A": "A (Excellent)",
    "B": "B (Good)",
    "C": "C (Average)",
    "D": "D (Below Avg)",
    "E": "E (Poor)",
    "F": "F (Fail)",
    "Ab": "Absent",
  };
  
  return Object.entries(gradeCount)
    .filter(([, count]) => count > 0)
    .map(([grade, count]) => ({
      grade: gradeLabels[grade] || grade,
      count,
      percentage: totalGrades > 0 ? (count / totalGrades) * 100 : 0,
      color: gradeColors[grade] || "#6b7280",
    }))
    .sort((a, b) => {
      const order = ["S", "A", "B", "C", "D", "E", "F", "Ab"];
      return order.indexOf(a.grade.charAt(0)) - order.indexOf(b.grade.charAt(0));
    });
}

/**
 * Computes subject-wise analytics for a semester
 */
export function computeSubjectAnalytics(
  students: StudentResult[],
  semester: number
): SubjectAnalytics[] {
  const subjectStats: Record<string, {
    code: string;
    name: string;
    totalAppeared: number;
    totalPassed: number;
    totalFailed: number;
    totalAbsent: number;
    totalGradePoints: number;
    gradePointsCount: number;
    gradeDistribution: Record<string, number>;
  }> = {};
  
  const sem3SubjectCodes = Object.keys(SEMESTER_3_SUBJECTS);
  
  for (const student of students) {
    for (const subject of student.subjects) {
      // For semester 3, only count sem 3 subjects
      if (semester === 3 && !sem3SubjectCodes.includes(subject.code)) {
        continue;
      }
      
      const key = subject.code;
      
      if (!subjectStats[key]) {
        subjectStats[key] = {
          code: subject.code,
          name: subject.name,
          totalAppeared: 0,
          totalPassed: 0,
          totalFailed: 0,
          totalAbsent: 0,
          totalGradePoints: 0,
          gradePointsCount: 0,
          gradeDistribution: {},
        };
      }
      
      const stat = subjectStats[key];
      
      if (subject.grade === "Ab") {
        stat.totalAbsent++;
      } else {
        stat.totalAppeared++;
        
        if (subject.grade === "F") {
          stat.totalFailed++;
        } else {
          stat.totalPassed++;
        }
        
        if (subject.gradePoints >= 0) {
          stat.totalGradePoints += subject.gradePoints;
          stat.gradePointsCount++;
        }
      }
      
      // Track grade distribution
      const grade = subject.grade;
      stat.gradeDistribution[grade] = (stat.gradeDistribution[grade] || 0) + 1;
    }
  }
  
  return Object.values(subjectStats).map(stat => {
    const passPercentage = stat.totalAppeared > 0 
      ? (stat.totalPassed / stat.totalAppeared) * 100 
      : 0;
    
    const averageGradePoints = stat.gradePointsCount > 0 
      ? stat.totalGradePoints / stat.gradePointsCount 
      : 0;
    
    // Determine difficulty based on pass percentage
    let difficulty: "Easy" | "Medium" | "Hard";
    if (passPercentage >= 80) {
      difficulty = "Easy";
    } else if (passPercentage >= 60) {
      difficulty = "Medium";
    } else {
      difficulty = "Hard";
    }
    
    return {
      code: stat.code,
      name: stat.name,
      totalAppeared: stat.totalAppeared,
      totalPassed: stat.totalPassed,
      passPercentage,
      totalFailed: stat.totalFailed,
      totalAbsent: stat.totalAbsent,
      averageGradePoints,
      gradeDistribution: stat.gradeDistribution,
      difficulty,
    };
  }).sort((a, b) => a.passPercentage - b.passPercentage); // Sort by difficulty (lowest pass % first)
}

/**
 * Get semester data from student results
 */
export function getAvailableSemesters(students: StudentResult[]): number[] {
  const semesters = new Set<number>();
  
  for (const student of students) {
    for (const semResult of student.semesterResults) {
      semesters.add(semResult.semester);
    }
  }
  
  return Array.from(semesters).sort((a, b) => a - b);
}

/**
 * Filter students by semester (students who have results for that semester)
 */
export function filterStudentsBySemester(
  students: StudentResult[],
  semester: number
): StudentResult[] {
  return students.filter(student =>
    student.semesterResults.some(r => r.semester === semester)
  );
}

/**
 * Compute per-subject grade breakdown for meaningful analysis
 * Shows S/A/B/C/D/E/F count for each subject
 */
export function computeSubjectGradeBreakdown(
  students: StudentResult[],
  semester: number
): SubjectGradeBreakdown[] {
  const sem3SubjectCodes = Object.keys(SEMESTER_3_SUBJECTS);
  
  const breakdown: Record<string, SubjectGradeBreakdown> = {};
  
  for (const student of students) {
    for (const subject of student.subjects) {
      // For semester 3, only count sem 3 subjects
      if (semester === 3 && !sem3SubjectCodes.includes(subject.code)) {
        continue;
      }
      
      const code = subject.code;
      
      if (!breakdown[code]) {
        breakdown[code] = {
          code,
          name: subject.name,
          sCount: 0,
          aCount: 0,
          bCount: 0,
          cCount: 0,
          dCount: 0,
          eCount: 0,
          fCount: 0,
          abCount: 0,
          totalAppeared: 0,
        };
      }
      
      const entry = breakdown[code];
      
      // Count by grade
      switch (subject.grade) {
        case "S": entry.sCount++; entry.totalAppeared++; break;
        case "A": entry.aCount++; entry.totalAppeared++; break;
        case "B": entry.bCount++; entry.totalAppeared++; break;
        case "C": entry.cCount++; entry.totalAppeared++; break;
        case "D": entry.dCount++; entry.totalAppeared++; break;
        case "E": entry.eCount++; entry.totalAppeared++; break;
        case "F": entry.fCount++; entry.totalAppeared++; break;
        case "Ab": entry.abCount++; break;
      }
    }
  }
  
  // Sort by subject code
  return Object.values(breakdown).sort((a, b) => a.code.localeCompare(b.code));
}

/**
 * Compute full semester analytics
 */
export function computeSemesterAnalytics(
  students: StudentResult[],
  semester: number
): SemesterAnalytics {
  const filteredStudents = filterStudentsBySemester(students, semester);
  const overviewStats = computeOverviewStats(filteredStudents, semester);
  const gradeDistribution = computeGradeDistribution(filteredStudents, semester);
  const subjects = computeSubjectAnalytics(filteredStudents, semester);
  const subjectGradeBreakdown = computeSubjectGradeBreakdown(filteredStudents, semester);
  
  return {
    semester,
    totalStudents: overviewStats.totalStudents,
    passedStudents: overviewStats.passedStudents,
    passPercentage: overviewStats.passPercentage,
    averageSGPA: overviewStats.averageSGPA,
    subjects,
    gradeDistribution,
    subjectGradeBreakdown,
    overviewStats,
  };
}
