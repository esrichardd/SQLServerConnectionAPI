"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const dbContext_1 = __importDefault(require("../database/dbContext"));
const controller_1 = require("../controllers/controller");
const _ProductController = controller_1.ProductController(dbContext_1.default);
const router = express_1.default.Router();
router.get('/', (req, res) => { res.status(200).json({ message: 'Connected' }); });
router.get('/products', _ProductController.getAll);
router.use('/products/:id', _ProductController.intercept);
router.get('/products/:id', _ProductController.get);
router.put('/products/:id', _ProductController.put);
module.exports = router;
//# sourceMappingURL=routes.js.map