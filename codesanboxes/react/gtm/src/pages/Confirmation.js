import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPurchase } from "../services/shoppingCart";

const formatPrice = (price) => `$${price}`;

export default function Confirmation() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    setMovies(getPurchase());
  }, []);

  const total = movies
    .reduce((sum, movie) => sum + (movie.price || 0), 0)
    .toFixed(2);

  return (
    <div className="min-h-screen bg-[#141414] px-4 md:px-16 py-16">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">
        Thanks for your purchase!
      </h1>
      {movies.length ? (
        <>
          <p className="text-white/80 mb-4">
            You now own these movies. Total charged: {formatPrice(total)}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {movies.map((movie) => (
              <div
                key={movie.objectID || movie.title}
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
        </>
      ) : (
        <p className="text-white/70 mb-4">
          No purchase recorded yet. Add movies to your Cart and buy them.
        </p>
      )}

      <div className="mt-8 flex gap-4">
        <Link
          to="/"
          className="px-4 py-2 bg-white/10 text-white rounded hover:bg-white/20"
        >
          Browse more
        </Link>
        <Link
          to="/cart"
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          View Cart
        </Link>
      </div>
    </div>
  );
}
