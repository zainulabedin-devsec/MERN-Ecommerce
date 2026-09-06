import React, { useEffect, useState } from "react";

import Navbar from "../Navbar/Navbar";
import Banner from "../Banner/Banner";
import Product from "../Products/Product";
import Cart from "../Cart/Cart";
import WishList from "../WishList/WishList";
import OrderSummary from "../OrderSummary/OrderSummary";
import PlacedOrder from "../PlacedOrder/PlacedOrder";
import Footer from "../Footer/Footer";
import AuthModal from "../AuthModal/AuthModal";
import Contact from "../Contact/Contact";
import WhyChooseUs from "../WhyChooseUs/WhyChooseUs";
import MyOrders from "../MyOrders/MyOrders";
import AdminPanel from "../AdminPanel/AdminPanel";
import { getProfile } from "../../api/authApi";
import { sendContactMessage } from "../../api/contactApi";

import {
  getCart,
  addToCart as addToCartApi,
  updateCartItem,
  removeFromCart,
} from "../../api/cartApi";

function Home() {
  // ======================================================
  // AUTH STATE
  // ======================================================

  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");

    return storedUser ? JSON.parse(storedUser) : null;
  });

  // ======================================================
  // UI STATE
  // ======================================================

  const [searchProducts, setSearchProducts] = useState("");
  const [navShadow, setNavShadow] = useState(false);
  const [showCartWish, setShowCartWish] = useState(null);

  const [orderSummary, setOrderSummary] = useState(false);
  const [finalOrder, setFinalOrder] = useState(false);
  const [showMyOrders, setShowMyOrders] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  // ======================================================
  // CART STATE
  // ======================================================

  const [cart, setCart] = useState([]);

  const [cartLoading, setCartLoading] = useState(false);

  // ======================================================
  // WISHLIST STATE
  // ======================================================

  const [wishList, setWishList] = useState(() => {
    const wishStorage = localStorage.getItem("wishList");

    return wishStorage ? JSON.parse(wishStorage) : [];
  });

  // ======================================================
  // WISHLIST
  // ======================================================

  const addToWishList = (product) => {
    const productId = product._id || product.id;

    const addedBefore = wishList.find(
      (item) => (item._id || item.id) === productId,
    );

    if (addedBefore) {
      alert("This item is already added in the wishlist");
      return;
    }

    const addDate = new Date().toLocaleDateString("en-GB");

    setWishList([
      ...wishList,
      {
        ...product,
        addDate,
      },
    ]);
  };

  const clearWish = () => {
    setWishList([]);
  };

  // ======================================================
  // CART HELPERS
  // ======================================================

  const getProductId = (product) => {
    return product._id || product.id;
  };

  const convertBackendCart = (backendCart) => {
    if (!backendCart || !backendCart.items) {
      return [];
    }

    return backendCart.items
      .filter((item) => item.product)
      .map((item) => ({
        ...item.product,
        quantity: item.quantity,
      }));
  };

  // ======================================================
  // LOAD CART
  // ======================================================

  useEffect(() => {
    const loadCart = async () => {
      // Guest cart stays in localStorage
      if (!user) {
        const guestCart = localStorage.getItem("cart_guest");

        setCart(guestCart ? JSON.parse(guestCart) : []);

        return;
      }

      try {
        setCartLoading(true);

        const data = await getCart();

        const backendCart = convertBackendCart(data.cart);

        setCart(backendCart);

        // Keep a local cache too
        const userId = user._id || user.id;

        if (userId) {
          localStorage.setItem(`cart_${userId}`, JSON.stringify(backendCart));
        }
      } catch (error) {
        console.error("Failed to load cart:", error);

        // Do NOT silently use another user's cart.
        setCart([]);
      } finally {
        setCartLoading(false);
      }
    };

    loadCart();
  }, [user]);

  // ======================================================
  // ADD TO CART
  // ======================================================

  const addToCart = async (product) => {
    const productId = getProductId(product);

    if (!productId) {
      console.error("Product ID is missing:", product);
      alert("Unable to add this product to cart.");
      return;
    }

    // ----------------------------------------------
    // GUEST CART
    // ----------------------------------------------

    if (!user) {
      const existingItem = cart.find(
        (item) => getProductId(item) === productId,
      );

      if (existingItem) {
        setCart(
          cart.map((item) =>
            getProductId(item) === productId
              ? {
                  ...item,
                  quantity: item.quantity + 1,
                }
              : item,
          ),
        );
      } else {
        setCart([
          ...cart,
          {
            ...product,
            quantity: 1,
          },
        ]);
      }

      return;
    }

    // ----------------------------------------------
    // LOGGED-IN USER
    // ----------------------------------------------

    try {
      const data = await addToCartApi(productId, 1);

      if (!data.success) {
        throw new Error(data.message || "Failed to add product");
      }

      const updatedCart = convertBackendCart(data.cart);

      setCart(updatedCart);

      const userId = user._id || user.id;

      if (userId) {
        localStorage.setItem(`cart_${userId}`, JSON.stringify(updatedCart));
      }
    } catch (error) {
      console.error("Add to cart error:", error);

      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to add product to cart",
      );
    }
  };

  // ======================================================
  // DELETE CART ITEM
  // ======================================================

  const deleteCart = async (product) => {
    const productId = getProductId(product);

    if (!user) {
      const updatedCart = cart.filter(
        (item) => getProductId(item) !== productId,
      );

      setCart(updatedCart);

      return;
    }

    try {
      const data = await removeFromCart(productId);

      if (!data.success) {
        throw new Error(data.message || "Failed to remove product");
      }

      const updatedCart = convertBackendCart(data.cart);

      setCart(updatedCart);
    } catch (error) {
      console.error("Remove cart item error:", error);

      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to remove product",
      );
    }
  };

  // ======================================================
  // INCREASE QUANTITY
  // ======================================================

  const increaseQuantity = async (product) => {
    const productId = getProductId(product);

    const currentItem = cart.find((item) => getProductId(item) === productId);

    if (!currentItem) return;

    const newQuantity = currentItem.quantity + 1;

    // ----------------------------------------------
    // GUEST
    // ----------------------------------------------

    if (!user) {
      setCart(
        cart.map((item) =>
          getProductId(item) === productId
            ? {
                ...item,
                quantity: newQuantity,
              }
            : item,
        ),
      );

      return;
    }

    // ----------------------------------------------
    // LOGGED-IN
    // ----------------------------------------------

    try {
      const data = await updateCartItem(productId, newQuantity);

      if (!data.success) {
        throw new Error(data.message || "Failed to update quantity");
      }

      const updatedCart = convertBackendCart(data.cart);

      setCart(updatedCart);
    } catch (error) {
      console.error("Increase quantity error:", error);

      alert(
        error.response?.data?.message ||
          error.message ||
          "Unable to increase quantity",
      );
    }
  };

  // ======================================================
  // DECREASE QUANTITY
  // ======================================================

  const decreaseQuantity = async (product) => {
    const productId = getProductId(product);

    const currentItem = cart.find((item) => getProductId(item) === productId);

    if (!currentItem) return;

    const newQuantity = currentItem.quantity - 1;

    // Don't allow quantity 0
    if (newQuantity < 1) {
      return;
    }

    // ----------------------------------------------
    // GUEST
    // ----------------------------------------------

    if (!user) {
      setCart(
        cart.map((item) =>
          getProductId(item) === productId
            ? {
                ...item,
                quantity: newQuantity,
              }
            : item,
        ),
      );

      return;
    }

    // ----------------------------------------------
    // LOGGED-IN
    // ----------------------------------------------

    try {
      const data = await updateCartItem(productId, newQuantity);

      if (!data.success) {
        throw new Error(data.message || "Failed to update quantity");
      }

      const updatedCart = convertBackendCart(data.cart);

      setCart(updatedCart);
    } catch (error) {
      console.error("Decrease quantity error:", error);

      alert(
        error.response?.data?.message ||
          error.message ||
          "Unable to decrease quantity",
      );
    }
  };

  // ======================================================
  // GUEST CART STORAGE
  // ======================================================

  useEffect(() => {
    if (!user) {
      if (cart.length > 0) {
        localStorage.setItem("cart_guest", JSON.stringify(cart));
      } else {
        localStorage.removeItem("cart_guest");
      }
    }
  }, [cart, user]);

  // ======================================================
  // WISHLIST STORAGE
  // ======================================================

  useEffect(() => {
    if (wishList.length > 0) {
      localStorage.setItem("wishList", JSON.stringify(wishList));
    } else {
      localStorage.removeItem("wishList");
    }
  }, [wishList]);

  // ======================================================
  // PROFILE
  // ======================================================

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    const loadProfile = async () => {
      try {
        const data = await getProfile();

        setUser(data.user);

        localStorage.setItem("user", JSON.stringify(data.user));
      } catch (error) {
        console.error("Failed to load profile:", error);

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);
        setCart([]);
      }
    };

    loadProfile();
  }, []);

  // ======================================================
  // LOGOUT
  // ======================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setCart([]);

    setUser(null);

    setShowAuth(false);
    setShowCartWish(null);
    setOrderSummary(false);
    setFinalOrder(false);
  };

  // ======================================================
  // NAVIGATION
  // ======================================================

  const ScrollToProducts = () => {
    const scroll = document.getElementById("scroll-to-products");

    if (scroll) {
      scroll.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const shadow = () => {
      setNavShadow(window.scrollY > 10);
    };

    window.addEventListener("scroll", shadow);

    return () => {
      window.removeEventListener("scroll", shadow);
    };
  }, []);

  const show = (tab) => {
    setShowCartWish((prev) => (prev === tab ? null : tab));
  };

  const hide = () => {
    setShowCartWish(null);
  };

  // ======================================================
  // CART TOTALS
  // ======================================================

  const subTotal = cart.reduce(
    (acc, item) => acc + item.quantity * Number(item.price || 0),
    0,
  );

  const totalItemsInCart = cart.reduce((acc, item) => acc + item.quantity, 0);

  const shipping = totalItemsInCart * 3;

  const orderTotal = shipping + subTotal;

  // ======================================================
  // CONTACT
  // ======================================================

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await sendContactMessage(formData);

      if (data.success) {
        alert("Message sent successfully 🚀");

        setFormData({
          name: "",
          email: "",
          message: "",
        });
      } else {
        alert(data.message || "Failed to send message");
      }
    } catch (error) {
      console.error("Contact form error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to send message. Please try again.",
      );
    }
  };
  // ======================================================
  // WHY CHOOSE US
  // ======================================================

  const [clickedFeature, setClickedFeature] = useState(null);

  const handleFeatureClick = (featureTitle) => {
    setClickedFeature(featureTitle);

    console.log(`User clicked: ${featureTitle}`);
  };

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <div className="relative">
      <WishList
        showCartWish={showCartWish}
        hide={hide}
        addToCart={addToCart}
        wishList={wishList}
        clearWish={clearWish}
      />

      <Cart
        showCartWish={showCartWish}
        hide={hide}
        cart={cart}
        deleteCart={deleteCart}
        increaseQuantity={increaseQuantity}
        decreaseQuantity={decreaseQuantity}
        subTotal={subTotal}
        shipping={shipping}
        orderTotal={orderTotal}
        setOrderSummary={setOrderSummary}
      />

      <Navbar
        ScrollToProducts={ScrollToProducts}
        setSearchProducts={setSearchProducts}
        navShadow={navShadow}
        show={show}
        totalItemsInCart={totalItemsInCart}
        wishList={wishList}
        setShowAuth={setShowAuth}
        setAuthMode={setAuthMode}
        user={user}
        handleLogout={handleLogout}
        setShowMyOrders={setShowMyOrders}
        setShowAdminPanel={setShowAdminPanel}
      />

      {showAdminPanel && user?.role === "admin" && (
        <AdminPanel setShowAdminPanel={setShowAdminPanel} />
      )}

      <Banner />

      <Product
        searchProducts={searchProducts}
        addToCart={addToCart}
        addToWishList={addToWishList}
        wishList={wishList}
        cart={cart}
      />

      <div className="w-full h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 animate-pulse"></div>

      <WhyChooseUs
        handleFeatureClick={handleFeatureClick}
        clickedFeature={clickedFeature}
      />

      <div className="w-full h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 animate-pulse"></div>

      <Contact
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />

      <div className="w-full h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 animate-pulse"></div>

      {showMyOrders && user && <MyOrders setShowMyOrders={setShowMyOrders} />}

      {orderSummary && cart.length > 0 && (
        <OrderSummary
          cart={cart}
          subTotal={subTotal}
          shipping={shipping}
          orderTotal={orderTotal}
          setOrderSummary={setOrderSummary}
          setShowCartWish={setShowCartWish}
          setCart={setCart}
          setFinalOrder={setFinalOrder}
        />
      )}

      {finalOrder && <PlacedOrder setFinalOrder={setFinalOrder} />}

      <Footer />

      {showAuth && (
        <AuthModal
          setShowAuth={setShowAuth}
          authMode={authMode}
          setAuthMode={setAuthMode}
          onLogin={setUser}
        />
      )}
    </div>
  );
}

export default Home;
