import React from "react";
import { FaRegFaceSadTear } from "react-icons/fa6";

function WishList({ showCartWish, hide, addToCart, wishList, clearWish }) {
  return (
    <div
      className={`bg-zinc-300 flex flex-col justify-between gap-5 fixed top-0 bottom-0 right-0 left-auto z-50 w-full sm:w-96 md:w-90 border-l border-zinc-300 transform transition-transform duration-300 ${
        showCartWish === "wishList" ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Heading */}
      <div className="px-4 sm:px-10 bg-blue-500 h-20 flex items-center justify-center">
        <h3 className="text-2xl sm:text-3xl font-bold text-white text-center">
          My WishList
        </h3>
      </div>

      {/* Wish List Items */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-2 px-2 sm:px-5">
        {wishList.length === 0 ? (
          <p className="bg-black text-white flex items-center justify-center gap-2 h-10 text-sm sm:text-base">
            your wish list is empty <FaRegFaceSadTear />
          </p>
        ) : (
          wishList.map((product, index) => {
            return (
              <div
                key={product.id}
                className={`px-2 sm:px-5 py-1 border-y-1 border-zinc-300 flex flex-col sm:flex-row items-center sm:items-start gap-3 ${
                  index % 2 === 0 ? "bg-blue-200" : "bg-white"
                }`}
              >
                {/* image */}
                <div className="w-full sm:w-20 h-40 sm:h-20 flex-shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>

                {/* product details */}
                <div className="flex-1 w-full flex flex-col sm:flex-row justify-between items-center sm:items-start">
                  <div className="flex flex-col sm:flex-1">
                    <div className="flex justify-between w-full mb-2 text-sm sm:text-base">
                      <h4 className="font-semibold">{product.name}</h4>
                      <p>Added-{product.addDate}</p>
                    </div>
                    <div className="flex justify-between items-center gap-2 sm:gap-4 w-full">
                      <div className="flex gap-2 sm:gap-4">
                        <span className="w-16 h-6 flex items-center justify-center mt-1 text-red-700">
                          ${product.price.toFixed(2)}
                        </span>
                        {product.onSale && (
                          <span className="w-16 h-6 flex items-center justify-center mt-1 line-through text-zinc-600">
                            ${product.oldPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => addToCart(product)}
                        className="bg-blue-600 text-white text-center text-sm px-4 sm:px-5 py-[6px] sm:py-[7px] rounded-full cursor-pointer active:bg-blue-400 mt-2 sm:mt-0"
                      >
                        Add To Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* buttons */}
      <div className="flex flex-col sm:flex-row gap-2 px-2 sm:px-0">
        <button
          onClick={hide}
          className="bg-blue-600 text-white flex-1 h-10 cursor-pointer active:bg-blue-400"
        >
          Close
        </button>
        <button
          onClick={() => clearWish()}
          className="bg-blue-600 text-white flex-1 h-10 cursor-pointer active:bg-blue-400"
        >
          Clear All
        </button>
      </div>
    </div>
  );
}

export default WishList;
