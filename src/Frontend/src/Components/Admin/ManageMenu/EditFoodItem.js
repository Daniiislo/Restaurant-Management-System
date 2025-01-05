import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getFoodItemByID,
  updateFoodItem,
  getMenuTabs,
} from "../../../API/MenuAPI";
import { useAuth } from "../../../Components/Auth/AuthContext";
import { isTokenExpired } from "../../../utils/tokenHelper.mjs";
import { refreshToken } from "../../../API/authAPI";
import style from "./EditFoodItem.module.css";
import { ModalGeneral } from "../../ModalGeneral";

function EditFoodItem() {
  const { id } = useParams();
  const [fooditem, setFoodItem] = useState({
    name: "",
    price: "",
    description: "",
    image: null,
    category: "",
  });
  const [originalFoodItem, setOriginalFoodItem] = useState({});
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({
    isOpen: false,
    text: "",
    type: "", // "confirm" hoặc "success"
    onConfirm: null, // Hàm được gọi khi xác nhận
  });
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();
  const { accessToken, setAccessToken } = useAuth();

  useEffect(() => {
    const fetchFoodItem = async () => {
      try {
        const data = await getFoodItemByID(id);
        setFoodItem({
          ...data,
          category: data.category || "",
          image: data.image,
        });
        setOriginalFoodItem({
          ...data,
          category: data.category || "",
          image: data.image,
        });
      } catch (error) {
        console.error("Error fetching food item:", error);
        setError("Không thể tải dữ liệu món ăn.");
      }
    };

    const fetchCategories = async () => {
      try {
        const categoriesData = await getMenuTabs();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchFoodItem();
    fetchCategories();
  }, [id]);

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
        throw error;
      }
    }
    return activeToken;
  };

  // Hàm kiểm tra ảnh
  const handleImageChange = (file) => {
    const allowedExtensions = /(\.jpg|\.png)$/i;
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (!allowedExtensions.exec(file.name)) {
      setError("Chỉ chấp nhận file ảnh với định dạng jpg và png.");
      return false;
    }

    if (file.size > maxSize) {
      setError("Ảnh quá lớn. Vui lòng chọn ảnh dưới 2MB.");
      return false;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result;

      img.onload = () => {
        const aspectRatio = img.width / img.height;

        if (aspectRatio < 0.5 || aspectRatio > 2) {
          setError(
            "Ảnh phải có tỷ lệ chiều rộng/chiều cao trong khoảng 1:2 và 2:1."
          );
          return false;
        }

        setError(""); // Clear any errors
        setPreviewImage(reader.result); // Set preview image
        return true;
      };
    };
    reader.readAsDataURL(file);

    return true; // Continue after validation
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files.length > 0) {
      const file = files[0];
      if (!handleImageChange(file)) {
        return; // Nếu ảnh không hợp lệ, ngừng tiếp tục
      }
      setFoodItem((prevFoodItem) => ({
        ...prevFoodItem,
        image: file,
      }));
    } else {
      setFoodItem((prevFoodItem) => ({
        ...prevFoodItem,
        [name]: value,
      }));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, price, description, image, category } = fooditem;

    // Kiểm tra thay đổi
    const hasChanges =
      fooditem.name !== originalFoodItem.name ||
      fooditem.price !== originalFoodItem.price ||
      fooditem.description !== originalFoodItem.description ||
      fooditem.category !== originalFoodItem.category ||
      fooditem.image instanceof File;

    if (!hasChanges) {
      setError("Chưa có thay đổi gì để cập nhật.");
      return;
    }

    if (name.length > 255) {
      setError("Tên món ăn không được quá 255 ký tự.");
      return;
    }

    if (isNaN(price) || price < 0) {
      setError("Giá phải là số nguyên và lớn hơn hoặc bằng 0.");
      return;
    }

    const formData = new FormData();
    if (fooditem.name !== originalFoodItem.name) formData.append("name", name);
    if (fooditem.price !== originalFoodItem.price)
      formData.append("price", price);
    if (fooditem.description !== originalFoodItem.description)
      formData.append("description", description);
    if (fooditem.category !== originalFoodItem.category)
      formData.append("category", category);
    if (fooditem.image instanceof File)
      formData.append("image", fooditem.image);

    setLoading(true);
    try {
      const activeToken = await ensureActiveToken();
      await updateFoodItem(id, formData, activeToken);
      setModal({
        isOpen: true,
        text: "Món ăn được cập nhật thành công!",
        type: "success",
        onConfirm: handleCloseModal,
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật món ăn:", error.message);
      setError("Đã có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setModal({ isOpen: false }); // Đóng modal
    navigate("/admin-dashboard/manage-menu"); // Điều hướng
  };

  return (
    <div className={style["edit-fooditem"]}>
      <h2>CHỈNH SỬA MÓN ĂN</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className={style["left-side"]}>
          <div className={style["form-img"]}>
            {previewImage ? (
              <img src={previewImage} alt="Preview" />
            ) : fooditem.image ? (
              <img src={fooditem.image} alt="Preview" />
            ) : null}

            {!previewImage && fooditem.image && (
              <p className={style["placeholder"]}>Ảnh cũ</p>
            )}

            <label htmlFor="image" className={style["image-upload-button"]}>
              Chọn ảnh mới
              <input
                type="file"
                id="image"
                name="image"
                style={{ display: "none" }}
                onChange={handleChange}
              />
            </label>
            <p className={style["instructions"]}>
              Dung lượng file tối đa 2MB <br />
              Định dạng: JPEG, PNG <br />
              Nên sử dụng hình ảnh có tỉ lệ 1:1 <br />
              Ảnh cần có tỉ lệ kích thước chiều rộng và chiều cao không quá 1:2
              và không nhỏ hơn 2:1
            </p>
          </div>
        </div>

        <div className={style["right-side"]}>
          <div className={style["form-group"]}>
            <label htmlFor="name">Tên món ăn</label>
            <input
              type="text"
              id="name"
              name="name"
              value={fooditem.name}
              onChange={handleChange}
              maxLength={255}
            />
          </div>

          <div className={style["form-group"]}>
            <label htmlFor="price">Giá</label>
            <input
              type="number"
              id="price"
              name="price"
              value={fooditem.price}
              onChange={handleChange}
              min={0}
            />
          </div>

          <div className={style["form-group"]}>
            <label htmlFor="description">Mô tả</label>
            <textarea
              id="description"
              name="description"
              value={fooditem.description}
              onChange={handleChange}
            />
          </div>

          <div className={style["form-group"]}>
            <label htmlFor="category">Danh mục</label>
            <select
              id="category"
              name="category"
              value={fooditem.category}
              onChange={handleChange}
              required
            >
              <option value="">Chọn danh mục</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className={style["button-container"]}>
            <button type="submit" className={style["submit-button"]}>
              Cập nhật
            </button>
            <button
              className={style["cancel-button"]}
              onClick={() => navigate("/admin-dashboard/manage-menu")}
            >
              Hủy
            </button>
          </div>
        </div>
      </form>

      {modal.isOpen && (
        <ModalGeneral
          isOpen={modal.isOpen}
          text={modal.text}
          type={modal.type}
          onClose={modal.onConfirm || (() => setModal({ isOpen: false }))}
          onConfirm={modal.onConfirm}
        />
      )}
    </div>
  );
}

export default EditFoodItem;
