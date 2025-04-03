import { bdd } from "../../config/prismaClient.config";
import { hashPassword } from "../../src/Utils/hashPassword/hashPassword";


async function main() {
    const usersData = [
        { email: "user1@example.com", password: "pass1" },
        { email: "user2@example.com", password: "pass2" },
        { email: "user3@example.com", password: "pass3" }
    ];

    const role = await bdd.roles.findUnique({
        where: { role_name: "user" }
    });

    if (!role) {
        console.log("Le rôle 'user' n'existe pas");
        return;
    }

    for (const userData of usersData) {
        const existingUser = await bdd.user.findUnique({
            where: { email: userData.email }
        });

        if (existingUser) {
            console.log(`L'utilisateur ${userData.email} existe déjà`);
            continue;
        }

        await bdd.user.create({
            data: {
                email: userData.email,
                password: await hashPassword(userData.password),
                role_id: role.id
            }
        });

        console.log(`Utilisateur ${userData.email} créé avec succès !`);
    }
}

main()
    .catch((e) => {
        console.error("Erreur lors de la création des utilisateurs :", e);
        process.exit(1);
    })
    .finally(async () => {
        await bdd.$disconnect();
    });
