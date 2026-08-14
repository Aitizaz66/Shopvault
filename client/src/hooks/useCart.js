import { useSelector, useDispatch } from "react-redux";
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
} from "../store/slices/cartSlice.js";
import { openCart } from "../store/slices/uiSlice.js";
import { toast } from "react-hot-toast";

const useCart = () => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const { isCartOpen } = useSelector((state) => state.ui);

  const handleAddToCart = (product, quantity = 1) => {
    if (product.stock === 0) {
      toast.error("Sorry, this product is out of stock!");
      return false;
    }

    const item = {
      product: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      stock: product.stock,
      quantity: quantity,
    };

    dispatch(addToCart(item));
    toast.success(`${product.name} added to cart!`);
    return true;
  };

  const handleRemoveFromCart = (productId) => {
    dispatch(removeFromCart(productId));
    toast.success("Item removed from cart");
  };

  const handleUpdateQuantity = (productId, quantity) => {
    if (quantity < 1) {
      handleRemoveFromCart(productId);
      return;
    }
    dispatch(updateQuantity({ productId, quantity }));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    toast.success("Cart cleared");
  };

  const handleOpenCart = () => {
    dispatch(openCart());
  };
  // Calculate totals
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const shipping = subtotal > 50 ? 0 : 5;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return {
    cartItems,
    itemCount,
    subtotal,
    shipping,
    tax,
    total,
    isCartOpen,
    addToCart: handleAddToCart,
    removeFromCart: handleRemoveFromCart,
    updateQuantity: handleUpdateQuantity,
    clearCart: handleClearCart,
    openCart: handleOpenCart,
  };
};

export default useCart;
