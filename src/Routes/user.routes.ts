// ! IMPORT
import { checkAuthAndRole } from "../Middlewares/validationRole/validationRole";
import { router } from "../../config/router.config";
import { checkApiKey } from "../Utils/checkApiKey/checkApiKey";
import { UserController } from "../Controllers/user.controller";

router.get('/users', checkApiKey(), checkAuthAndRole(['admin']), UserController.findAllUser);
router.delete('/user/:id', checkApiKey(), checkAuthAndRole(['admin']), UserController.deleteUser);


export default router
