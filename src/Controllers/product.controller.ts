// ! IMPORTS
import vine from "@vinejs/vine";
import { RequestHandler } from "express"
import { validateData } from "../Utils/validateData/validateData";
import { sendSuccess } from "../Utils/returnSuccess/returnSuccess";
import { handleError } from "../Utils/errorHandler/errorHandler";
import { ProductServices } from "../Services/product.services";
import { Roles, User } from "@prisma/client";
import { Infer } from "@vinejs/vine/build/src/types";


const addProduct: RequestHandler = async (req, res) => {

    const schemaData = vine.object({
        title: vine.string(),
        description: vine.string(),
    });

    try {

        const user = req.user as (User & { role: Roles })

        await ProductServices.createProductService(await validateData(schemaData, req.body), user.id);
        sendSuccess(res, 201, "le produit a bien été crée");

    } catch (error) {

        handleError(error, req, res, 'ProductController.addProduct');
    }
}


const findAllProduct: RequestHandler = async (req, res) => {
    try {

        const products = await ProductServices.findAllProductService();
        sendSuccess(res, 200, "Liste des produits", products);

    } catch (error) {
        handleError(error, req, res, 'ProductController.findAllProduct');
    }
}

const deleteOneProduct: RequestHandler = async (req, res) => {

    const schemaData = vine.object({
        id: vine.string().uuid(),
    });

    try {
        const user = req.user as (User & { role: Roles });

        await ProductServices.deleteOneProductService(await validateData(schemaData, req.params as Infer<typeof schemaData>), user);
        sendSuccess(res, 200, "le produit a bien été supprimé");

    } catch (error) {

        handleError(error, req, res, 'ProductController.deleteOneProduct');
    }
}

export const ProductController = {
    addProduct,
    findAllProduct,
    deleteOneProduct
}
