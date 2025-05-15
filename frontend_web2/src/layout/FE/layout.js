import { Outlet } from "react-router-dom"
import Header from "./Header/Header";
import Footer from "./Footer/Footer";


const Layoutfontend = () => {

    return (
        <>
            <Header />
            
            <Outlet />
            <Footer />
        </>
    )
}
export default Layoutfontend;