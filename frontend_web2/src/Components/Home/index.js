import { Carousel } from "react-bootstrap";
import Policy from "./policy";
import Popular from "./popular_categories";
import Follow from "./Follow";
import Banner from "./Banner";
import ProductiPhone from "./Product/ProductiPhone";
import ProductSamsung from "./Product/ProductSamsung";
import Laptop from "./Product/Laptop";
import Cammera from "./Product/Cammera";
import Headphones from "./Product/Headphones";
import ToastMessage from "../ToastMessage";
import Post from "./Post";
//import Deal from "./Deal";


const Home = () => {
    return (
        <>
            <div className="banner container">
                <div className="row" id="container-banner">
                    {/* <div className="col-9 banner-left mt-3" >
                        <Carousel data-bs-theme="dark">
                            <Carousel.Item>
                                <img
                                    className="d-block w-100"
                                    src="https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:90/plain/https://dashboard.cellphones.com.vn/storage/iphone-16-pro-max-tang-airpods-4-home-19-3.jpg"
                                    alt="First slide"
                                    style={{ height: "402px" }}
                                />
                            </Carousel.Item>
                            <Carousel.Item>
                                <img
                                    className="d-block w-100"
                                    src="https://bizweb.dktcdn.net/thumb/grande/100/497/960/themes/923878/assets/slider_2.jpg?1719291840576"
                                    alt="Second slide"
                                    style={{ height: "402px" }}
                                />
                            </Carousel.Item>
                            <Carousel.Item>
                                <img
                                    className="d-block w-100"
                                    src="https://bizweb.dktcdn.net/thumb/grande/100/497/960/themes/923878/assets/slider_3.jpg?1719291840576"
                                    alt="Third slide"
                                    style={{ height: "402px" }}
                                />

                            </Carousel.Item>
                        </Carousel>
                    </div>
                    <div className="col-3 banner-right mt-3">

                        <img src="https://bizweb.dktcdn.net/thumb/grande/100/497/960/themes/923878/assets/slider_1.jpg?1719291840576"
                            style={{ width: "330px" }} className="" />
                        <img src="https://bizweb.dktcdn.net/thumb/grande/100/497/960/themes/923878/assets/slider_2.jpg?1719291840576"
                            style={{ width: "330px" }} className="mt-2" />
                        <img src="https://bizweb.dktcdn.net/thumb/grande/100/497/960/themes/923878/assets/slider_3.jpg?1719291840576"
                            style={{ width: "330px" }} className="mt-2" />

                    </div> */}

                </div>

            </div>
            <ToastMessage/>
            <Policy />
            <Popular />
            <Banner />
            <ProductiPhone/>
            {/* <Laptop/>
            <Cammera/>
            <Headphones/> */}
            <Post/>
            
        </>

    )
}

export default Home;