import { Link, Outlet } from "react-router-dom";
import "../../scss/Delivery.scss"
import { useEffect, useState } from "react";
import TabAllDelivery from "./TabAllDelivery";
import TabCancel from "./TabCancel";

import TabFinish from "./tabFinish";
import TabWait from "./TabWait";
import TabPay from "./TabPay";
import TabRefund from "./TabRefund";
import TabTrans from "./TabTrans";

const OrderSection = () => {

    //state lưu thông tin sản phẩm
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    //state lưu điều kiện show
    const [show, setShow] = useState(false);

    //nút mở modal đánh giá
    const handleShow = () => {
        setShow(!show);
    }
    //nút đóng modal đánh giá
    const handleClose = () => {
        setShow(!show);
    }

    //CALL API  
    const getAllOrder = async () => {
        setLoading(true); // Bắt đầu loading
        try {
            let res = await fetch('https://fakestoreapi.com/products');
            let data = await res.json();
            if (data && data.length > 0) {
                setProducts(data);
            }
        } catch (error) {
            console.error("Lỗi khi fetch đơn hàng:", error);
        } finally {
            setLoading(false); // Kết thúc loading
        }
    };



    useEffect(() => {
        getAllOrder();

    }, [])

    //const [showAll, setShowAll] = useState(true)
    const [showpay, setShowpay] = useState(true)
    const [showTrans, setShowTrans] = useState(false)
    const [showWait, setShowWait] = useState(false)
    const [showFinish, setShowFinish] = useState(false)
    const [showCancel, setShowCancel] = useState(false)
    const [showRefund, setShowRefund] = useState(false)

    // // NÚT TAB HIỆN TẤT CẢ
    // const handleShowAll = () => {
    //     setShowAll(true);
    //     setShowCancel(false);
    //     setShowFinish(false);
    //     setShowRefund(false);
    //     setShowTrans(false);
    //     setShowpay(false);
    //     setShowWait(false);
    // }

    // NÚT CHUYỂN TAB THANH TOÁN
    const handleShowPay = () => {
        resetTabs();
        setShowpay(true);
        getAllOrder(); // Gọi API khi đổi tab
    };

    const handleShowTrans = () => {
        resetTabs();
        setShowTrans(true);
        getAllOrder();
    };

    const handleShowWait = () => {
        resetTabs();
        setShowWait(true);
        getAllOrder();
    };

    const handleShowFinish = () => {
        resetTabs();
        setShowFinish(true);
        getAllOrder();
    };

    const handleShowCancel = () => {
        resetTabs();
        setShowCancel(true);
        getAllOrder();
    };

    const handleShowRefund = () => {
        resetTabs();
        setShowRefund(true);
        getAllOrder();
    };

    // Hàm reset tất cả các tab
    const resetTabs = () => {
        setShowCancel(false);
        setShowFinish(false);
        setShowRefund(false);
        setShowTrans(false);
        setShowpay(false);
        setShowWait(false);
    };

    return (
        <div className="order-section">
            <div className="tabs">
                {/* <Link className={showAll === true ? "tab active" : "tab"} onClick={() => handleShowAll()}>Tất cả</Link> */}
                <Link className={showpay === true ? "tab active" : "tab"} onClick={() => handleShowPay()}>Đang xác nhận</Link>
                <Link className={showTrans === true ? "tab active" : "tab"} onClick={() => handleShowTrans()}>Chờ vận chuyển</Link>
                {/* <Link className={showWait === true ? "tab active" : "tab"} onClick={() => handleShowWait()}>Chờ giao hàng</Link> */}
                <Link className={showFinish === true ? "tab active" : "tab"} onClick={() => handleShowFinish()}>Hoàn thành</Link>
                <Link className={showCancel === true ? "tab active" : "tab"} onClick={() => handleShowCancel()}>Đã hủy</Link>
                <Link className={showRefund === true ? "tab active" : "tab"} onClick={() => handleShowRefund()}>Trả hàng/Hoàn tiền</Link>
            </div>
            <div className="order_section p-2">
                {loading ? (
                    <div className="loading-container">
                        <p>Đang tải dữ liệu...</p>
                    </div>
                ) : (
                    <>
                        {showCancel === true &&
                            (
                                <TabCancel />
                            )
                        }

                        {showFinish === true &&
                            (
                                <TabFinish
                                    products={products}
                                    show={show}
                                    handleClose={handleClose}
                                    handleShow={handleShow}
                                />
                            )
                        }

                        {showTrans === true &&
                            (
                                <TabTrans />
                            )
                        }

                        {showWait === true &&
                            (
                                <TabWait />
                            )
                        }

                        {showpay === true &&
                            (
                                // <TabPay />
                                <TabAllDelivery
                                    products={products}
                                    show={show}
                                    handleClose={handleClose}
                                    handleShow={handleShow}
                                />
                            )
                        }

                        {showRefund === true &&
                            (
                                <TabRefund />
                            )
                        }

                    </>
                )}




            </div>
        </div>
    );
}

export default OrderSection;