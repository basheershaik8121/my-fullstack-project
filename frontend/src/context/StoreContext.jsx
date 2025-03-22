import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [food_list, setFoodList] = useState([]);
  const url = "http://localhost:4000";

  // ✅ Load cart data from backend
  const loadCartData = async (token) => {
    if (!token) return; // Prevent unnecessary API calls

    try {
      const response = await axios.get(`${url}/api/cart/get`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(response.data.cartData || {});
      localStorage.setItem("cartItems", JSON.stringify(response.data.cartData || {}));
    } catch (error) {
      console.error("Error loading cart data:", error);
    }
  };

  // ✅ Add to cart and sync with backend
  const addToCart = async (itemId) => {
    const updatedCart = { ...cartItems, [itemId]: (cartItems[itemId] || 0) + 1 };
    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));

    if (token) {
      try {
        await axios.post(`${url}/api/cart/add`, { itemId }, { headers: { Authorization: `Bearer ${token}` } });
        loadCartData(token);
      } catch (error) {
        console.error("Error adding item to cart:", error);
      }
    }
  };

  // ✅ Remove from cart and sync with backend
  const removeFromCart = async (itemId) => {
    if (!cartItems[itemId]) return;

    const updatedCart = { ...cartItems };
    if (updatedCart[itemId] === 1) {
      delete updatedCart[itemId];
    } else {
      updatedCart[itemId] -= 1;
    }
    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));

    if (token) {
      try {
        await axios.post(`${url}/api/cart/remove`, { itemId }, { headers: { Authorization: `Bearer ${token}` } });
        loadCartData(token);
      } catch (error) {
        console.error("Error removing item from cart:", error);
      }
    }
  };

  // ✅ Get total cart amount
  const getTotalCartAmount = () => {
    return Object.keys(cartItems).reduce((total, itemId) => {
      const item = food_list.find((food) => food._id === itemId);
      return item ? total + item.price * cartItems[itemId] : total;
    }, 0);
  };

  // ✅ Fetch food list
  const fetchFoodList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response?.data?.data) {
        setFoodList(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching food list:", error);
    }
  };

  // ✅ Load initial data
  useEffect(() => {
    fetchFoodList();

    if (token) {
      loadCartData(token);
    } else {
      // Load cart data from localStorage if no token
      const storedCart = localStorage.getItem("cartItems");
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    }
  }, [token]); // ✅ Re-run when `token` changes

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
