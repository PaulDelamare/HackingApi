import { AuthController } from "../Controllers/auth.controller";
import { checkAuthAndRole } from "../Middlewares/validationRole/validationRole";
import { checkApiKey } from "../Utils/checkApiKey/checkApiKey";
import router from "./hello.routes";

router.post('/register', checkApiKey(), AuthController.register);
router.post('/login', checkApiKey(), AuthController.login);
router.get('/user/get-info', checkApiKey(), checkAuthAndRole(), AuthController.getInfo);


// ! EXPORT
export default router