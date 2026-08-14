import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  getProducts,
  deleteProduct,
} from "../store/slices/adminProductSlice.js";
import ProductTable from "../components/products/ProductTable.jsx";
import { Plus } from "lucide-react";
import { toast } from "react-hot-toast";

const ProductsPage = () => {
  const dispatch = useDispatch();
  const { products, isLoading } = useSelector((state) => state.adminProducts);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await dispatch(deleteProduct(id)).unwrap();
        toast.success("Product deleted successfully");
      } catch (error) {
        toast.error(error || "Failed to delete product");
      }
    }
  };

  const filteredProducts =
    products?.filter((product) =>
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || [];

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Products</h1>
          <p className="text-gray-500 mt-1">Manage your product inventory</p>
        </div>
        <Link
          to="/admin/products/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Product</span>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>

        <ProductTable
          products={filteredProducts}
          isLoading={isLoading}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default ProductsPage;
