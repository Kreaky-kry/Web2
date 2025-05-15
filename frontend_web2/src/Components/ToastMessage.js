import React from "react";
import Toast from "react-bootstrap/Toast";
import { useDispatch, useSelector } from "react-redux";

function ToastMessage() {
  // Lấy dữ liệu từ Redux store
  const showToast = useSelector((state) => state.toast_show);
  const toastMessage = useSelector((state) => state.toast_message);

  // Dispatch để gửi action
  const dispatch = useDispatch();

  // Hàm để ẩn Toast
  const hideToast = () => {
    dispatch({ type: "HIDE_TOAST" });
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 10,
        right: 10,
        zIndex: 99,
      }}
    >
      <Toast
        onClose={hideToast}
        show={showToast != null ? showToast : false}
        delay={3000}
        autohide
      >
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>
    </div>
  );
}

export default ToastMessage;
