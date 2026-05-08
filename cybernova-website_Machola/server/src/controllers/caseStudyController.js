import { CaseStudyModel } from '../models/caseStudyModel.js';

export const getCaseStudies = async (req, res) => {
  try {
    const studies = await CaseStudyModel.getCaseStudies();
    res.json(studies);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch case studies', error: err.message });
  }
};

export const createCaseStudy = async (req, res) => {
  try {
    const { title, client, industry, challenge, solution, result, image } = req.body;
    if (!title || !client) {
      return res.status(400).json({ message: 'Title and client are required' });
    }

    const study = await CaseStudyModel.createCaseStudy({
      title,
      client,
      industry: industry || '',
      challenge: challenge || '',
      solution: solution || '',
      result: result || '',
      image: image || '',
    });

    res.status(201).json(study);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create case study', error: err.message });
  }
};

export const updateCaseStudy = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, client, industry, challenge, solution, result, image } = req.body;

    const study = await CaseStudyModel.updateCaseStudy(id, {
      title,
      client,
      industry,
      challenge,
      solution,
      result,
      image,
    });

    if (!study) {
      return res.status(404).json({ message: 'Case study not found' });
    }

    res.json(study);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update case study', error: err.message });
  }
};

export const deleteCaseStudy = async (req, res) => {
  try {
    const { id } = req.params;
    await CaseStudyModel.deleteCaseStudy(id);
    res.json({ message: 'Case study deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete case study', error: err.message });
  }
};
