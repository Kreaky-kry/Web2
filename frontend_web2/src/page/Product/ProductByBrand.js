import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import ComeBack from "../../Components/ComeBack";
import numeral from "numeral";
import Axios from "axios";
import { Card } from "react-bootstrap";


import "../../../src/assets/css/pagination.css";
import "../../assets/css/productbrand.css";
import { useCallback } from "react";
import Pagination from "react-js-pagination";
import Swal from "sweetalert2";
import axios from "axios";

import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { ip } from "../../api/Api";
import { FaInstagram } from "react-icons/fa";


const ProductByCategory = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalItemsCount, setTotalItemsCount] = useState(0); // Tổng số sản phẩm
    const [total, setTotal] = useState(0);
    const [favoriteProducts, setFavoriteProducts] = useState([]); // Lưu trữ danh sách sản phẩm yêu thích
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const perPage = 10; // Số sản phẩm mỗi trang
    const { brandName } = useParams(); // Lấy brand từ URL
    const navigate = useNavigate();
    const [banner, setBanner] = useState([
        { id: 1, img: "https://bizweb.dktcdn.net/100/497/960/themes/923878/assets/img_3banner_1.jpg?1719291840576", icon: <FaInstagram /> },
        { id: 2, img: "https://bizweb.dktcdn.net/100/497/960/themes/923878/assets/img_3banner_2.jpg?1719291840576", icon: <FaInstagram /> },
        { id: 3, img: "https://bizweb.dktcdn.net/100/497/960/themes/923878/assets/img_3banner_3.jpg?1719291840576", icon: <FaInstagram /> },

    ])
    const formatCurrency = (value) => {
        return numeral(value).format('0,0') + ' ₫';
    };


    const handleAddToWishlist = async (data) => {
        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            const user = JSON.parse(localStorage.getItem("user"));
            if (!user || !user.id || !token) {
                // Hiển thị thông báo yêu cầu đăng nhập
                Swal.fire({
                    icon: 'error',
                    title: 'Bạn cần đăng nhập để thêm sản phẩm yêu thích!',
                    confirmButtonText: 'Đăng nhập ngay'
                }).then(() => {
                    // Chuyển hướng người dùng đến trang đăng nhập
                    navigate('/login'); // Đường dẫn đến trang đăng nhập
                });
                return; // Kết thúc hàm nếu chưa đăng nhập
            }


            // Gửi yêu cầu API thêm vào giỏ hàng
            const response = await axios.post(
                "http://localhost:8080/api/wishlist/add",
                null, // Không có body, sử dụng query params
                {
                    params: {
                        userId: user.id, // ID của user đã đăng nhập
                        productId: data, // ID của sản phẩm
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                Swal.fire({
                    toast: true,
                    position: "top-end",
                    icon: 'success',
                    title: 'Thêm sản phẩm yêu thích thành công',
                    confirmButtonText: 'OK'
                });
                // Cập nhật danh sách sản phẩm yêu thích nếu chưa có
                setFavoriteProducts((prevFavorites) => {
                    if (!prevFavorites.includes(data)) {
                        return [...prevFavorites, data];
                    }
                    return prevFavorites; // Trả về danh sách cũ nếu đã tồn tại
                });
            } else {
                toast.error("Không thể thêm sản phẩm vào giỏ hàng!");
            }
        } catch (error) {
            console.error("Lỗi khi thêm vào giỏ hàng:", error);
            console.log(data);
            Swal.fire({
                toast: true,
                icon: 'warning',
                position: "top-end",
                title: 'Sản phẩm yêu thích đã được thêm',
                confirmButtonText: 'OK'
            });
        } finally {
            setLoading(false);
        }
    };


    const getProducts = useCallback(async (pageNumber = 1) => {
        try {
            setLoading(true);
            const response = await axios.get(
                `http://localhost:8080/api/category/${brandName}?page=${pageNumber - 1}&size=${perPage}`
            );

            if (response.data) {
                setCurrentPage(response.data.number + 1); // API trả về page bắt đầu từ 0
                setTotalPages(response.data.totalPages);
                setProducts(response.data.content || []);
                fetchImagesAndUpdateProducts(response.data.content);
            }
        } catch (error) {
            console.error("Lỗi khi lấy sản phẩm:", error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, [brandName, perPage]); // Gọi lại khi `brandName` thay đổi

    // 🟢 Gọi API khi component mount hoặc khi brand thay đổi
    useEffect(() => {
        getProducts(1);
    }, [getProducts]);

    // 🟢 Điều hướng trang
    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            getProducts(page);
        }
    };
    // Hàm fetch ảnh cho từng sản phẩm
    const fetchImagesAndUpdateProducts = async (data) => {
        if (!data || data.length === 0) return;

        const updatedProducts = await Promise.all(
            data.map(async (product) => {
                try {
                    const response = await axios.get(
                        `http://localhost:8080/api/product/${product.id}/image`,
                        { responseType: "blob" }
                    );
                    const imageUrl = URL.createObjectURL(response.data);
                    return { ...product, imageUrl };
                } catch (error) {
                    console.error("Lỗi tải ảnh sản phẩm ID:", product.id, error);
                    return { ...product, imageUrl: "/images/default-placeholder.jpg" }; // Ảnh mặc định khi lỗi
                }
            })
        );

        setProducts(updatedProducts);
    };

    // Similar to componentDidMount
    useEffect(() => {
        getProducts();
    }, [getProducts]);
    // Xử lý chuyển trang



    // Nếu đang loading, hiển thị loading text
    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh' // chiều cao 100% của viewport,

            }}>
                <img style={{ width: "100px", height: "100px" }} src="../img/loading-gif-png-5.gif" />
            </div>
        );
    }

    return (
        <>
            <ComeBack />
            <div className="ProductBrand mt-3">
                <ToastContainer />
                <div className="bannerAll">
                    <div className="contentAll containerAll">
                        {banner.map((item, index) => {
                            return (
                                <div className="col-4 " key={item.id}>
                                    <div>
                                        <img src={item.img} className="image" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div >

                <div className="my-deal-phone container p-3 ">
                    <div className="content-deal row p-2">
                        {/* Lặp qua danh sách sản phẩm và hiển thị */}
                        {products.length > 0 ? (
                            products.slice(0, 10).map((item) => (
                                <Card className="box col-2 m-2 item-cart" key={item.id}>
                                    <div className="discount-badge">-9%</div> {/* Phần giảm giá */}
                                    <div className="favorite-icon" onClick={() => handleAddToWishlist(item.id)}>
                                        {/* Đổi icon dựa trên trạng thái yêu thích */}
                                        <i className={favoriteProducts.includes(item.id) ? "fas fa-heart" : "far fa-heart"}></i>
                                    </div>
                                    <Link to={`/chi-tiet-san-pham/${item.id}`}>
                                        <Card.Img
                                            className="product-image"
                                            src={item.imageUrl}
                                            alt={item.name}
                                        />
                                    </Link>
                                    <div className="official-badge">Chính Hãng 100%</div> {/* Chính hãng */}
                                    <div>
                                        <p className="text_name">{item.name}</p>
                                    </div>
                                    <div className="list-group-flush">
                                        <hr />
                                        <p className="text_price">Giá: {formatCurrency(item.price)}</p>
                                        <hr />
                                        <p className="text_plus">Tặng sạc cáp nhanh 25w trị giá 250k</p>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <div className="NoProduct">Không có sản phẩm nào để hiển thị</div>
                        )}
                    </div>
                    {/* 🟢 Thanh phân trang */}
                    <div className="pageNumber">
                        <button
                            id="firstPage"
                            onClick={() => goToPage(1)}
                            disabled={currentPage === 1}
                            className={currentPage === 1 ? "disabled-button" : ""}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-double-left" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M8.354 1.646a.5.5 0 0 1 0 .708L2.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
                                <path fill-rule="evenodd" d="M12.354 1.646a.5.5 0 0 1 0 .708L6.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
                            </svg>
                        </button>

                        <button
                            id="first"
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={currentPage === 1 ? "disabled-button" : ""}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-left" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
                            </svg>
                        </button>

                        <span id="page">Trang {currentPage} / {totalPages}</span>

                        <button
                            id="firstPage"
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={currentPage === totalPages ? "disabled-button" : ""}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708" />
                            </svg>
                        </button>

                        <button
                            id="first"
                            onClick={() => goToPage(totalPages)}
                            disabled={currentPage === totalPages}
                            className={currentPage === totalPages ? "disabled-button" : ""}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-double-right" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708" />
                                <path fill-rule="evenodd" d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Phân trang */}


            </div>

        </>
    );
};

export default ProductByCategory;
