import { PrismaClient } from "@prisma/client";
import { bdd } from "../../config/prismaClient.config";

async function main() {
    // 🚀 Récupérer le rôle "user"
    const userRole = await bdd.roles.findUnique({
        where: { role_name: "user" }
    });

    if (!userRole) {
        console.log("Le rôle 'user' n'existe pas");
        return;
    }

    // 🚀 Récupérer tous les utilisateurs ayant le rôle "user"
    const usersWithRole = await bdd.user.findMany({
        where: { role_id: userRole.id }
    });

    // 🚀 Pour chaque utilisateur, créer un article (product)
    for (const user of usersWithRole) {
        const productData = {
            title: `Article pour ${user.email}`,
            description: `Ceci est un article créé pour l'utilisateur ${user.email}.`,
            user_id: user.id
        };

        await bdd.product.create({
            data: productData
        });

        console.log(`Article créé pour l'utilisateur ${user.email}`);
    }
}

main()
    .catch((e) => {
        console.error("Erreur lors de la création des articles :", e);
        process.exit(1);
    })
    .finally(async () => {
        await bdd.$disconnect();
    });
