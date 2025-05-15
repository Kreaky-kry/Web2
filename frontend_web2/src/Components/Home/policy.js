
import { Image } from "react-bootstrap";


const Policy = () => {
    const listPolicy = [
        { icon: "https://bizweb.dktcdn.net/100/497/960/themes/923878/assets/ser_1.png?1719291840576", name: "Vẫn chuyển Miễn Phí", title: "Khu vực TPHCM" },
        { icon: "https://bizweb.dktcdn.net/100/497/960/themes/923878/assets/ser_3.png?1719291840576", name: "Tiến hành thanh toán", title: "Với nhiều hình thức" },
        { icon: "https://bizweb.dktcdn.net/100/497/960/themes/923878/assets/ser_2.png?1719291840576", name: "Đổi trả miễn phí", title: "Trong vòng 30 ngày" },
        { icon: "https://bizweb.dktcdn.net/100/497/960/themes/923878/assets/ser_4.png?1719291840576", name: "100% hoàn tiền", title: "nếu sản phẩm lỗi" }
    ]

    return (
        <div className="policy container">
            <div className="row ml-2">
                {listPolicy.map((item, index) => {
                    return (
                        <div className="col-3 content" key={index}>
                            <div className="icon-policy">
                                <Image src={item.icon} style={{ width: "40px" }} />
                            </div>
                            <div className="content-policy">
                                <span>{item.name}</span><br />
                                <span>{item.title}</span>
                            </div>
                        </div>
                    );
                })}
            </div>


        </div>
    );
}
export default Policy;