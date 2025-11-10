/**
 * Subject Configuration
 * Defines all available subjects for A Level and Admissions
 */

// All subjects available in the system
export const getAllSubjects = () => {
  return ['Maths', 'Physics', 'English Lit', 'Biology', 'Chemistry'];
};

// Subjects available for admissions/entrance exams
export const getAvailableSubjects = () => {
  return ['TSA', 'UCAT', 'BMAT'];
};

// Get subject category
export function getSubjectCategory(subject: string): 'A Level' | 'Admissions' | 'Unknown' {
  const allSubjects = getAllSubjects();
  const admissionSubjects = getAvailableSubjects();

  if (allSubjects.includes(subject)) {
    return 'A Level';
  } else if (admissionSubjects.includes(subject)) {
    return 'Admissions';
  }

  return 'Unknown';
}

// Get display name for subject
export function getSubjectDisplayName(subject: string): string {
  const displayNames: { [key: string]: string } = {
    'TSA': 'Thinking Skills Assessment (TSA)',
    'UCAT': 'University Clinical Aptitude Test',
    'BMAT': 'BioMedical Admissions Test',
    'English Lit': 'English Literature',
  };

  return displayNames[subject] || subject;
}
