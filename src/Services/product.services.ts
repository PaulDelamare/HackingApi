import { Product, Roles, User } from "@prisma/client"
import { bdd } from "../../config/prismaClient.config"

const createProductService = async (validatedData: Pick<Product, 'title' | 'description'>, user_id: User['id']) => {

    await bdd.product.create({
        data: {
            ...validatedData,
            user_id
        }
    })
}

const findAllProductService = async () => {
    return await bdd.product.findMany({
        include: {
            user: true
        }
    });
}

const deleteOneProductService = async (productId: Pick<Product, 'id'>, user: (User & { role: Roles })) => {

    if (user.role.role_name === 'admin') {
        return await bdd.product.delete({
            where: {
                id: productId.id
            }
        });
    }

    return await bdd.product.delete({
        where: {
            id: productId.id,
            user_id: user.id
        }
    });
}

export const ProductServices = {
    createProductService,
    findAllProductService,
    deleteOneProductService
}