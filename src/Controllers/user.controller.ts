// ! IMPORTS
import vine from "@vinejs/vine";
import { RequestHandler } from "express"
import { validateData } from "../Utils/validateData/validateData";
import { sendSuccess } from "../Utils/returnSuccess/returnSuccess";
import { handleError } from "../Utils/errorHandler/errorHandler";
import { ProductServices } from "../Services/product.services";
import { Roles, User } from "@prisma/client";
import { Infer } from "@vinejs/vine/build/src/types";
import { UserServices } from "../Services/user.service";


const findAllUser: RequestHandler = async (req, res) => {

    try {
        const users = await UserServices.findAllUser();

        sendSuccess(res, 200, "Liste d'utilisateur récupéré", users);

    } catch (error) {

        handleError(error, req, res, 'ProductController.addProduct');
    }
}

const deleteUser: RequestHandler = async (req, res) => {
    const schemaData = vine.object({
        id: vine.string().uuid(),
    });

    try {

        await UserServices.deleteUser(await validateData(schemaData, req.params as Infer<typeof schemaData>));

        sendSuccess(res, 200, "L'utilisateur a bien été supprimé");

    } catch (error) {

        handleError(error, req, res, 'ProductController.addProduct');
    }
}
export const UserController = {
    findAllUser,
    deleteUser
}
