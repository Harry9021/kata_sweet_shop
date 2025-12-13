import { Router, Request, Response } from 'express';
import { body, query, param } from 'express-validator';
import { SweetService } from '../services/sweet.service';
import { authenticate } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validation.middleware';

const router = Router();
const sweetService = new SweetService();

class SweetController {
    public async createSweet(req: Request, res: Response): Promise<void> {
        try {
            const sweet = await sweetService.createSweet(req.body);

            res.status(201).json({
                success: true,
                message: 'Sweet created successfully',
                data: sweet,
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    public async getAllSweets(_req: Request, res: Response): Promise<void> {
        try {
            const sweets = await sweetService.getAllSweets();

            res.status(200).json({
                success: true,
                message: 'Sweets retrieved successfully',
                data: sweets,
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    public async searchSweets(req: Request, res: Response): Promise<void> {
        try {
            const { name, category, minPrice, maxPrice } = req.query;

            const query: any = {};
            if (name) query.name = name as string;
            if (category) query.category = category as string;
            if (minPrice) query.minPrice = parseFloat(minPrice as string);
            if (maxPrice) query.maxPrice = parseFloat(maxPrice as string);

            const sweets = await sweetService.searchSweets(query);

            res.status(200).json({
                success: true,
                message: 'Search completed successfully',
                data: sweets,
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    public async getSweetById(req: Request, res: Response): Promise<void> {
        try {
            const sweet = await sweetService.getSweetById(req.params.id);

            res.status(200).json({
                success: true,
                message: 'Sweet retrieved successfully',
                data: sweet,
            });
        } catch (error: any) {
            res.status(404).json({
                success: false,
                message: error.message,
            });
        }
    }

    public async updateSweet(req: Request, res: Response): Promise<void> {
        try {
            const sweet = await sweetService.updateSweet(req.params.id, req.body);

            res.status(200).json({
                success: true,
                message: 'Sweet updated successfully',
                data: sweet,
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    public async deleteSweet(req: Request, res: Response): Promise<void> {
        try {
            await sweetService.deleteSweet(req.params.id);

            res.status(200).json({
                success: true,
                message: 'Sweet deleted successfully',
            });
        } catch (error: any) {
            res.status(404).json({
                success: false,
                message: error.message,
            });
        }
    }

    public async purchaseSweet(req: Request, res: Response): Promise<void> {
        try {
            const { quantity } = req.body;
            const userId = (req as any).user.userId;
            const sweet = await sweetService.purchaseSweet(req.params.id, userId, quantity);

            res.status(200).json({
                success: true,
                message: 'Purchase successful',
                data: sweet,
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    public async restockSweet(req: Request, res: Response): Promise<void> {
        try {
            const { quantity } = req.body;
            const sweet = await sweetService.restockSweet(req.params.id, quantity);

            res.status(200).json({
                success: true,
                message: 'Restock successful',
                data: sweet,
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
}

const controller = new SweetController();

const createSweetValidation = [
    body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
    body('category')
        .isIn(['Chocolate', 'Candy', 'Gummy', 'Hard Candy', 'Lollipop', 'Toffee', 'Other'])
        .withMessage('Invalid category'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
    body('description').optional().trim().isLength({ max: 500 }).withMessage('Description max 500 characters'),
];

const updateSweetValidation = [
    body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
    body('category')
        .optional()
        .isIn(['Chocolate', 'Candy', 'Gummy', 'Hard Candy', 'Lollipop', 'Toffee', 'Other'])
        .withMessage('Invalid category'),
    body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('quantity').optional().isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
    body('description').optional().trim().isLength({ max: 500 }).withMessage('Description max 500 characters'),
];

const searchValidation = [
    query('name').optional().trim(),
    query('category').optional().trim(),
    query('minPrice').optional().isFloat({ min: 0 }).withMessage('Min price must be positive'),
    query('maxPrice').optional().isFloat({ min: 0 }).withMessage('Max price must be positive'),
];

const idValidation = [
    param('id').isMongoId().withMessage('Invalid sweet ID'),
];

const quantityValidation = [
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
];

router.post(
    '/',
    authenticate,
    requireAdmin,
    validate(createSweetValidation),
    controller.createSweet.bind(controller)
);

router.get(
    '/',
    authenticate,
    controller.getAllSweets.bind(controller)
);

router.get(
    '/search',
    authenticate,
    validate(searchValidation),
    controller.searchSweets.bind(controller)
);

router.get(
    '/:id',
    authenticate,
    validate(idValidation),
    controller.getSweetById.bind(controller)
);

router.put(
    '/:id',
    authenticate,
    requireAdmin,
    validate([...idValidation, ...updateSweetValidation]),
    controller.updateSweet.bind(controller)
);

router.delete(
    '/:id',
    authenticate,
    requireAdmin,
    validate(idValidation),
    controller.deleteSweet.bind(controller)
);

router.post(
    '/:id/purchase',
    authenticate,
    validate([...idValidation, ...quantityValidation]),
    controller.purchaseSweet.bind(controller)
);

router.post(
    '/:id/restock',
    authenticate,
    requireAdmin,
    validate([...idValidation, ...quantityValidation]),
    controller.restockSweet.bind(controller)
);

export default router;
