import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Card, Table } from 'react-bootstrap';
import ComeBack from "../../Components/ComeBack";
import ProductWishListDetail from './ProductWishListDetail';
import numeral from 'numeral';
import { Link, Navigate } from 'react-router-dom';
import "../../scss/Cart.scss";
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from "react-toastify";
import { ip } from '../../api/Api';
import Swal from "sweetalert2";

const WishList = () => {
    const [wishlist, setWishList] = useState([]);
    const [productPrices, setProductPrices] = useState({}); // Lưu giá sản phẩm
    const [loadingCart, setLoadingCart] = useState(true);
    const [loadingUser, setLoadingUser] = useState(true);
    const [user, setUser] = useState(null);
    const [favoriteProducts, setFavoriteProducts] = useState([]); // Lưu trữ danh sách sản phẩm yêu thích

    const formatCurrency = (value) => {
        return numeral(value).format('0,0') + ' ₫';
    };


    const fetchWishlist = async () => {
        try {
            const token = localStorage.getItem("token");
            const user = JSON.parse(localStorage.getItem("user"));

            if (!user || !user.id) {
                console.log("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại!");
                return;
            }

            const response = await axios.get(`http://localhost:8080/api/wishlist/user/${user.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const wishlistItems = response.data.wishlistItems;

            if (!wishlistItems || wishlistItems.length === 0) {
                setWishList([]);
                return;
            }
            const updatedWishListItems = wishlistItems.map((item) => ({
                id: item.id,
                product: {
                    id: item.product.id,
                    name: item.product.name,
                    description: item.product.description,
                    brand: item.product.brand,
                    category: item.product.category,
                    price: item.product.price,
                    stockQuantity: item.product.stockQuantity,
                    releaseDate: item.product.releaseDate,
                    productAvailable: item.product.productAvailable,
                    image: `data:${item.product.imageType};base64,${item.product.imageDate}`,
                },
            }));
            // Lấy danh sách productId để cập nhật state favoriteProducts
            const favoriteIds = updatedWishListItems.map((item) => item.product.id);
            setWishList(updatedWishListItems);
            setFavoriteProducts(favoriteIds); // Cập nhật trạng thái yêu thích
        } catch (error) {
            console.error("Lỗi khi lấy giỏ hàng:", error);
            toast.error("Có lỗi xảy ra khi lấy giỏ hàng");
        } finally {
            setLoadingCart(false);
        }
    };
    const handleRemove = async (wishlistItemId) => {
        try {
            const token = localStorage.getItem("token"); // Lấy token từ localStorage
            if (!token) {
                console.error("Không tìm thấy token! Người dùng cần đăng nhập.");
                return;
            }

            await axios.delete(`http://localhost:8080/api/wishlist/remove?wishlistItemId=${wishlistItemId}`, {
                headers: { Authorization: `Bearer ${token}` } // Gửi token trong headers
            });
            setFavoriteProducts(prevFavorites => prevFavorites.filter(id => id !== wishlistItemId));
            setWishList(prevItems => prevItems.filter(item => item.id !== wishlistItemId));
            console.log("Sản phẩm đã được xóa khỏi yêu thích!");
        } catch (error) {
            console.error("Lỗi khi xóa sản phẩm:", error);
        }
    };






    const checkUserLogin = () => {
        const token = localStorage.getItem("token");
        if (token) {
            getUserData(token);
        } else {
            setUser(null);
            setLoadingUser(false);
        }
    };

    // Hàm lấy thông tin người dùng từ API
    const getUserData = async () => {
        const token = localStorage.getItem("token"); // Lấy token từ localStorage

        if (!token) {
            console.log("Không có token, yêu cầu đăng nhập!");
            setUser(null);
            return;
        }

        try {
            const response = await axios.get("http://localhost:8080/api/auth/user-info", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data) {
                setUser(response.data); // Lưu thông tin user vào state
                fetchWishlist(token);
                setLoadingUser(false);
            } else {
                console.error("Dữ liệu user không hợp lệ:", response.data);
                setUser(null);
            }
        } catch (error) {
            console.error("Lỗi lấy thông tin người dùng:", error);
            localStorage.removeItem("token"); // Xóa token nếu lỗi
            setUser(null); // Xóa user
            window.location.reload(); // Tải lại trang để yêu cầu đăng nhập
        }
    };
    // Gọi hàm khi component được render
    useEffect(() => {
        checkUserLogin();
        getUserData();
    }, []);



    if (loadingUser) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <img style={{ width: "100px", height: "100px" }} src="./img/loading-gif-png-5.gif" alt="Loading..." />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="container text-center" style={{ height: "300px" }}>
                <h2 style={{ paddingTop: "100px", fontWeight: "bold", color: "red" }}>Bạn cần đăng nhập để xem sản phẩm yêu thích</h2>
                <p>Đăng nhập
                    <Link to="/login" className='ms-1'>
                        {/* <Button variant="primary">Đăng nhập</Button> */}
                        tại đây
                    </Link>
                </p>


            </div>
        );
    }

    if (loadingCart) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <img style={{ width: "100px", height: "100px" }} src="./img/loading-gif-png-5.gif" alt="Loading..." />
            </div>
        );
    }

    return (

        <>
            <ComeBack />
            <div className="mynocart container mt-2">
                <h5 className="title-cart" style={{ color: "red", fontSize: "20px", fontWeight: "bolder", fontStyle: "italic", paddingTop: "10px", paddingBottom: "10px" }}>Sản phẩm yêu thích của bạn</h5>
            </div>
            {wishlist.length === 0 ? (
                <div className="content-nocart container text-center mt-5" style={{ height: "200px" }}>
                    <div className="icon">
                        <img src="https://bizweb.dktcdn.net/100/479/509/themes/897806/assets/no-cart.png?1677998172667" alt="No cart" /><br />
                        <span>Không có sản phẩm yêu thích nào</span>
                    </div>
                </div>
            ) : (
                <div className="my-deal-phone container p-3 mt-3">
                    <section className="content container">
                        <div className="content-deal row p-2">
                            {/* Lặp qua danh sách sản phẩm và hiển thị */}
                            {wishlist.length > 0 ? (
                                wishlist.map((item, index) => (
                                    <Card className="box col-2 m-2 item-cart" key={index}>
                                        <div className="discount-badge">-9%</div> {/* Phần giảm giá */}
                                        {/* <div className="favorite-icon" >
                                            <i className={favoriteProducts.includes(item.product.id) ? "fas fa-heart text-red-500" : "far fa-heart"}></i>
                                        </div> */}
                                        <div
                                            className="favorite-icon"
                                            onClick={() => {
                                               
                                                    handleRemove(item.id); // Xóa sản phẩm yêu thích
                                               
                                            }}
                                        >
                                            <i className={favoriteProducts.includes(item.product.id) ? "fas fa-heart text-red-500" : "far fa-heart"}></i>
                                        </div>

                                        <Link to={`/chi-tiet-san-pham/${item.product.id}`}>
                                            <Card.Img
                                                className="product-image"
                                                src={item.product.image}
                                                alt={item.product.name}
                                            />
                                        </Link>
                                        <div className="official-badge">Chính Hãng 100%</div> {/* Chính hãng */}
                                        <div>
                                            <p className="text_name">{item.product.name}</p>
                                        </div>
                                        <div className="list-group-flush">
                                            <hr />
                                            <p className="text_price">Giá: {formatCurrency(item.product.price)}</p>
                                            <hr />
                                            <p className="text_plus">Tặng sạc cáp nhanh 25w trị giá 250k</p>
                                        </div>
                                    </Card>
                                ))
                            ) : (
                                <div>Không có sản phẩm nào để hiển thị</div>
                            )}
                        </div>
                    </section>

                </div>
            )}


        </>
    );
};

export default WishList;
