import { Router } from 'express';
import { createArticle, deleteArticle, getArticle, getArticles, patchArticle } from '../controllers/articleController.js';
import { requireAdminAuth } from '../middleware/authMiddleware.js';

const articleRouter = Router();

articleRouter.get('/', getArticles);
articleRouter.get('/:id', requireAdminAuth, getArticle);
articleRouter.post('/', requireAdminAuth, createArticle);
articleRouter.patch('/:id', requireAdminAuth, patchArticle);
articleRouter.delete('/:id', requireAdminAuth, deleteArticle);

export default articleRouter;
