import React from "react";
import { ImHappy } from "react-icons/im";

function PlacedOrder({ setFinalOrder }) {
  const closeOrderMessage = () => {
    setFinalOrder(false);
  };

  return (
    <section className="bg-black/80 fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="bg-zinc-200 rounded-2xl w-full max-w-sm p-6 shadow-2xl">

        <div className="flex justify-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-green-600 text-center">
            Order Placed Successfully!
          </h2>
        </div>

        <div className="flex justify-center">
          <p className="flex items-center gap-2 text-base text-center">
            Your order has been placed successfully.
            <ImHappy className="text-yellow-500" />
          </p>
        </div>

        <p className="text-center text-gray-600 mt-3">
          Thank you for shopping with Zain's Fashion Store.
        </p>

        <div className="flex justify-center mt-6">
          <button
            onClick={closeOrderMessage}
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-xl"
          >
            Continue Shopping
          </button>
        </div>

      </div>
    </section>
  );
}

export default PlacedOrder;