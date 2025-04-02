import vine from "@vinejs/vine";
import { RequestHandler } from "express";
import { sendSuccess } from "../Utils/returnSuccess/returnSuccess";
import { handleError } from "../Utils/errorHandler/errorHandler";
import { validateData } from "../Utils/validateData/validateData";
import { AuthServices } from "../Services/auth.services";
import { User } from "@prisma/client";

const register: RequestHandler = async (req, res) => {
    try {

        const schemaData = vine.object({
            email: vine.string().email(),
            password: vine.string().minLength(5).maxLength(6).confirmed()
        });


        await AuthServices.registerService(await validateData(schemaData, req.body));

        sendSuccess(res, 201, "L'utilisateur a bien été crée");

    } catch (error) {

        handleError(error, req, res, 'AuthController.register');
    }
}

const login: RequestHandler = async (req, res) => {
    const schemaData = vine.object({
        email: vine.string().email(),
        password: vine.string().minLength(5).maxLength(6)
    });

    try {

        const { data, accessToken, refreshToken } = await AuthServices.loginService(await validateData(schemaData, req.body));

        const cookie = {
            name: "refreshToken",
            value: refreshToken,
            options: {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 30 * 24 * 60 * 60 * 1000,
                path: '/',
                sameSite: 'strict' as const
            }
        };

        sendSuccess(res, 200, "L'utilisateur a bien été crée", { user: data, accessToken }, cookie);

    } catch (error) {

        handleError(error, req, res, 'AuthController.Login');
    }
}

const getInfo: RequestHandler = (req, res) => {
    const user = req.user as unknown as User;
    const { password, ...userData } = user;

    sendSuccess(res, 200, "Utilisateur trouvé", userData);
}

export const AuthController = {
    login,
    register,
    getInfo
}