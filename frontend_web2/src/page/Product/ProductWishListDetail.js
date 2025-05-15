import React, { useEffect, useState } from 'react';
import axios from 'axios';
import numeral from 'numeral';
import { Link } from 'react-router-dom';
import { ip } from '../../api/Api';
import { Card } from 'react-bootstrap';

const ProductWishListDetail = ({ id, onPriceChange }) => {
    const [product, setProduct] = useState(null);

    const formatCurrency = (value) => {
        return numeral(value).format('0,0') + ' ₫';
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/product/${id}`);
                const productData = response.data;

                if (productData) {
                    fetchImageAndUpdateProduct(productData); // Gọi API lấy ảnh
                }
            } catch (error) {
                console.error("Lỗi khi gọi API sản phẩm:", error);
            }
        };

        fetchProduct();
    }, [id]);

    // Hàm fetch ảnh cho 1 sản phẩm
    const fetchImageAndUpdateProduct = async (productData) => {
        try {
            const response = await axios.get(
                `http://localhost:8080/api/product/${productData.id}/image`,
                { responseType: "blob" }
            );
            const imageUrl = URL.createObjectURL(response.data);
            setProduct({ ...productData, imageUrl });
        } catch (error) {
            console.error("Lỗi tải ảnh sản phẩm ID:", productData.id, error);
            setProduct({ ...productData, imageUrl: "/images/default-placeholder.jpg" });
        }
    };




    return (
        <div className="my-deal-phone container p-3 mt-3">
            <section className="content container">
                <div className="content-deal row p-2">
                    {/* Lặp qua danh sách sản phẩm và hiển thị */}
                    {product.length > 0 ? (
                        product.slice(0, 10).map((item) => (
                            <Card className="box col-2 m-2 item-cart" key={item.id}>
                                <div className="discount-badge">-9%</div> {/* Phần giảm giá */}
                                <div className="favorite-icon" >
                                   
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

        </div>
    );
}

export default ProductWishListDetail;
