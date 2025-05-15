import './App.scss';
import Users from './Components/Users';
import TableUsers from './Components/TableUsers';
import Top_Header from './layout/FE/Header/Header';
import Home from './Components/Home';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Layoutfontend from './layout/FE/layout';
import Login from './page/Login';
import Register from './page/Register';
import ProductDetail from './page/Product/ProductDetail';
import Cart from './page/Product/Cart';
import AllProduct from './page/Product/AllProduct';
import ProductByBrand from './page/Product/ProductByBrand';
import Pay from './page/Product/Pay';
import Layoutbackend from './layout/BE/layout';
import Approuter from './router';
import WishList from './page/Product/WishList';
import SearchItem from './Components/Home/SearchItem';
import PostDetail from './Components/Home/PostDetail';
import CheckoutVnpay from './page/Product/CheckoutVnpay';
import Index from "./page/Delivery/index";
import LoginAdmin from './page/Admin/LoginAdmin';
import NoConnect from './page/Admin/NoConnect';

import ProtectedRoute from './Components/ProtectedRoute';



//import { BrowserRouter, Route, Routes } from 'react-router-dom';
function App() {
  return (


    <BrowserRouter>
      <Routes>
        {/* <Route path="/admin/*" element={<Layoutbackend />}>

        </Route> */}
        {/* <Route path="/admin" element={<Layoutbackend />}>
          {Approuter.BERouter.map((item, index) => {
            const Page = item.components;
            return (<Route key={index} path={item.path} element={Page} />
            );
          })}
        </Route> */}
        <Route path="/admin" element={<Layoutbackend />}>
          {Approuter.BERouter.map((item, index) => {
            const Page = item.components;
            return (
              <Route
                key={index}
                path={item.path.replace("/admin", "")} // bỏ tiền tố để khớp route con
                element={
                  <ProtectedRoute>
                    {Page}
                  </ProtectedRoute>
                }
              />
            );
          })}
        </Route>




        <Route path="/" element={<Layoutfontend />}>
          <Route index element={<Home />} />
          <Route path="tableU" element={<TableUsers />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="chi-tiet-san-pham/:id" element={<ProductDetail />} />
          <Route path="gio-hang" element={<Cart />} />
          <Route path="yeu-thich" element={<WishList />} />
          <Route path="tat-ca-san-pham" element={<AllProduct />} />
          <Route path="san-pham-theo-loai/:brandName" element={<ProductByBrand />} />
          <Route path="search-results" element={<SearchItem />} />
          <Route path="/chi-tiet-bai-viet/:id" element={<PostDetail />} />
          <Route path="/ca-nhan" element={<Index />} />


        </Route>
        <Route path="thanh-toan" element={<Pay />} />
        <Route path="checkout-vnpay" element={<CheckoutVnpay />} />
        <Route path="loginadmin" element={<LoginAdmin />} />
        <Route path="noconnect" element={<NoConnect />} />
        
      </Routes>
    </BrowserRouter>

  );
}

export default App;
