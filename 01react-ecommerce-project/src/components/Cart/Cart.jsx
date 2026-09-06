import React from "react";
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa6";
import { FaRegFaceSadTear } from "react-icons/fa6";

function Cart({
  showCartWish,
  hide,
  cart,
  deleteCart,
  increaseQuantity,
  decreaseQuantity,
  subTotal,
  shipping,
  orderTotal,
  setOrderSummary,
}) {
  return (
    <div
      className={`bg-white flex flex-col justify-between gap-5 fixed top-0 bottom-0 right-0 left-auto z-50 w-full sm:w-[400px] md:w-[450px] lg:w-[500px] border-l border-zinc-300 transform transition-transform duration-300 ${
        showCartWish === "cart" ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Heading */}
      <div className="px-6 sm:px-10 bg-blue-500 h-20 flex items-center justify-center">
        <h3 className="text-2xl sm:text-3xl font-bold text-white text-center">
          My Cart
        </h3>
      </div>

      {/* Cart Items */}
      <div className="flex-1 flex flex-col gap-2 overflow-y-auto px-4 sm:px-5">
        {cart.length === 0 ? (
          <p className="bg-black text-white flex items-center justify-center gap-2 h-10">
            your cart is empty <FaRegFaceSadTear />
          </p>
        ) : (
          cart.map((product, index) => (
            <div
              key={index}
              className={`px-2 sm:px-5 py-2 border-y border-zinc-300 flex flex-col sm:flex-row items-center sm:items-start gap-3 ${
                index % 2 === 0 ? "bg-blue-200" : "bg-white"
              }`}
            >
              {/* image */}
              <div className="w-20 h-20 flex-shrink-0">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover rounded"
                />
              </div>

              {/* product details */}
              <div className="flex-1 flex flex-col justify-between w-full">
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold">{product.name}</h4>
                  <button
                    onClick={() => deleteCart(product)}
                    className="bg-red-600 text-white rounded-full w-8 h-8 flex justify-center items-center cursor-pointer active:bg-red-400 mb-1"
                  >
                    <FaTrash />
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row justify-between mt-2 sm:mt-0 items-start sm:items-center gap-2 sm:gap-4">
                  <div className="flex gap-4 items-center">
                    <span className="text-red-700 font-semibold">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.onSale && (
                      <span className="line-through text-zinc-600">
                        ${product.oldPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2 items-center">
                    <button
                      onClick={() => decreaseQuantity(product)}
                      className="bg-blue-600 text-white rounded-full w-8 h-8 flex justify-center items-center cursor-pointer active:bg-blue-400"
                    >
                      <FaMinus />
                    </button>
                    <span>{product.quantity}</span>
                    <button
                      onClick={() => increaseQuantity(product)}
                      className="bg-blue-600 text-white rounded-full w-8 h-8 flex justify-center items-center cursor-pointer active:bg-blue-400"
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Cart Total */}
      <div className="px-6 sm:px-10 border-y border-zinc-600">
        <div className="flex justify-between pt-2 text-sm sm:text-base">
          <span>SubTotal</span>
          <span>${subTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between py-2 text-sm sm:text-base">
          <span>Shipping & Handling</span>
          <span>${shipping.toFixed(2)}</span>
        </div>
        <div className="flex justify-between py-2 border-y border-zinc-600 text-base sm:text-lg font-bold text-blue-600">
          <span>Order Total</span>
          <span>${orderTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* buttons */}
      <div className="flex flex-col sm:flex-row gap-2 px-6 sm:px-10 py-4">
        <button
          onClick={hide}
          className="bg-blue-500 text-white flex-1 h-10 cursor-pointer active:bg-blue-400"
        >
          close
        </button>
        <button
          className={`text-white flex-1 h-10 active:bg-blue-400 ${
            cart.length === 0
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-500 cursor-pointer"
          }`}
          onClick={() => {
            setOrderSummary(true)
            hide();
          }
          }
          disabled={cart.length === 0}
        >
          checkout
        </button>
      </div>
    </div>
  );
}

export default Cart;
