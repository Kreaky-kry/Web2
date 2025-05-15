import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { ip } from "../../../api/Api";

const Cart = () => {

    const [cart, setCart] = useState([]);

    const getShoppingCart = async () => {
        try {
            const response = await axios.get(`${ip}/product/allshoppingcart`);
            const cart = response.data;
            setCart(cart);
        } catch (error) {
            console.log("Lỗi khi gọi giỏ hàng", error)
        }
    }
    useEffect(() => {
        getShoppingCart();
    }, []);

    const deleteCart = async (id) => {
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
            await axios.delete(`${ip}/product/cart-list/${id}`);
            Swal.fire({
                icon: "success",
                title: "xóa!",
                text: "Xóa thành công.",
            }).then(() => {
                getShoppingCart();
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
                        <h6 className="m-0 font-weight-bold text-primary">Giỏ hàng</h6>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-bordered" id="dataTable" cellSpacing="0" width="100%">
                                <thead>
                                    <tr>
                                        <th>Id</th>
                                        <th>User_id</th>
                                        <th>Tên sản phẩm</th>
                                        <th>Giá</th>
                                        <th>Số lượng</th>
                                        <th>Hình ảnh</th>
                                        <th >Actions</th>
                                    </tr>
                                </thead>
                                <tbody style={{ textAlign: "center" }}>
                                    {
                                        cart && cart.length > 0 ? (

                                            cart.map((car) => (
                                                <tr key={car.id} >
                                                    <td>{car.id}</td>
                                                    <td>{car.user_id}</td>
                                                    <td>{car.name}</td>
                                                    <td>{car.price}</td>
                                                    <td>{car.quantity}</td>
                                                    <td style={{ textAlign: "center" }}>
                                                        <img
                                                            height="60px"
                                                            width="60px"
                                                            src={`/img/${(car.photo)}`}
                                                            alt={(car.photo)}
                                                        />
                                                    </td>
                                                    <td style={{ textAlign: "center" }}>
                                                        {/* <Button variant="success me-2">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                                                <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                                                            </svg>
                                                        </Button> */}
                                                        <Button variant="danger" onClick={()=>deleteCart(car.id)}>
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


        </div>
    )
}
export default Cart;