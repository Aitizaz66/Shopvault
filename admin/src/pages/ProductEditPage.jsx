import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  getProductById,
  createProduct,
  updateProduct,
} from "../store/slices/adminProductSlice.js";
import ProductForm from "../components/products/ProductForm.jsx";
import { toast } from "react-hot-toast";

const ProductEditPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { product, isLoading } = useSelector((state) => state.adminProducts);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEdit = id && id !== "new";

  useEffect(() => {
    if (isEdit) {
      dispatch(getProductById(id));
    }
  }, [dispatch, id, isEdit]);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (isEdit) {
        await dispatch(updateProduct({ id, productData: formData })).unwrap();
        toast.success("Product updated successfully");
      } else {
        await dispatch(createProduct(formData)).unwrap();
        toast.success("Product created successfully");
      }
      navigate("/admin/products");
    } catch (error) {
      toast.error(error || "Failed to save product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          {isEdit ? "Edit Product" : "Add New Product"}
        </h1>
        <p className="text-gray-500 mt-1">
          {isEdit ? "Update product information" : "Create a new product"}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <ProductForm
          product={isEdit ? product : null}
          onSubmit={handleSubmit}
          isLoading={isSubmitting || isLoading}
        />
      </div>
    </div>
  );
};

export default ProductEditPage;
