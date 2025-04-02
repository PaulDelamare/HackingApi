// ! IMPORTS
import vine from "@vinejs/vine";
import { RequestHandler } from "express"
import { validateData } from "../Utils/validateData/validateData";
import { sendSuccess } from "../Utils/returnSuccess/returnSuccess";
import { handleError } from "../Utils/errorHandler/errorHandler";
import { RoleServices } from "../Services/role.service";


const create: RequestHandler = async (req, res) => {

    const schemaData = vine.object({
        role_name: vine.string(),
        level: vine.number().min(0).max(5),
    });

    try {

        await RoleServices.createRoleService(await validateData(schemaData, req.body));

        sendSuccess(res, 201, "le rôle a bien été crée");
    } catch (error) {

        handleError(error, req, res, 'RoleController.Create');
    }
}



export const RoleController = {
    create
}
