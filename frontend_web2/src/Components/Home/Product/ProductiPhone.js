import { useCallback, useEffect, useState } from "react";
import { Card, ListGroup } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import numeral from 'numeral';
import axios from "axios";
import Swal from "sweetalert2";
import '../../../scss/Accessory.scss'
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { ip } from "../../../api/Api";




const ProductiPhone = () => {

    const [favoriteProducts, setFavoriteProducts] = useState([]); // Lưu trữ danh sách sản phẩm yêu thích
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const perPage = 10; // Số sản phẩm mỗi trang
    const formatCurrency = (value) => {
        return numeral(value).format('0,0') + ' ₫';
    };
    const navigate = useNavigate();


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


    // 🟢 Hàm gọi API lấy sản phẩm theo trang
    const getProducts = useCallback(async (pageNumber = 1) => {
        try {
            setLoading(true);
            const response = await axios.get(
                `http://localhost:8080/api/brand/apple?page=${pageNumber - 1}&size=${perPage}`
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
    }, []);
    // 🟢 Gọi API khi component mount
    useEffect(() => {
        getProducts(1);
    }, [getProducts]);


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


    // Nếu đang loading, hiển thị loading text
    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh' // chiều cao 100% của viewport,
            }}>
                <img style={{ width: "100px", height: "100px" }} src="./img/loading-gif-png-5.gif" />
            </div>
        );
    }

    return (
        <div className="accessory mt-5">
            <section className="content container">
                <ToastContainer />
                <div className="title-index">
                    <Link className="name-title">
                        <span className="phukien-link">Sản phẩm</span>Nổi bật
                    </Link>
                    <div className="link-title">
                    </div>
                </div>
                <div className="my-deal-phone  p-3 mt-3">
                    <section className="content container">
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
                                <div>Không có sản phẩm nào để hiển thị</div>
                            )}
                        </div>
                    </section>
                    {/* 🟢 Thanh phân trang */}

                </div>


            </section>
        </div>
    )
}

export default ProductiPhone;
