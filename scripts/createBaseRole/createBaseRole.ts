import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const roles = [
        { name: "admin", level: 5 },
        { name: "user", level: 1 },
    ];

    for (const role of roles) {
        await prisma.roles.upsert({
            where: { role_name: role.name },
            update: {},
            create: {
                role_name: role.name
            },
        });
    }

    console.log("Rôles insérés avec succès !");
}

main()
    .catch((e) => {
        console.error("Erreur lors de l'insertion des rôles :", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
