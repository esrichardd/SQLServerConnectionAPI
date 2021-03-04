"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const response_1 = __importDefault(require("../config/response"));
const TYPES = require('tedious').TYPES;
function ProductController(dbContext) {
    const Fields = 'CodProd, Descrip, CodInst, Descrip2, Refere, Marca, Precio1, Existen, DateUpdate';
    function getProducts(req, res) {
        if (req.query.Existen) {
            let parameters = [];
            parameters.push({
                name: 'Existen',
                type: TYPES.Int,
                val: req.query.Existen
            });
            let query = `SELECT ${Fields} FROM db_adm_storeO.dbo.SAPROD x WHERE Existen>@Existen AND Activo = 1`;
            dbContext.getQuery(query, parameters, false, function (err, data) {
                return res.json(response_1.default(data, err));
            });
            return;
        }
        if (req.query.DateTime) {
            let parameters = [];
            parameters.push({
                name: 'DateTime',
                type: TYPES.VarChar,
                val: req.query.DateTime
            });
            // let query = `SELECT x.* FROM db_adm_storeO.dbo.SAPROD x WHERE TotalApp_FechaAct > @DateTime AND Activo = 1`;
            let query = `SELECT ${Fields} FROM db_adm_storeO.dbo.SAPROD WHERE DateUpdate > @DateTime AND Activo = 1;`;
            dbContext.getQuery(query, parameters, false, function (err, data) {
                return res.json(response_1.default(data, err));
            });
            return;
        }
        if (req.query.page) {
            let parameters = [];
            let paged = (Number(req.query.page) * 1000);
            console.log(paged);
            parameters.push({
                name: 'pag',
                type: TYPES.Int,
                val: paged
            });
            parameters.push({
                name: 'per_page',
                type: TYPES.Int,
                val: 1000
            });
            let query = `SELECT ${Fields} FROM db_adm_storeO.dbo.SAPROD x WHERE Existen > 0 ORDER BY Existen DESC offset @pag rows fetch next @per_page rows only`;
            dbContext.getQuery(query, parameters, false, function (err, data) {
                return res.json(response_1.default(data, err));
            });
            return;
        }
        let query = `SELECT ${Fields} FROM db_adm_storeO.dbo.SAPROD x WHERE Existen > 0 AND Activo = 1`;
        dbContext.get(query, function (err, data) {
            // console.log(data[0].length)
            return res.json(response_1.default(data, err));
        });
    }
    function findProduct(req, res, next) {
        if (req.params.id) {
            let parameters = [];
            parameters.push({ name: 'CodProd', type: TYPES.VarChar, val: req.params.id });
            let query = `SELECT ${Fields} FROM db_adm_storeO.dbo.SAPROD x WHERE CodProd = @CodProd`;
            dbContext.getQuery(query, parameters, false, function (err, data) {
                if (data) {
                    req.data = data[0];
                    return next();
                }
                return res.status(404).json({ message: 'Interceptor Error' });
            });
        }
    }
    function getProduct(req, res) {
        return res.json(req.data);
    }
    function putProduct(req, res) {
        let parameters = [];
        let query = `UPDATE db_adm_storeO.dbo.SAPROD SET `;
        let count = 1;
        req.body.forEach((element) => {
            let type_ = element.type == "Int" ? TYPES.Int : TYPES.DateTime;
            parameters.push({ name: element.name, type: type_, val: element.val });
            query = count < req.body.length ? query + `${element.name}=@${element.name}, ` : query + `${element.name}=@${element.name} `;
            count++;
        });
        parameters.push({ name: 'CodProd', type: TYPES.VarChar, val: req.params.id });
        query = query + `WHERE CodProd=@CodProd;`;
        dbContext.post(query, parameters, function (err, data) {
            if (!err) {
                data = { status: 'success' };
            }
            return res.json(response_1.default(data, err));
        });
    }
    return {
        getAll: getProducts,
        get: getProduct,
        put: putProduct,
        intercept: findProduct
    };
}
exports.ProductController = ProductController;
//# sourceMappingURL=controller.js.map