import React, { useEffect, useState } from "react";
import { getProducts } from "../../api/productApi";
import { GoHeartFill } from "react-icons/go";
import { FaTags } from "react-icons/fa6";
import { MdNewLabel } from "react-icons/md";
import { RiEmotionSadFill } from "react-icons/ri";

function Product({ searchProducts, addToCart, addToWishList, wishList, cart }) {
  const categories = ["All", "Men", "Women", "Kids", "On Sale", "New Arrival"];

  const [active, setActive] = useState("All");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const data = await getProducts();

        setProducts(data.products);
        setError("");
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setError("Unable to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filterItems = products.filter((product) => {
    const matchCategory =
      active === "All" ||
      (active === "Men" && product.category === "Men") ||
      (active === "Women" && product.category === "Women") ||
      (active === "Kids" && product.category === "Kids") ||
      (active === "New Arrival" && product.newArrival) ||
      (active === "On Sale" && product.onSale);

    const matchSearch = product.name
      .toLowerCase()
      .includes(searchProducts.toLowerCase());

    return matchCategory && matchSearch;
  });

  if (loading) {
    return (
      <section className="bg-white py-6 max-w-7xl mx-auto px-4 sm:px-6">
        <p className="text-center font-bold text-lg">Loading products...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-white py-6 max-w-7xl mx-auto px-4 sm:px-6">
        <p className="bg-red-600 text-white font-bold text-center py-3 rounded">
          {error}
        </p>
      </section>
    );
  }

  /* rendering our product cards */
  const renderProducts = filterItems.map((product) => {
    return (
      <div
        key={product._id}
        className="bg-gray-300 flex flex-col items-center justify-center rounded-2xl relative"
      >
        <div className="flex justify-between gap-4 mt-3 w-full px-2 sm:px-3">
          <button
            onClick={() => addToWishList(product)}
            className={`absolute top-2 left-2 cursor-pointer ${
              wishList.some((item) => item._id === product._id)
                ? "text-red-600"
                : "text-white"
            }`}
          >
            <GoHeartFill />
          </button>

          <div>
            {(product.onSale || product.newArrival) && (
              <span
                className={`${
                  product.onSale
                    ? "bg-red-600 text-white font-bold"
                    : "bg-green-500 text-white font-bold"
                } flex absolute top-2 right-2 rounded-lg px-2 py-1 text-sm sm:text-base`}
              >
                {product.onSale ? (
                  <>
                    {" "}
                    <FaTags /> Sale{" "}
                  </>
                ) : (
                  <>
                    {" "}
                    <MdNewLabel /> New{" "}
                  </>
                )}
              </span>
            )}
          </div>
        </div>

        <div className="w-full h-48 sm:h-56 md:h-60 overflow-hidden flex items-center justify-center mt-0 px-2">
          <img
            className="w-full h-full object-cover rounded-xl"
            src={product.image}
            alt={product.name}
          />
        </div>

        <div className="flex flex-col items-center justify-center py-2 px-2">
          <h3 className="font-bold text-xl sm:text-2xl">{product.name}</h3>
          <div className="flex gap-4">
            <span className="w-10 h-6 flex items-center justify-center mt-3 text-red-700">
              ${product.price.toFixed(2)}
            </span>
            {product.onSale && (
              <span className="w-10 h-6 flex items-center justify-center mt-3 line-through text-zinc-600">
                ${product.oldPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        <div className="px-2 sm:px-3 mb-3">
          <button
            onClick={() => addToCart(product)}
            disabled={cart.some((item) => item._id === product._id)}
            className={`px-4 py-2 mt-2 rounded font-semibold text-white transition cursor-pointer active:bg-blue-300
            bg-indigo-600 hover:bg-indigo-700
            disabled:bg-gray-500 disabled:cursor-not-allowed`}
          >
            {cart.some((item) => item._id === product._id)
              ? "Added"
              : "Add to Cart"}
          </button>
        </div>
      </div>
    );
  });

  return (
    <section
      id="scroll-to-products"
      className="bg-white py-6 max-w-7xl mx-auto px-4 sm:px-6"
    >
      {/* tabs */}
      <div className="flex flex-wrap gap-4 justify-center">
        {categories.map((category) => (
          <button
            onClick={() => setActive(category)}
            key={category}
            className={`px-4 sm:px-6 w-32 sm:w-40 h-8 rounded-full text-white font-semibold cursor-pointer hover:bg-blue-600 transition-colors duration-300 ${
              active === category ? "bg-red-600" : "bg-blue-500"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* product listing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-4 mt-8 sm:mt-14">
        {filterItems.length === 0 ? (
          <p className="bg-red-600 flex items-center justify-center text-white font-bold text-center col-span-full h-10">
            No Item Found <RiEmotionSadFill />
          </p>
        ) : (
          renderProducts
        )}
      </div>
    </section>
  );
}

export default Product;
