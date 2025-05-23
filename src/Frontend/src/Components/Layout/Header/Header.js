// src/components/Header.js
import React, { useState, useRef, useEffect, useContext } from "react";
import style from "./Header.module.css";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faL, faUser } from "@fortawesome/free-solid-svg-icons";
import { refreshToken, logout } from "../../../API/authAPI";
import { useAuth } from "../../Auth/AuthContext";
import { isTokenExpired } from "../../../utils/tokenHelper.mjs";
import { useNavigate } from "react-router-dom";
import { RestaurantContext } from "../../../Config/RestaurantContext";

function Header({ isLoggedIn, setIsLoggedIn }) {
  const { restaurantInfo, loading, error, setRestaurantInfo } =
    useContext(RestaurantContext);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null); // Tham chiếu đến dropdown menu
  const { accessToken, setAccessToken } = useAuth();
  const refresh = localStorage.getItem("refreshToken");
  const navigate = useNavigate();
  const location = useLocation();

  const userRole = localStorage.getItem("userRole");

  const ensureActiveToken = async () => {
    if (!refresh || isTokenExpired(refresh)) {
                  navigate('/', { replace: true });
                  window.location.reload();
                  throw 'Phiên đăng nhập hết hạn';
                }
    let activeToken = accessToken;
    if (!activeToken || isTokenExpired(accessToken)) {
      const refreshed = await refreshToken(refresh);
      activeToken = refreshed.access;
      setAccessToken(activeToken);
    }
    return activeToken;
  };

  const handleLogout = async () => {
    let refreshTokenValue = localStorage.getItem("refreshToken"); // Lấy refresh token từ localStorage
    if (!refreshTokenValue) {
      console.error("Không tìm thấy refresh token. Đăng xuất thủ công.");
      setIsLoggedIn(false);
      localStorage.clear();
      localStorage.setItem("isLoggedIn", false);
      return;
    }
    try {
      const activeToken = await ensureActiveToken();
      // Gọi API logout
      await logout(refreshTokenValue, activeToken);

      // Xóa trạng thái đăng nhập
      setIsLoggedIn(false);
      localStorage.clear();
      localStorage.setItem("isLoggedIn", false);
      navigate("/");
    } catch (error) {
      console.error("Đăng xuất thất bại:", error.message);
    }
  };

  const handleLogoutBtn = () => {
    setIsMenuOpen(false);
    handleLogout();
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!restaurantInfo) return <p>No restaurant info available.</p>; // Xử lý nếu dữ liệu trống

  return (
    <header className={style["site-header"]}>
      <div className={style["container"]}>
        <div className={style["row"]}>
          <div className={style["col-lg-2"]}>
            <div className={style["header-logo"]}>
              <Link to="/" className={style["logo-text"]}>
                {restaurantInfo.name}
              </Link>
            </div>
          </div>
          <div className={style["col-lg-10"]}>
            <div className={style["main-navigation"]}>
              <nav className={style["header-menu"]}>
                <ul className={style["food-nav-menu"]}>
                  <li>
                    <Link
                      to="/about"
                      className={
                        location.pathname === "/about" ? style.active : ""
                      }
                    >
                      Giới Thiệu
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/menu"
                      className={
                        location.pathname.startsWith("/menu")
                          ? style.active
                          : ""
                      }
                    >
                      Thực Đơn
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/reservation"
                      className={
                        location.pathname === "/reservation" ? style.active : ""
                      }
                    >
                      Đặt Bàn
                    </Link>
                  </li>
                  
                  <li>
                    <Link
                      to="/review"
                      className={
                        location.pathname === "/review" ? style.active : ""
                      }
                    >
                      Đánh Giá
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/promotion"
                      className={
                        location.pathname.startsWith("/promotion")
                          ? style.active
                          : ""
                      }
                    >
                      Khuyến Mãi
                    </Link>
                  </li>

                  {/* Điều kiện hiển thị các trang dựa trên userRole */}

                  {isLoggedIn ? (
                    <li className={style["user-menu"]} ref={menuRef}>
                      <button onClick={toggleMenu} title="user-icon">
                        <FontAwesomeIcon icon={faUser} size="lg" />
                      </button>
                      {isMenuOpen && (
                        <div className={style["user-dropdown"]}>
                          <ul className={style["dropdown-list"]}>
                            {/* Show only the Logout option for admin */}
                            {userRole === "Admin" ? (
                              <>            
                                <li onClick={()=>setIsMenuOpen(false)}>
                                  <Link
                                    to="/employee-dashboard"
                                  >
                                    Trang Nhân Viên
                                  </Link>
                                </li>
                                <li onClick={()=>setIsMenuOpen(false)}>
                                  <Link
                                    to="/admin-dashboard/manage-restaurant-info"
                                  >
                                    Quản Trị
                                  </Link>
                                </li>
                                <li onClick={()=>setIsMenuOpen(false)}>
                                  {/* Nhân viên chỉ có Chỉnh sửa thông tin cá nhân và Đăng xuất */}
                                  <Link to="/profile">Thông tin cá nhân</Link>
                                </li>
                                <li>
                                <div className={style["logout-section"]}>
                                    <button
                                      onClick={handleLogoutBtn}
                                      className={style["logout-button"]}
                                    >
                                      Đăng xuất
                                  </button>
                                </div>
                              </li>
                              </>
                              
                            ) : userRole === "Employee" ? (
                                <>
                                   <li onClick={()=>setIsMenuOpen(false)}>
                                  <Link
                                    to="/employee-dashboard"
                                  >
                                    Trang Nhân Viên
                                  </Link>
                                </li>
                                <li onClick={()=>setIsMenuOpen(false)}>
                                  {/* Nhân viên chỉ có Chỉnh sửa thông tin cá nhân và Đăng xuất */}
                                  <Link to="/profile">Thông tin cá nhân</Link>
                                </li>
                                <li>
                                  {" "}
                                  <div className={style["logout-section"]}>
                                    <button
                                      onClick={handleLogoutBtn}
                                      className={style["logout-button"]}
                                    >
                                      Đăng xuất
                                    </button>
                                  </div>
                                </li>
                              </>
                            ) : (
                              <>
                                 <li onClick={()=>setIsMenuOpen(false)}>
                                  <Link to="/profile" onClick={closeMenu}>
                                    Thông tin cá nhân
                                  </Link>
                                </li>
                                <li onClick={()=>setIsMenuOpen(false)}>
                                  <Link
                                    to="/reservation-history"
                                    onClick={closeMenu}
                                  >
                                    Lịch sử đặt bàn
                                  </Link>
                                </li>
                                <li>
                                  <div className={style["logout-section"]}>
                                    <button
                                      onClick={handleLogoutBtn}
                                      className={style["logout-button"]}
                                    >
                                      Đăng xuất
                                    </button>
                                  </div>
                                </li>
                              </>
                            )}
                          </ul>
                        </div>
                      )}
                    </li>
                  ) : (
                    <div className={style["login-signup"]}>
                      <li>
                        <Link to="/login" className={style["login-btn"]}>
                          Đăng Nhập
                        </Link>
                      </li>
                      <li>
                        <Link to="/signup" className={style["signup-btn"]}>
                          Đăng Ký
                        </Link>
                      </li>
                    </div>
                  )}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
