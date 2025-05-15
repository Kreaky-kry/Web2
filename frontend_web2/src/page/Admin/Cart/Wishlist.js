import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import { ip } from "../../../api/Api";

const Wishlist = () => {

    const [wishlist, setWishlist] = useState([]);
    const [product, setProduct] = useState([]);
    const [detailModalShow, setDetailModalShow] = useState(false);

    const getWishlist = async () => {
        try {
            const response = await axios.get(`${ip}/product/wishlist/all`);
            const cart = response.data;
            setWishlist(cart);
        } catch (error) {
            console.log("Lỗi khi gọi giỏ hàng", error)
        }
    }

    //chi tiết
    const openDetailModal = async (id) => {
        try {
            const response = await axios.get(`${ip}/products/${id}`);
            const productDetails = response.data;
            setProduct(productDetails)
            setDetailModalShow(true);

        } catch (error) {
            console.error("Error fetching product details", error);
            Swal.fire({
                text: "Failed to fetch product details",
                icon: "error",
            });
        }
    };
    const closeProductDetailModal = () => {
        setDetailModalShow(false);
        setProduct([])
    }



    useEffect(() => {
        getWishlist();
        
    }, []);

    const deleteWishlist = async (id) => {
        const isConfirm = await Swal.fire({
            title: "Bạn có chắc không?",
            text: "Bạn sẽ không thể hoàn nguyên điều này!",
            icon: "Cảnh báo",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Có, xóa nó!",
        });

        if (!isConfirm.isConfirmed) {
            return;
        }

        try {
            await axios.delete(`${ip}/product/wishlist/${id}`);
            Swal.fire({
                icon: "success",
                title: "xóa!",
                text: "Xóa thành công.",
            }).then(() => {
                getWishlist();
            });
        } catch (error) {
            console.error("Lỗi khi xóa", error);
            Swal.fire({
                text: "Lỗi khi xóa",
                icon: "error",
            });
        }
    };



    return (
        <div >


            <div className="container-fluid">
                <div className="card shadow mb-4">
                    <div className="card-header py-3 d-flex justify-content-between align-items-center">
                        <h6 className="m-0 font-weight-bold text-primary">Sản phẩm yêu thích</h6>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-bordered" id="dataTable" cellSpacing="0" width="100%">
                                <thead>
                                    <tr>
                                        <th>Id</th>
                                        <th>User_id</th>
                                        <th>Product_id</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody style={{ textAlign: "center" }}>
                                    {
                                        wishlist && wishlist.length > 0 ? (

                                            wishlist.map((wis) => (
                                                <tr key={wis.id} >
                                                    <td>{wis.id}</td>
                                                    <td>{wis.user_id}</td>
                                                    <td>{wis.product_id}</td>

                                                    <td style={{ textAlign: "center" }}>
                                                        
                                                        <Button variant="success me-2 btn btn-warning" onClick={()=>openDetailModal(wis.product_id)}  >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                                                                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                                                                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                                                            </svg>
                                                        </Button>
                                                        <Button variant="danger" onClick={() => deleteWishlist(wis.id)}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                                                                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                                                            </svg>
                                                        </Button>
                                                    </td>
                                                </tr>

                                            ))

                                        ) : (
                                            <tr>
                                                <td colSpan="5">Loading...</td> {/* Hiển thị thông báo loading trong một dòng */}
                                            </tr>
                                        )
                                    }
                                </tbody>

                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <Modal show={detailModalShow} onHide={closeProductDetailModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Chi tiết sản phẩm</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Hiển thị thông tin của sản phẩm từ object product */}
                    {product ? (
                        <div>
                            {/* Hiển thị hình ảnh */}
                            <div><strong>Hình ảnh:</strong></div>
                            <div>
                                {product.photo && product.photo !== "" ? (
                                    JSON.parse(product.photo).map((image, index) => (
                                        <img
                                            key={index} // Sử dụng key để xác định duy nhất mỗi ảnh
                                            height="60px"
                                            width="60px"
                                            src={`/img/${image}`} // Hiển thị từng ảnh
                                            alt={`Hình ảnh ${index + 1}`} // Đặt alt là tên ảnh hoặc số thứ tự ảnh
                                            style={{ margin: '5px' }} // Thêm khoảng cách giữa các ảnh (nếu cần)
                                        />
                                    ))
                                ) : (
                                    <p>Không có hình ảnh</p> // Hiển thị nếu không có hình ảnh
                                )}
                            </div>

                            {/* Hiển thị thông tin chi tiết sản phẩm */}
                            <div><strong>Tên sản phẩm:</strong> {product.name}</div>
                            <div><strong>Giá:</strong> {product.price}</div>
                            <div><strong>Mô tả:</strong> {product.description}</div>
                            <div><strong>Chi tiết:</strong> {product.details}</div>
                        </div>
                    ) : (
                        <p>Loading...</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeProductDetailModal}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>


        </div>
    )
}
export default Wishlist;