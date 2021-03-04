import express from 'express';
import dbContext from '../database/dbContext';
import { ProductController } from '../controllers/controller';

const _ProductController = ProductController(dbContext);

const router = express.Router();

router.get('/', (req, res) => { res.status(200).json({ message: 'Connected' }) })

router.get('/products', _ProductController.getAll)
router.use('/products/:id', _ProductController.intercept)

router.get('/products/:id', _ProductController.get)
router.put('/products/:id', _ProductController.put)

// router.get('/', controller.getRoutePrimary);
// router.get('/products', controller.getProductsStock);
export = router;