import { InquiryModel } from '../models/inquiryModel.js';

export const createInquiry = async (req, res) => {
  try {
    const created = await InquiryModel.createInquiry(req.body);
    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getInquiries = async (_req, res) => {
  try {
    const rows = await InquiryModel.getAllInquiries();
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const patchInquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await InquiryModel.updateStatus(id, status);
    res.status(200).json(updated);
  } catch (error) {
    const isValidationError = error.message.startsWith('Invalid status');
    res.status(isValidationError ? 400 : 400).json({ message: error.message });
  }
};

export const deleteInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await InquiryModel.deleteInquiry(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
