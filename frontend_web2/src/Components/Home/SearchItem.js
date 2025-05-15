
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import numeral from "numeral";
import { Card } from "react-bootstrap";
import "../../assets/css/header.css";

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query"); // Lấy từ khóa từ URL
    const [results, setResults] = useState([]);
    const formatCurrency = (value) => {
        return numeral(value).format('0,0') + ' ₫';
    };
    useEffect(() => {
        const fetchResults = async () => {
            if (!query) return;
            try {
                const response = await axios.get(
                    `http://localhost:8080/api/products/search?keyword=${query}`
                );
                setResults(response.data);
                fetchImagesAndUpdateProducts(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy kết quả tìm kiếm:", error);
            }
        };

        fetchResults();
    }, [query]);
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

        setResults(updatedProducts);
    };
    return (
        <div className="container mt-4">
            <h2 style={{fontStyle:"oblique"}}>Kết quả tìm kiếm cho: "{query}"</h2>
            <div className="my-deal-phone container p-3 mt-3">
                <section className="content container">
                    <div className="content-deal row p-2">
                        {/* Lặp qua danh sách sản phẩm và hiển thị */}
                        {results.length > 0 ? (
                            results.map((item) => (
                                <Card className="box col-2 m-2 item-cart" key={item.id}>
                                    <div className="discount-badge">-9%</div> {/* Phần giảm giá */}
                                    
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
                            <div className="NoProductSearch">Không có sản phẩm nào để hiển thị</div>
                        )}
                    </div>
                </section>
                        

            </div>
        </div>
    );
};

export default SearchResults;
