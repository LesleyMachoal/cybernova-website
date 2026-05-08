import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '../../data');
const caseStudiesFile = path.join(dataDir, 'caseStudies.json');

const ensureDataDir = () => {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

const readCaseStudies = () => {
  ensureDataDir();
  if (!fs.existsSync(caseStudiesFile)) {
    return [];
  }
  try {
    return JSON.parse(fs.readFileSync(caseStudiesFile, 'utf-8')) || [];
  } catch {
    return [];
  }
};

const writeCaseStudies = (studies) => {
  ensureDataDir();
  fs.writeFileSync(caseStudiesFile, JSON.stringify(studies, null, 2));
};

export const CaseStudyModel = {
  getCaseStudies: async () => readCaseStudies(),

  createCaseStudy: async (studyData) => {
    const studies = readCaseStudies();
    const newStudy = {
      id: Date.now().toString(),
      ...studyData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    studies.unshift(newStudy);
    writeCaseStudies(studies);
    return newStudy;
  },

  updateCaseStudy: async (id, studyData) => {
    const studies = readCaseStudies();
    const index = studies.findIndex((s) => String(s.id) === String(id));
    if (index === -1) return null;
    
    studies[index] = {
      ...studies[index],
      ...studyData,
      id: studies[index].id,
      created_at: studies[index].created_at,
      updated_at: new Date().toISOString(),
    };
    writeCaseStudies(studies);
    return studies[index];
  },

  deleteCaseStudy: async (id) => {
    const studies = readCaseStudies();
    const filtered = studies.filter((s) => String(s.id) !== String(id));
    writeCaseStudies(filtered);
    return true;
  },
};
