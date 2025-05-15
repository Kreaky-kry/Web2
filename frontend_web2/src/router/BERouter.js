import AdminPage from "../page/Admin/admin";
import Order from "../page/Admin/Cart/Orders";
import Cart from "../page/Admin/Cart/Cart";
import Wishlist from "../page/Admin/Cart/Wishlist";
import Brand from "../page/Admin/Brand/Brand";
import Category from "../page/Admin/Category/Category";

import Products from "../page/Admin/Product/Product";
import ProductCreate from "../page/Admin/Product/ProductCreate";
import ProductEdit from "../page/Admin/Product/ProductEdit";
import User from "../page/Admin/User/User";
import Statistics from "../page/Admin/Statistics";
import CreateUser from "../page/Admin/User/CreateUser";

const BERouter = [
    //{ path: "/admin/user", components: <TableUsers /> },
    //{ path: "/admin/login", components: <LoginAdmin /> },
    { path: "/admin", components: <AdminPage /> },
    { path: "product", components: <Products /> },
    { path: "brand", components: <Brand /> },
    { path: "categories", components: <Category /> },
    { path: "productCreate", components: <ProductCreate /> },
    { path: "ProductEdit/:id", components: <ProductEdit /> },
    { path: "user", components: <User /> },
    { path: "cart", components: <Cart /> },
    { path: "abate", components: <Order /> },
    { path: "wishlist", components: <Wishlist /> },
    { path: "Statistics", components: <Statistics /> },
    { path: "UsersCreate", components: <CreateUser /> },




]
export default BERouter;