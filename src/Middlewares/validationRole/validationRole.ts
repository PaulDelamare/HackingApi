import passport from "passport";
import { Request, Response, NextFunction } from "express";
import { Roles, User } from "@prisma/client";
import { handleError } from "../../Utils/errorHandler/errorHandler";
import jwt from "jsonwebtoken";

declare global {
    namespace Express {
        interface User {
            role: Roles;
        }
    }
}

export const checkAuthAndRole = (role: string[] = []) => {
    return (req: Request, res: Response, next: NextFunction) => {

        passport.authenticate("jwt", { session: false }, async (err: Error | null, user: User & { role: Roles } | false, info: jwt.VerifyErrors | null) => {
            if (err) {

                return handleError({ status: 500, error: "Erreur interne du serveur" }, req, res, 'CheckAuthAndRole');
            }

            if (!user) {

                return handleError({ status: 401, error: "Erreur interne du serveur" }, req, res, 'CheckAuthAndRole');
            }

            checkRole(req, res, role, user);

            req.user = user;

            next();
        })(req, res, next);
    };
};

const checkRole = (req: Request, res: Response, role: string[], user: (User & { role: Roles })) => {
    if (
        role.length !== 0 &&
        !role.includes(user.role.role_name)
    ) {

        return handleError({ status: 403, error: "Accès interdit. Vous n'avez pas le rôle nécessaire." }, req, res, 'CheckAuthAndRole');
    }
}
