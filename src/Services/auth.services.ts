import { bdd } from "../../config/prismaClient.config";
import jwt, { JwtPayload } from "jsonwebtoken"
import { hashPassword, verifyPassword } from "../Utils/hashPassword/hashPassword";
import { UserServices } from "./user.service";
import { User } from "@prisma/client";
import { throwError } from "../Utils/errorHandler/errorHandler";


const registerService = async (validatedData: Pick<User, 'email' | 'password'>) => {

    const { password, ...data } = validatedData;

    const idUserRole = await bdd.roles.findFirst({
        where: {
            role_name: "user"
        }
    })

    if (!idUserRole) {
        return throwError(404, "Rôle non trouvé")
    }

    return await bdd.user.create({ data: { ...data, password: await hashPassword(password), role_id: idUserRole.id } })
}


const loginService = async (validatedData: Pick<User, 'email' | 'password'> & { rememberMe?: true }) => {

    const user = await UserServices.checkExistUser({ email: validatedData.email }, true);

    await verifyPassword(user.password, validatedData.password);

    const { password, ...data } = user;

    const accessToken = generateTokens({ email: data.email }, process.env.JWT_SECRET as string, "12h")
    const refreshToken = generateTokens({ userId: data.id, email: data.email }, process.env.REFRESH_SECRET as string, validatedData.rememberMe ? "30d" : "1d")

    return { accessToken, refreshToken, data }
}


const generateTokens = (payload: JwtPayload, secret: string, expiresIn: "30d" | "1d" | "15m" | "12h") => {
    return jwt.sign(
        payload,
        secret,
        { expiresIn }
    )
}

export const AuthServices = {
    loginService,
    registerService
}