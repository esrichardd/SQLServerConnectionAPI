import { NextFunction, Request, Response } from 'express';
import response from '../config/response';
const TYPES = require('tedious').TYPES;

export function ProductController(dbContext: any) {
    const Fields = 'CodProd, Descrip, CodInst, Descrip2, Refere, Marca, Precio1, Existen, DateUpdate';
    function getProducts(req: Request, res: Response) {
        
        if (req.query.Existen) {
            let parameters: any[] = [];

            parameters.push({
                name: 'Existen',
                type: TYPES.Int,
                val: req.query.Existen
            });

            let query = `SELECT ${Fields} FROM db_adm_storeO.dbo.SAPROD x WHERE Existen>@Existen AND Activo = 1`;
            dbContext.getQuery(query, parameters, false, function (err: any, data: any) {
                return res.json(response(data, err))
            })
            return;
        }

        if (req.query.DateTime) {
            let parameters: any[] = [];
            parameters.push({
                name: 'DateTime',
                type: TYPES.VarChar,
                val: req.query.DateTime
            })
            // let query = `SELECT x.* FROM db_adm_storeO.dbo.SAPROD x WHERE TotalApp_FechaAct > @DateTime AND Activo = 1`;
            let query = `SELECT ${Fields} FROM db_adm_storeO.dbo.SAPROD WHERE DateUpdate > @DateTime AND Activo = 1;`;
            dbContext.getQuery(query, parameters, false, function (err: any, data: any) {
                return res.json(response(data, err))
            })
            return;
        }

        if (req.query.page) {
            let parameters: any[] = [];

            let paged = (Number(req.query.page) * 1000)
            console.log(paged)
            parameters.push({
                name: 'pag',
                type: TYPES.Int,
                val: paged
            })
            parameters.push({
                name: 'per_page',
                type: TYPES.Int,
                val: 1000
            })
            let query = `SELECT ${Fields} FROM db_adm_storeO.dbo.SAPROD x WHERE Existen > 0 ORDER BY Existen DESC offset @pag rows fetch next @per_page rows only`;
            dbContext.getQuery(query, parameters, false, function (err: any, data: any) {
                return res.json(response(data, err))
            })
            return;
        }
        let query = `SELECT ${Fields} FROM db_adm_storeO.dbo.SAPROD x WHERE Existen > 0 AND Activo = 1`;
        dbContext.get(query, function (err: any, data: any) {
            // console.log(data[0].length)
            return res.json(response(data, err))
        })
    }

    function findProduct(req: any, res: Response, next: NextFunction) {
        if (req.params.id) {
            let parameters: any = [];
            parameters.push({ name: 'CodProd', type: TYPES.VarChar, val: req.params.id })
            let query = `SELECT ${Fields} FROM db_adm_storeO.dbo.SAPROD x WHERE CodProd = @CodProd`;
            dbContext.getQuery(query, parameters, false, function (err: any, data: any) {
                if (data) {
                    req.data = data[0];
                    return next();
                }
                return res.status(404).json({ message: 'Interceptor Error' });
            })
        }
    }

    function getProduct(req: any, res: Response) {
        return res.json(req.data);
    }

    function putProduct(req: any, res: Response) {

        let parameters: any[] = [];
        let query = `UPDATE db_adm_storeO.dbo.SAPROD SET `;
        let count = 1;
        req.body.forEach((element: any) => {
            let type_ = element.type == "Int" ? TYPES.Int : TYPES.DateTime;
            parameters.push({ name: element.name, type: type_, val: element.val });
            query = count < req.body.length ? query + `${element.name}=@${element.name}, ` : query + `${element.name}=@${element.name} `;
            count++;
        });

        parameters.push({ name: 'CodProd', type: TYPES.VarChar, val: req.params.id })
        query = query + `WHERE CodProd=@CodProd;`;

        dbContext.post(query, parameters, function (err: any, data: any) {
            if (!err) {
                data = { status: 'success' }
            }
            return res.json(response(data, err))
        })
    }

    return {
        getAll: getProducts,
        get: getProduct,
        put: putProduct,
        intercept: findProduct
    }

}