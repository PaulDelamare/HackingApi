import { PrismaClient } from "@prisma/client";
import { AuthServices } from "../../src/Services/auth.services";
import { bdd } from "../../config/prismaClient.config";
import { hashPassword } from "../../src/Utils/hashPassword/hashPassword";

const prisma = new PrismaClient();

async function main() {
    const userData = {
        email: process.env.EMAIL_USER as string,
        password: process.env.PASSWORD_USER as string,
        role_name: "admin"
    };

    const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
    });

    if (existingUser) {
        console.log("L'utilisateur existe déjà");
        return;
    }

    const role = await prisma.roles.findUnique({
        where: { role_name: userData.role_name }
    });

    if (!role) {
        console.log("Le rôle n'existe pas");
        return;
    }

    await bdd.user.create({
        data: {
            email: userData.email,
            password: await hashPassword(userData.password),
            role_id: role?.id as string,
        }
    })

    console.log("Utilisateur créé avec succès !");
}

main()
    .catch((e) => {
        console.error("Erreur lors de la création de l'utilisateur :", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
