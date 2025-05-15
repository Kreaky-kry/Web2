import { useState } from "react";
import { Link, } from "react-router-dom";
import Deal from "./Deal";

const Popular = () => {
    const [phone, setPhone] = useState([
        {
            id: 1, name: "Iphone", img: "https://bizweb.dktcdn.net/100/497/960/themes/923878/assets/danhmuc_1.jpg?1719291840576",
            price: "35.000.000đ", title: "iPhone 14 Pro Max 512GB Chính hãng VN/A",
        },
        {
            id: 2, name: "Sam Sung", img: "https://bizweb.dktcdn.net/100/497/960/themes/923878/assets/danhmuc_2.jpg?1719291840576",
            price: "35.000.000đ", title: "Samsung Galaxy S23 Ultra 12GB/1TB 5G chính hãng",
        },
        {
            id: 3, name: "Xiaomi", img: "https://bizweb.dktcdn.net/100/497/960/themes/923878/assets/danhmuc_3.jpg?1719291840576",
            price: "35.000.000đ", title: "iPhone 14 Pro Max 512GB Chính hãng VN/A",
        },
        {
            id: 4, name: "Redmi", img: "https://bizweb.dktcdn.net/100/497/960/themes/923878/assets/danhmuc_4.jpg?1719291840576",
            price: "35.000.000đ", title: "iPhone 14 Pro Max 512GB Chính hãng VN/A",
        },
        {
            id: 5, name: "VSmart", img: "https://bizweb.dktcdn.net/100/497/960/themes/923878/assets/danhmuc_5.jpg?1719291840576",
            price: "35.000.000đ", title: "iPhone 14 Pro Max 512GB Chính hãng VN/A",
        },
        {
            id: 6, name: "Lenovo", img: "https://bizweb.dktcdn.net/100/497/960/themes/923878/assets/danhmuc_6.jpg?1719291840576",
            price: "35.000.000đ", title: "iPhone 14 Pro Max 512GB Chính hãng VN/A",
        },
    ]);

    return (
        <>
            <div className="popular-categories container text-center">
                <Link to=""><h4>Thương hiệu phổ biến</h4></Link>
                <div className="row mt-3">

                    {phone.map((item, index) => {
                        return (

                            <div className="col-2 content p-2" key={index}>
                                
                            </div>
                        );

                    })}
                </div>
            </div>
            <Deal
                phone={phone} />
        </>
    );
}
export default Popular;