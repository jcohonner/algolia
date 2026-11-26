import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCart, purchaseAll } from "../services/shoppingCart";
import { Link } from "react-router-dom";
import config from "../config";

const formatPrice = (price) => `$${price}`;

export default function Cart() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setItems(getCart());
  }, []);

  const handleBuyAll = () => {
    if (!items.length) return;

    const dataLayer = window.dataLayer || [];
    dataLayer.push({
      algoliaObjectData: null,
      algoliaObjectIDs: null,
    });
    dataLayer.push({
      event: "Purchased",
      algoliaObjectIDs: items.map((item) => `${item.objectID}`),
      algoliaObjectData: items.map((item) => ({
        price: item.price,
        discount: 9.99 - item.price,
        quantity: 1,
      })),
      algoliaValue: items
        .reduce((total, item) => total + item.price, 0)
        .toFixed(2),
      algoliaCurrency: "USD",
    });

    purchaseAll(items);
    navigate("/confirmation");
  };

  return (
    <div
      className="min-h-screen bg-[#141414] px-4 md:px-16 py-16"
      data-insights-index={config.moviesIndexName}
    >
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">Your Cart</h1>
        <button
          onClick={handleBuyAll}
          disabled={!items.length}
          className="px-4 py-2 bg-red-600 text-white rounded disabled:opacity-50"
        >
          Buy all
        </button>
      </div>

      {!items.length ? (
        <p className="text-white/70">
          No movies yet. Add a few from the listings or a movie page.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((movie) => (
            <div
              key={movie.objectID}
              className="bg-[#1f1f1f] rounded-lg overflow-hidden border border-white/10"
            >
              <img
                src={movie.backdrop}
                alt={movie.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4 space-y-2">
                <h2 className="text-xl font-semibold">{movie.title}</h2>
                <p className="text-white/70 text-sm">{movie.overview}</p>
                <p className="text-white font-medium">
                  {formatPrice(movie.price)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-8 flex gap-4">
        <Link
          to="/"
          className="px-4 py-2 bg-white/10 text-white rounded hover:bg-white/20"
        >
          Browse more
        </Link>
      </div>
    </div>
  );
}
