import { ArticleModel } from '../models/articleModel.js';

export const getArticles = async (_req, res) => {
  try {
    const rows = await ArticleModel.getAllArticles();
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await ArticleModel.getArticle(id);
    res.status(200).json(article);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createArticle = async (req, res) => {
  try {
    const created = await ArticleModel.createArticle(req.body);
    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const patchArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await ArticleModel.updateArticle(id, req.body);
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await ArticleModel.deleteArticle(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
