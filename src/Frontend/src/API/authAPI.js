// src/API/authAPI.js
import axios from "axios";
import { API_BASE_URL } from "../Config/apiConfig";
import { isTokenExpired } from "../utils/tokenHelper.mjs";
import { useNavigate } from 'react-router-dom';
// Hàm đăng ký tài khoản mới
//kiểm tra username, password, email, account_type hợp lệ
export const account_check = async (userData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/account-check/`,
      userData
    );
  } catch (error) {
    console.error(error.response.data);
    throw error.response.data;
  }
};

// Hàm đăng nhập
export const login = async (credentials) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/token/`,
      credentials
    );

    return response.data; // Trả về access và refresh tokens nếu thành công
  } catch (error) {
    console.error(
      "Lỗi khi đăng nhập:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

//xác minh OTP
export const verifyOTP = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/verify-otp/`, data);
    return response.data; // Trả về dữ liệu thành công
  } catch (error) {
    console.error(
      "Lỗi khi xác nhận OTP:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

// Gửi OTP
export const sendOrResendOTP = async (emailData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/register-otp/`,
      emailData
    );
    return response.data; // Trả về kết quả nếu thành công
  } catch (error) {
    console.error(
      "Lỗi khi gửi OTP:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

//đăng kí
export const register = async (userData, token) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/accounts/`,
      userData,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm header Authorization
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error(
      "Lỗi khi đăng ký:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

//Hàm lấy mã otp khi quên mật khẩu
export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/forgot-password/`, {
      email,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Lỗi khi gửi yêu cầu quên mật khẩu:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
//reset-Password
export const resetPassword = async (resetData, token) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/reset-password/`,
      resetData,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token qua header Authorization
          "Content-Type": "application/json", // Định dạng nội dung JSON
        },
      }
    );

    // Trả về dữ liệu nếu thành công
    return response.data;
  } catch (error) {
    // Ghi log lỗi chi tiết
    console.error(
      "Lỗi khi đặt lại mật khẩu:",
      error.response ? error.response.data : error.message
    );

    // Ném lỗi với thông báo chi tiết
    throw error;
  }
};

// Hàm refresh token
export const refreshToken = async (refreshToken) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
      refresh: refreshToken,
    });
    // Trả về dữ liệu nếu thành công
    return response.data;
  } catch (error) {
    // Ghi log lỗi chi tiết
    console.error(
      "Lỗi khi lam moi token:",
      error.response ? error.response.data : error.message
    );
    // Ném lỗi với thông báo chi tiết
    throw error;
  }
};

// Hàm đăng xuất
export const logout = async (refresh_token, token) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/logout/`,
      { refresh: refresh_token },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token qua header Authorization
          "Content-Type": "application/json", // Định dạng nội dung JSON
        },
      }
    );

    // Trả về dữ liệu nếu thành công
    return response.data;
  } catch (error) {
    // Ghi log lỗi chi tiết
    console.error(
      "Lỗi khi đang xuat:",
      error.response ? error.response.data : error.message
    );

    // Ném lỗi với thông báo chi tiết
    throw error;
  }
};
