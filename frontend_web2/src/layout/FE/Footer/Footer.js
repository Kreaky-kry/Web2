import { Link } from "react-router-dom";
import { FaFacebookF } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaPhoneVolume } from "react-icons/fa6";
const Footer = () => {

    return (
        <>
            <div className="footer mt-5">
                <div className="mid-footer container">
                    <div className="row">
                        <div className="col-xs-12 col-md-12 col-lg-12 col-xl-4">
                            <h5 className="Title-menu">Thông tin chung</h5>
                            <div className="des-fo">
                                Với sứ mệnh "Khách hàng là ưu tiên số 1" chúng tôi luôn mạng lại giá trị tốt nhất
                            </div>
                            <div className="iformation">
                                <b>Địa chỉ: </b>70 Lữ Gia, Phường 15, Quận 11, TP. Hồ Chí Minh
                            </div>
                            <div className="iformation">
                                <b>Điện thoại: </b>19001818
                            </div>
                            <div className="iformation">
                                <b>Emai: </b>dung@gmail.com
                            </div>
                            <div className="iformation">
                                <button className="rounded-full">
                                    <div className="icon">
                                        <FaPhoneVolume />
                                    </div>
                                    <span>19001818</span>
                                </button>
                            </div>
                        </div>
                        <div className="col-xs-12 col-md-4 col-lg-4 col-xl-2 footer-click">
                            <h5 className="Title-menu">Thông tin</h5>
                            <ul className="ul-menu">
                                <li className="li-menu">Trang chủ</li>
                                <li className="li-menu">Giới thiệu</li>
                                <li className="li-menu">Sản phẩm</li>
                                <li className="li-menu">Tin tức</li>
                                <li className="li-menu">Liên hệ</li>
                            </ul>
                        </div>
                        <div className="col-xs-12 col-md-4 col-lg-4 col-xl-3 footer-click">
                            <h5 className="Title-menu">Tổng đài hỗ trợ</h5>
                            <div className="hotline">
                                <span>Tư vấn mua hàng miễn phí</span>
                                <span>19001818</span>
                            </div>
                            <div className="hotline">
                                <span>Khiếu nại- Góp ý</span>
                                <span>19001818</span>
                            </div>
                            <div className="hotline">
                                <span>BÁn hàng doanh nghiệp</span>
                                <span>19001818</span>
                            </div>
                        </div>
                        <div className="col-xs-12 col-md-4 col-lg-4 col-xl-3 footer-click">
                            <h5 className="Title-menu mt">Liên kết xã hội</h5>
                            <div className="social-toogle mt-3">
                                <Link>
                                    <FaFacebookF className="facebook" />
                                </Link>
                                <Link ><FaInstagram className="instagram" /></Link>
                                <Link><FaYoutube className="youtube" /></Link>
                            </div>
                            <h5 className="Title-menu mt-2">Phương thức thanh toán</h5>
                            <div className="pay mt-2">
                                <Link>
                                    <img src="https://bizweb.dktcdn.net/100/497/960/themes/923878/assets/payment-1.png?1719291840576" className="payment" />
                                </Link>
                                <Link>
                                    <img src="https://bizweb.dktcdn.net/100/497/960/themes/923878/assets/payment-2.png?1719291840576" className="payment" />
                                </Link>
                                <Link>
                                    <img src="https://bizweb.dktcdn.net/100/497/960/themes/923878/assets/payment-4.png?1719291840576" className="payment" />
                                </Link>
                                <Link>
                                    <img src="https://bizweb.dktcdn.net/100/497/960/themes/923878/assets/payment-3.png?1719291840576" className="payment" />
                                </Link>
                            </div>


                        </div>

                    </div>
                </div>

            </div >
           
        </>


    );
}

export default Footer;