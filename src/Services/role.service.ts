import { Roles } from "@prisma/client"
import { bdd } from "../../config/prismaClient.config"
import { throwError } from "../Utils/errorHandler/errorHandler"

const checkExistRole = async (validatedData: Pick<Roles, 'id'> | Pick<Roles, 'role_name'>) => {

    const role = await bdd.roles.findUnique({
        where: validatedData
    });

    if (!role) return throwError(404, 'Rôle non trouvé')

    return role
}


const createRoleService = (validatedData: Omit<Roles, 'createdAt' | 'updatedAt' | 'id'>) => {
    return bdd.roles.create({
        data: validatedData
    })
}


const findAllRoleService = async () => {
    return await bdd.roles.findMany({
        where: {
            role_name: { not: 'super-administrateur' }
        }
    })
}



export const RoleServices = {
    createRoleService,
    findAllRoleService,
    checkExistRole
}