import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import config from "../config";
import fakeHit from "../services/fakeHit";
import { addToCart, savePurchase } from "../services/shoppingCart";

// Helper function to format date from timestamp
const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Helper function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function Movie() {
  let { movieId } = useParams();
  let [movie, setMovie] = useState(null);
  const navigate = useNavigate();
  const dataLayer = window.dataLayer || [];

  useEffect(() => {
    //Fetching from Algolia DEMO server
    // For Demo Only, use your database to retrieve single objectIDs

    fetch(
      `https://${config.algoliaDemo.APPID}-dsn.algolia.net/1/indexes/DEMO_movies/${movieId}`,
      {
        method: "GET",
        headers: {
          "x-algolia-application-id": config.algoliaDemo.APPID,
          "x-algolia-api-key": config.algoliaDemo.API_KEY,
        },
      }
    )
      .then((response) => {
        if (response.status !== 200) {
          throw "error while fetching";
        }
        return response.json();
      })
      .then((data) => {
        setMovie(data);
      })
      .catch((e) => {
        setMovie(fakeHit);
      });

    dataLayer.push({
      event: "PDP Viewed",
      "insights-objectIDs": [movieId],
    });
  }, [movieId]);

  const handleWatchNow = () => {
    if (!movie) return;
    savePurchase([movie]);
    // clear algolia array first to
    dataLayer.push({
      algoliaObjectData: null,
      algoliaObjectIDs: null,
    });
    dataLayer.push({
      event: "Added To Cart",
      algoliaObjectIDs: [`${movie.objectID}`],
      algoliaObjectData: [
        {
          price: movie.price,
          discount: 9.99 - movie.price,
          quantity: 1,
        },
      ],
      algoliaValue: movie.price.toFixed(2),
      algoliaCurrency: "USD",
    });
    dataLayer.push({
      event: "Purchased",
    });
    navigate("/confirmation");
  };

  const handleAddToCart = () => {
    if (!movie) return;
    addToCart(movie);
    dataLayer.push({
      algoliaObjectData: null,
      algoliaObjectIDs: null,
    });
    dataLayer.push({
      event: "Added To Cart",
      algoliaObjectIDs: [`${movie.objectID}`],
      algoliaObjectData: [
        {
          price: movie.price,
          discount: 9.99 - movie.price,
          quantity: 1,
        },
      ],
      algoliaValue: movie.price.toFixed(2),
      algoliaCurrency: "USD",
    });
  };

  return (
    <>
      {movie && (
        <div
          className="min-h-screen bg-[#141414]"
          data-insights-index={config.moviesIndexName}
        >
          {/* Hero section with backdrop */}
          <div className="relative h-[70vh]">
            <div className="absolute w-full h-full">
              <img
                src={movie.backdrop}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/20 to-transparent" />
            </div>

            {/* Movie info overlay */}
            <div className="relative pt-[25vh] px-4 md:px-16 flex flex-col md:flex-row items-start gap-8">
              {/* Poster */}
              <div className="hidden md:block w-64 flex-shrink-0">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full rounded-md shadow-2xl"
                />
              </div>

              {/* Details */}
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-bold mb-2">
                  {movie.title}
                </h1>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4 text-sm text-white/80">
                  <div className="flex items-center">
                    <span>{movie.vote_average}/10</span>
                    <span className="text-white/60 ml-1">
                      ({movie.vote_count} votes)
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span>{movie.year}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre}
                      className="px-3 py-1 bg-white/10 rounded-full text-sm"
                    >
                      {genre}
                    </span>
                  ))}
                </div>

                <p className="hidden lg:block text-lg mb-6 text-white/90 max-w-3xl">
                  {movie.overview}
                </p>

                <div
                  className="flex flex-wrap gap-4 mb-8"
                  data-insights-objectid={movie.objectID}
                  data-insights-indexname={config.moviesIndexName}
                  data-insights-currency="USD"
                  data-insights-object-data={JSON.stringify({
                    price: movie.price,
                    discount: 9.99 - movie.price,
                    quantity: 1,
                  })}
                >
                  <button
                    className="flex items-center px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition cursor-pointer"
                    onClick={handleWatchNow}
                    id="pdp-buy-now-button"
                  >
                    Buy now for ${movie.price}
                  </button>
                  <button
                    className="flex items-center px-6 py-2 bg-white/10 text-white rounded hover:bg-white/20 transition cursor-pointer"
                    onClick={handleAddToCart}
                    id="pdp-add-to-cart-button"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Additional details section */}
          <div className="px-4 md:px-16 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Cast section */}
              <div className="md:col-span-2">
                <h2 className="text-2xl font-bold mb-4">Cast</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {movie.actors.slice(0, 12).map((actor, index) => (
                    <div key={index} className="bg-[#1f1f1f] p-3 rounded-md">
                      <p className="font-medium">{actor}</p>
                    </div>
                  ))}
                </div>
                {movie.actors.length > 12 && (
                  <button className="mt-4 text-white/70 hover:text-white transition-colors">
                    +{movie.actors.length - 12} more cast members
                  </button>
                )}
              </div>

              {/* Details section */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Details</h2>
                <div className="space-y-4 bg-[#1f1f1f] p-4 rounded-md">
                  <div>
                    <p className="text-white/60 text-sm">Director</p>
                    <p className="font-medium">{movie.director}</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Release Date</p>
                    <p className="font-medium">
                      {formatDate(movie.release_date)}
                    </p>
                  </div>
                  {movie.budget > 0 && (
                    <div>
                      <p className="text-white/60 text-sm">Budget</p>
                      <p className="font-medium">
                        {formatCurrency(movie.budget)}
                      </p>
                    </div>
                  )}
                  {movie.revenue > 0 && (
                    <div>
                      <p className="text-white/60 text-sm">Revenue</p>
                      <p className="font-medium">
                        {formatCurrency(movie.revenue)}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-white/60 text-sm">Original Language</p>
                    <p className="font-medium">
                      {movie.original_language === "en"
                        ? "English"
                        : movie.original_language}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Popularity Score</p>
                    <p className="font-medium">{movie.popularity}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
