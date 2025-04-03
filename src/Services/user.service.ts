import { User } from "@prisma/client";
import { bdd } from "../../config/prismaClient.config";
import { throwError } from "../Utils/errorHandler/errorHandler";


const checkExistUser = async (validateData: Pick<User, 'id'> | Pick<User, 'email'>, login = false) => {

    const user = await bdd.user.findUnique({ where: validateData, include: { role: true } });

    if (!user) return throwError(404, login ? 'Email ou mot de passe incorrect' : 'Utilisateur introuvable');

    return user
}

const findAllUser = async () => {
    return await bdd.user.findMany({
        include: {
            role: true
        }
    })
}

const deleteUser = async (validatedId: Pick<User, 'id'>) => {
    const user = await checkExistUser({ id: validatedId.id });

    if (user.role.role_name === 'admin') {
        return throwError(403, "Cannot delete admin users");
    }

    await bdd.product.deleteMany({
        where: {
            user_id: validatedId.id
        }
    })

    return await bdd.user.delete({
        where: {
            id: validatedId.id
        }
    });
}

export const UserServices = {
    checkExistUser,
    findAllUser,
    deleteUser
}