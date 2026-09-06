import React, { useState } from "react";
import Logo from "../../assets/Logo.jpg";
import { FaSearch, FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { GoHeartFill } from "react-icons/go";
import { IoMdBasket } from "react-icons/io";

function Navbar({
  ScrollToProducts,
  setSearchProducts,
  navShadow,
  show,
  totalItemsInCart,
  wishList,
  setShowAuth,
  setAuthMode,
  user,
  handleLogout,
  setShowMyOrders,
  setShowAdminPanel,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const openLogin = () => {
    setAuthMode("login");
    setShowAuth(true);
    setMenuOpen(false);
  };

  const openMyOrders = () => {
    setUserMenuOpen(false);
    setMenuOpen(false);
    setShowMyOrders(true);
  };

  const logout = () => {
    setUserMenuOpen(false);
    setMenuOpen(false);
    handleLogout();
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 transition-shadow z-30 ${
        navShadow ? "shadow-2xl" : ""
      }`}
    >
      <nav className="flex flex-col md:flex-row justify-between items-center bg-white mx-auto max-w-[1300px] px-4 sm:px-8 md:px-12 h-auto md:h-20 py-4 md:py-0 relative">
        {/* LOGO */}
        <a href="#" className="w-16 sm:w-20 h-16 sm:h-20 mb-2 md:mb-0">
          <img src={Logo} alt="LOGO" className="rounded-full w-full h-full" />
        </a>

        {/* SEARCH */}
        <div className="flex items-center w-full md:w-auto justify-center mb-2 md:mb-0">
          <div className="flex border-2 border-black rounded-full h-10 w-full md:w-80">
            <input
              onChange={(e) => setSearchProducts(e.target.value)}
              onClick={ScrollToProducts}
              className="focus:outline-none w-full p-2 sm:p-4 text-black rounded-l-full"
              type="text"
              placeholder="Search..."
            />

            <button
              type="button"
              className="flex justify-center items-center p-2 sm:p-4 text-black rounded-r-full"
            >
              <FaSearch />
            </button>
          </div>
        </div>

        {/* MOBILE MENU BUTTON */}
        <div className="md:hidden absolute top-6 right-4 text-3xl cursor-pointer z-50">
          <button type="button" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* RIGHT SIDE */}
        <div
          className={`flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-4 text-2xl sm:text-3xl md:text-4xl md:static absolute md:bg-transparent bg-white top-20 right-0 w-full md:w-auto transition-transform duration-300 ${
            menuOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"
          } p-4 md:p-0`}
        >
          {/* WISHLIST */}
          <button
            type="button"
            onClick={() => {
              show("wishList");
              setMenuOpen(false);
            }}
            className="relative cursor-pointer"
            title="Wishlist"
          >
            <GoHeartFill />

            {wishList.length > 0 && (
              <span className="bg-red-500 text-white flex absolute -top-2 -right-2 justify-center items-center rounded-full w-4 h-4 sm:w-5 sm:h-5 text-xs border-2 border-white">
                {wishList.length}
              </span>
            )}
          </button>

          {/* CART */}
          <button
            type="button"
            onClick={() => {
              show("cart");
              setMenuOpen(false);
            }}
            className="relative cursor-pointer"
            title="Cart"
          >
            <IoMdBasket />

            {totalItemsInCart > 0 && (
              <span className="bg-red-500 text-white flex absolute -top-2 -right-2 justify-center items-center rounded-full w-4 h-4 sm:w-5 sm:h-5 text-xs border-2 border-white">
                {totalItemsInCart}
              </span>
            )}
          </button>

          {/* AUTHENTICATION */}
          {!user ? (
            <button
              type="button"
              onClick={openLogin}
              className="cursor-pointer hover:text-blue-600 transition"
              title="Login / Sign Up"
            >
              <FaUserCircle />
            </button>
          ) : (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 text-base md:text-lg font-semibold hover:text-blue-600"
              >
                <FaUserCircle />

                <span>{user.firstName}</span>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white border border-gray-200 rounded-xl shadow-xl p-2 text-sm z-50">
                  {/* USER INFORMATION */}
                  <div className="px-3 py-3 border-b">
                    <p className="font-bold">
                      {user.firstName} {user.lastName}
                    </p>

                    <p className="text-gray-500 text-xs break-all mt-1">
                      {user.email}
                    </p>
                  </div>

                  {/* MY ORDERS */}
                  <button
                    type="button"
                    className="w-full text-left px-3 py-3 hover:bg-gray-100 rounded"
                    onClick={openMyOrders}
                  >
                    📦 My Orders
                  </button>

                  {user?.role === "admin" && (
                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        setMenuOpen(false);

                        if (setShowAdminPanel) {
                          setShowAdminPanel(true);
                        }
                      }}
                      className="w-full border-t px-4 py-3 text-left font-medium text-purple-700 hover:bg-purple-50"
                    >
                      ⚙️ Admin Panel
                    </button>
                  )}

                  {/* LOGOUT */}
                  <button
                    type="button"
                    className="w-full text-left px-3 py-3 hover:bg-gray-100 rounded text-red-600"
                    onClick={logout}
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
