import { UserProfile, FieldName } from '@/app/types/profile';

// Helper function to parse degree and field of study from degree text
function parseDegreeAndField(degreeText: string): { degreeType: string; fieldOfStudy: string } {
  if (!degreeText) {
    return { degreeType: '', fieldOfStudy: '' };
  }

  const text = degreeText.trim();
  
  // Common degree patterns
  const degreePatterns = [
    // "Bachelor of Science in Computer Science"
    /(Bachelor|Master|Associate|Doctorate|PhD|Ph\.D)\.?\s+of\s+([A-Za-z\s]+)/i,
    // "B.S. in Computer Science" or "M.S. in Computer Science"
    /([ABM][A-Z]?\.?[A-Z]?\.?)\s+in\s+([A-Za-z\s]+)/i,
    // "Bachelor's Degree in Computer Science"
    /(Bachelor|Master|Associate|Doctorate)'s?\s+Degree\s+in\s+([A-Za-z\s]+)/i,
    // "Computer Science" (just field of study, no degree)
    /^([A-Za-z\s]+)$/i,
  ];

  for (const pattern of degreePatterns) {
    const match = text.match(pattern);
    if (match) {
      const degreePart = match[1]?.trim();
      const fieldPart = match[2]?.trim();
      
      if (degreePart && fieldPart) {
        // Map degree text to degree options
        let degreeType = '';
        if (degreePart.toLowerCase().includes('bachelor') || /^B\.?[A-Z]?\.?$/i.test(degreePart)) {
          degreeType = 'bachelor';
        } else if (degreePart.toLowerCase().includes('master') || /^M\.?[A-Z]?\.?$/i.test(degreePart)) {
          degreeType = 'master';
        } else if (degreePart.toLowerCase().includes('associate') || /^A\.?[A-Z]?\.?$/i.test(degreePart)) {
          degreeType = 'associate';
        } else if (degreePart.toLowerCase().includes('doctorate') || degreePart.toLowerCase().includes('phd') || degreePart.toLowerCase().includes('ph.d')) {
          degreeType = 'doctorate';
        } else if (degreePart.toLowerCase().includes('high school')) {
          degreeType = 'high_school';
        } else {
          degreeType = 'other';
        }
        
        return { degreeType, fieldOfStudy: fieldPart };
      } else if (fieldPart) {
        // Only field of study found
        return { degreeType: '', fieldOfStudy: fieldPart };
      }
    }
  }

  // If no pattern matches, try to extract degree type from the text
  const lowerText = text.toLowerCase();
  let degreeType = '';
  if (lowerText.includes('bachelor')) {
    degreeType = 'bachelor';
  } else if (lowerText.includes('master')) {
    degreeType = 'master';
  } else if (lowerText.includes('associate')) {
    degreeType = 'associate';
  } else if (lowerText.includes('doctorate') || lowerText.includes('phd') || lowerText.includes('ph.d')) {
    degreeType = 'doctorate';
  } else if (lowerText.includes('high school')) {
    degreeType = 'high_school';
  } else {
    degreeType = 'other';
  }

  return { degreeType, fieldOfStudy: text };
}

// Helper function to parse and format dates (for both education and employment)
function parseDates(dateText: string): { fromDate: string; toDate: string } {
  if (!dateText) {
    return { fromDate: '', toDate: '' };
  }

  const text = dateText.trim();
  
  // Common date patterns
  const datePatterns = [
    // "2020 - 2024" or "2020-2024" (with en dash or regular dash)
    /(\d{4})\s*[-–]\s*(\d{4})/,
    // "2020 to 2024"
    /(\d{4})\s+to\s+(\d{4})/,
    // "2020 - Present" or "2020-Present"
    /(\d{4})\s*[-–]\s*(Present|Current|Now)/i,
    // "2020 to Present"
    /(\d{4})\s+to\s+(Present|Current|Now)/i,
    // "Jan 2020 - Dec 2024" or "January 2020 - December 2024"
    /([A-Za-z]+)\s+(\d{4})\s*[-–]\s*([A-Za-z]+)\s+(\d{4})/i,
    // "Jan 2020 - Present" or "January 2020 - Present"
    /([A-Za-z]+)\s+(\d{4})\s*[-–]\s*(Present|Current|Now)/i,
    // Single year "2024"
    /^(\d{4})$/,
    // Single month year "Jan 2024" or "January 2024"
    /^([A-Za-z]+)\s+(\d{4})$/i,
  ];

  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match) {
      // Handle different pattern types
      if (match.length === 3) {
        // Simple year patterns: "2020 - 2024", "2020 to 2024", "2020 - Present", "2024"
        const fromYear = match[1];
        const toYear = match[2];
        
        // Format as MM/YYYY (using 09 for September as default month)
        const fromDate = `09/${fromYear}`;
        const toDate = toYear && !toYear.toLowerCase().includes('present') && !toYear.toLowerCase().includes('current') && !toYear.toLowerCase().includes('now') 
          ? `09/${toYear}` 
          : '';
        
        return { fromDate, toDate };
      } else if (match.length === 5) {
        // Month year patterns: "Jan 2020 - Dec 2024"
        const fromMonth = match[1];
        const fromYear = match[2];
        const toMonth = match[3];
        const toYear = match[4];
        
        const fromDate = `${getMonthNumber(fromMonth)}/${fromYear}`;
        const toDate = `${getMonthNumber(toMonth)}/${toYear}`;
        
        return { fromDate, toDate };
      } else if (match.length === 4) {
        // Month year to present: "Jan 2020 - Present"
        const fromMonth = match[1];
        const fromYear = match[2];
        
        const fromDate = `${getMonthNumber(fromMonth)}/${fromYear}`;
        const toDate = '';
        
        return { fromDate, toDate };
      }
    }
  }

  return { fromDate: '', toDate: '' };
}

