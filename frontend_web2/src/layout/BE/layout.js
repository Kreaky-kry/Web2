import { Outlet, Route, Routes } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Products from "../../page/Admin/Product/Product";


const Layoutbackend = () => {
    return (
        <>
            <Header />
            
        
            <Footer />
        </>
    );
}

export default Layoutbackend;
