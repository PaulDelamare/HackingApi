import { ProductController } from "../Controllers/product.controller";
import { checkAuthAndRole } from "../Middlewares/validationRole/validationRole";
import { checkApiKey } from "../Utils/checkApiKey/checkApiKey";
import router from "./hello.routes";

router.post('/product', checkApiKey(), checkAuthAndRole(), ProductController.addProduct);
router.get('/products', checkApiKey(), checkAuthAndRole(), ProductController.findAllProduct);
router.delete('/product/:id', checkApiKey(), checkAuthAndRole(), ProductController.deleteOneProduct);


// ! EXPORT
export default router