import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getDepartmentById,
  updateDepartment,
  getDepartments,
} from "../../../API/AdminAPI";
import { refreshToken } from "../../../API/authAPI";
import { useAuth } from "./../../Auth/AuthContext";
import { isTokenExpired } from "../../../utils/tokenHelper.mjs";
import { ModalGeneral } from "../../ModalGeneral";
import style from "./../../../Style/AdminStyle/EditDepartment.module.css";

function EditDepartment() {
  const { id } = useParams(); // Lấy ID từ URL
  const [department, setDepartment] = useState({ name: "", salary: "" });
  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
  const [error, setError] = useState(null); // Trạng thái lỗi
  const { accessToken, setAccessToken } = useAuth();
  const navigate = useNavigate();
  const [modal, setModal] = useState({
    isOpen: false,
    text: "",
    type: "", // "confirm" hoặc "success"
    onConfirm: null, // Hàm được gọi khi xác nhận
  });

  // Đảm bảo token hợp lệ
  const ensureActiveToken = async () => {
    let activeToken = accessToken;
    if (isTokenExpired(accessToken)) {
      try {
        const refreshed = await refreshToken(
          localStorage.getItem("refreshToken")
        );
        activeToken = refreshed.access;
        setAccessToken(activeToken);
      } catch (error) {
        console.error("Error refreshing token:", error);
        navigate("/login"); // Điều hướng nếu refresh token thất bại
        throw error;
      }
    }
    return activeToken;
  };

  // Lấy thông tin bộ phận
  useEffect(() => {
    const fetchDepartment = async () => {
      setLoading(true);
      setError(null);
      try {
        const Token = await ensureActiveToken();
        const data = await getDepartmentById(id, Token);
        setDepartment(data);
      } catch (error) {
        console.error("Error fetching department:", error);
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchDepartment();
  }, [id, accessToken]);

  // Xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDepartment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCloseModal = () => {
    setModal({ isOpen: false }); // Đóng modal
    navigate("/admin-dashboard/manage-department"); // Điều hướng
  };

  // Cập nhật thông tin bộ phận
  const handleUpdateDepartment = async () => {
    setError(null);
    if (!department.name || department.salary <= 0) {
      setError("Vui lòng nhập thông tin hợp lệ.");
      return;
    }

    const updatedDepartment = {
      name: department.name.trim(),
      salary: String(department.salary),
    };

    try {
      const activeToken = await ensureActiveToken();
      await updateDepartment(id, updatedDepartment, activeToken);
      setModal({
        isOpen: true,
        text: "Chỉnh sửa bộ phận thành công!",
        type: "success",
      });

      setTimeout(() => {
        handleCloseModal();
      }, 15000);
    } catch (error) {
      console.error(
        "Error updating department:",
        error.response?.data || error.message
      );
      setError("Không thể cập nhật thông tin. Vui lòng thử lại.");
    }
  };

  if (loading) {
    return <p>Đang tải dữ liệu...</p>;
  }

  if (error) {
    return <p className={style["error-message"]}>{error}</p>;
  }

  return (
    <div className={style["edit-department"]}>
      <div className={style["EditDepartment-container"]}>
        <h2 className={style["header"]}>Sửa Bộ Phận</h2>
        <label htmlFor="department-name">Tên bộ phận:</label>
        <input
          type="text"
          name="name"
          className={style["input"]}
          value={department.name}
          onChange={handleInputChange}
          placeholder="Tên bộ phận"
          required
        />
        <label htmlFor="salary">Lương của bộ phận:</label>
        <input
          type="text"
          id="salary"
          name="salary"
          className={style["salary-input"]}
          value={new Intl.NumberFormat("vi-VN").format(department.salary)}
          onChange={(e) => {
            const rawValue = e.target.value.replace(/[^\d]/g, ""); // Xóa ký tự không phải số
            setDepartment({ ...department, salary: rawValue });
          }}
        />

        <button
          className={style["save-button"]}
          onClick={handleUpdateDepartment}
        >
          Cập nhật bộ phận
        </button>
        {modal.isOpen && (
          <ModalGeneral
            isOpen={modal.isOpen}
            text={modal.text}
            type={modal.type}
            onClose={handleCloseModal}
            onConfirm={modal.onConfirm}
          />
        )}
      </div>
    </div>
  );
}

export default EditDepartment;