// Helper function to convert month names to numbers
function getMonthNumber(monthName: string): string {
  const months: { [key: string]: string } = {
    'jan': '01', 'january': '01',
    'feb': '02', 'february': '02',
    'mar': '03', 'march': '03',
    'apr': '04', 'april': '04',
    'may': '05',
    'jun': '06', 'june': '06',
    'jul': '07', 'july': '07',
    'aug': '08', 'august': '08',
    'sep': '09', 'september': '09',
    'oct': '10', 'october': '10',
    'nov': '11', 'november': '11',
    'dec': '12', 'december': '12'
  };
  
  return months[monthName.toLowerCase()] || '09'; // Default to September if unknown
}

interface ParsedResume {
  profile: {
    name: string;
    email: string;
    phone: string;
    location: string;
    url: string;
    summary: string;
  };
  educations: Array<{
    school: string;
    degree: string;
    gpa: string;
    date: string;
    descriptions: string[];
  }>;
  workExperiences: Array<{
    company: string;
    jobTitle: string;
    date: string;
    descriptions: string[];
  }>;
  projects: Array<{
    project: string;
    date: string;
    descriptions: string[];
  }>;
  skills: {
    featuredSkills: Array<{
      skill: string;
      rating: number;
    }>;
    descriptions: string[];
  };
  custom: {
    descriptions: string[];
  };
}

export function convertResumeToProfile(resume: ParsedResume): Partial<UserProfile> {
  const profile: Partial<UserProfile> = {};

  // Convert profile information
  if (resume.profile.name) {
    profile[FieldName.FULL_NAME] = resume.profile.name;
  }
  if (resume.profile.email) {
    profile[FieldName.EMAIL] = resume.profile.email;
  }
  if (resume.profile.phone) {
    profile[FieldName.PHONE_NUMBER] = resume.profile.phone;
  }
  if (resume.profile.location) {
    profile[FieldName.CURRENT_LOCATION] = resume.profile.location;
  }
  if (resume.profile.url) {
    // Try to determine if it's LinkedIn or GitHub based on the URL
    const url = resume.profile.url.toLowerCase();
    if (url.includes('linkedin.com/in/')) {
      const username = url.split('linkedin.com/in/')[1]?.split('/')[0] || '';
      profile[FieldName.LINKEDIN] = username;
    } else if (url.includes('github.com/')) {
      const username = url.split('github.com/')[1]?.split('/')[0] || '';
      profile[FieldName.GITHUB] = username;
    }
  }

  // Convert education
  if (resume.educations && resume.educations.length > 0) {
    profile[FieldName.EDUCATION] = resume.educations.map(edu => {
      // Parse degree and field of study from the degree text
      const { degreeType, fieldOfStudy } = parseDegreeAndField(edu.degree);
      
      // Parse and format dates
      const { fromDate, toDate } = parseDates(edu.date);
      
      return {
        [FieldName.SCHOOL]: edu.school,
        [FieldName.DEGREE]: degreeType,
        [FieldName.FIELD_OF_STUDY]: fieldOfStudy,
        [FieldName.EDUCATION_FROM]: fromDate,
        [FieldName.EDUCATION_TO]: toDate,
        [FieldName.EDUCATION_GPA]: edu.gpa,
      };
    });
  }

  // Convert work experience
  if (resume.workExperiences && resume.workExperiences.length > 0) {
    profile[FieldName.EMPLOYMENT] = resume.workExperiences.map(work => {
      // Parse and format dates
      const { fromDate, toDate } = parseDates(work.date);

      return {
        [FieldName.COMPANY]: work.company,
        [FieldName.POSITION]: work.jobTitle,
        [FieldName.EMPLOYMENT_FROM]: fromDate,
        [FieldName.EMPLOYMENT_TO]: toDate,
        [FieldName.EMPLOYMENT_DESCRIPTION]: work.descriptions.join(' ')
      };
    });
  }

  // Convert projects
  if (resume.projects && resume.projects.length > 0) {
    profile[FieldName.PROJECT] = resume.projects.map(project => ({
      [FieldName.PROJECT_NAME]: project.project,
      [FieldName.PROJECT_DESCRIPTION]: project.descriptions.join(' ')
    }));
  }

  // Convert skills
  if (resume.skills) {
    const allSkills: string[] = [];
    
    // Extract skills from descriptions
    if (resume.skills.descriptions) {
      resume.skills.descriptions.forEach(desc => {
        // Extract skills from descriptions like "Languages Python, Go, SQL, C#, TypeScript, C++, Kotlin"
        const skillMatches = desc.match(/[A-Za-z#+][A-Za-z#+.]*/g);
        if (skillMatches) {
          allSkills.push(...skillMatches);
        }
      });
    }

    // Add featured skills if they have names
    if (resume.skills.featuredSkills) {
      resume.skills.featuredSkills.forEach(featured => {
        if (featured.skill) {
          allSkills.push(featured.skill);
        }
      });
    }

    // Remove duplicates and filter out common words
    const commonWords = ['Languages', 'Tools', 'Libraries', '&'];
    const filteredSkills = allSkills
      .filter(skill => skill.length > 1 && !commonWords.includes(skill))
      .filter((skill, index, arr) => arr.indexOf(skill) === index);

    if (filteredSkills.length > 0) {
      profile[FieldName.SKILLS] = filteredSkills;
    }
  }

  return profile;
}
