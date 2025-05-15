import { useEffect, useState } from "react";
import { Card, ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import numeral from 'numeral';
import axios from "axios";
import '../../../scss/Accessory.scss'
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { ip } from "../../../api/Api";


const Laptop = () => {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [favoriteProducts, setFavoriteProducts] = useState([]); // Lưu trữ danh sách sản phẩm yêu thích


    const formatCurrency = (value) => {
        return numeral(value).format('0,0') + ' ₫';
    };
    const handleAddToWishlist = async (productId) => { // Nhận productId làm tham số
        const token = localStorage.getItem("token");

        if (!token) {
            Swal.fire({
                icon: 'error',
                title: 'Bạn cần đăng nhập để thêm sản phẩm vào danh sách yêu thích!',
                confirmButtonText: 'Đăng nhập ngay'
            }).then(() => {
                // Chuyển hướng đến trang đăng nhập
                window.location.href = "/login"; // Đường dẫn đến trang đăng nhập
            });
            return;
        }

        try {
            const response = await axios.post(`${ip}/product/wishlist`, {
                productId: productId // Gửi productId trong yêu cầu
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                setFavoriteProducts([...favoriteProducts, productId]); // Thêm productId vào danh sách yêu thích
                Swal.fire({
                    icon: 'success',
                    title: 'Đã thêm vào danh sách yêu thích!',
                    confirmButtonText: 'OK'
                });
            }
        } catch (error) {
            if (error.response && error.response.status === 405) {
                toast.warning("Sản phẩm đã thêm vào danh sách yêu thích!")
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Có lỗi xảy ra, vui lòng thử lại!',
                    confirmButtonText: 'OK'
                });
            }
        }
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${ip}/product/category/paginate/1`);

                // Kiểm tra nếu response.data có trường chứa sản phẩm
                if (Array.isArray(response.data.data)) {
                    // Cập nhật state với mảng sản phẩm nằm trong response.data.data
                    setProducts(response.data.data);
                } else {
                    console.error("Dữ liệu sản phẩm không nằm trong một mảng:", response.data);
                }
                setLoading(false);  // Dừng loading
            } catch (error) {
                console.error("Lỗi khi gọi API:", error);
                setLoading(false);  // Dừng loading dù có lỗi
            }
        };

        fetchProducts();
    }, []);  // Chỉ gọi 1 lần khi component được render

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
            <ToastContainer/>
            <section className="content container">
                <div className="title-index">
                    <Link className="name-title">
                        <span className="phukien-link">Laptop</span>Nổi bật
                    </Link>
                    <div className="link-title">
                        <Link>Asus </Link>
                        <Link>Dell </Link>
                        <Link>Acer </Link>
                        <Link>Macbook </Link>
                        
                    </div>

                </div>
                <div className="my-deal-phone container p-3 mt-3">
                    <section className="content container">
                    <div className="content-deal row p-2">
                            {/* Lặp qua danh sách sản phẩm và hiển thị */}
                            {products.length > 0 ? (
                                products.map((item) => (
                                    <Card className="box col-2 m-2 item-cart" key={item.id}>
                                        <div className="discount-badge">-9%</div> {/* Phần giảm giá */}
                                        <div className="favorite-icon" onClick={() => handleAddToWishlist(item.id)}>
                                            {/* Đổi icon dựa trên trạng thái yêu thích */}
                                            <i className={favoriteProducts.includes(item.id) ? "fas fa-heart" : "far fa-heart"}></i>
                                        </div>
                                        <Link to={`/chi-tiet-san-pham/${item.id}`}>
                                            <Card.Img
                                                className="product-image"
                                                src={`./img/${JSON.parse(item.photo)[0]}`}
                                                alt={JSON.parse(item.photo)[0]}
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
                </div>

            </section >

        </div >
    )
}
export default Laptop;