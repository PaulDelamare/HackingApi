// ! IMPORT
import { checkAuthAndRole } from "../Middlewares/validationRole/validationRole";
import { router } from "../../config/router.config";
import { RoleController } from '../Controllers/role.controller';
import { checkApiKey } from "../Utils/checkApiKey/checkApiKey";

router.post('/role', checkApiKey(), checkAuthAndRole(['administrateur', 'super-administrateur']), RoleController.create);


export default router
