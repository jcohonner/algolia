import { Link } from "react-router-dom";
import fakeHit from "../services/fakeHit";
import { addToCart } from "../services/shoppingCart";
import config from "../config";

export default function Hit({ hit, sendEvent }) {
  hit = hit || fakeHit;

  let url = `/movie/${hit.objectID}`;

  const handleAddToCart = (event) => {
    event.preventDefault();
    addToCart(hit);
    if (sendEvent) sendEvent("conversion", hit, "Movie added to Cart");

    const dataLayer = window.dataLayer || [];
    dataLayer.push({
      algoliaObjectData: null,
      algoliaObjectIDs: null,
    });
    dataLayer.push({
      event: "Added To Cart",
      algoliaObjectIDs: [`${hit.objectID}`],
      algoliaObjectData: [
        {
          queryID: hit.__queryID,
          price: hit.price,
          discount: 9.99 - hit.price,
          quantity: 1,
        },
      ],
      algoliaValue: hit.price.toFixed(2),
      algoliaCurrency: "USD",
    });
  };

  return (
    <div
      className="relative aspect-video rounded-md overflow-hidden group cursor-pointer transition-transform duration-200 ease-out hover:scale-105"
      data-insights-object-id={hit.objectID}
      data-insights-query-id={hit.__queryID}
      data-insights-position={hit.__position}
    >
      <Link to={url}>
        <img
          src={hit.backdrop}
          className="w-full h-full object-cover"
          width="100%"
        />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center p-4 text-center">
          <h3 className="text-white font-bold text-lg mb-1">{hit.title}</h3>
          <p className="text-white/80 text-sm mb-3">{hit.price}</p>
          <button
            onClick={(event) => handleAddToCart(event)}
            className="addToCartButton bg-[#17012c] hover:bg-red-700 text-white text-sm py-1 px-4 rounded-md flex items-center transition-colors cursor-pointer"
          >
            Add to Cart
          </button>
        </div>
      </Link>
    </div>
  );
}
