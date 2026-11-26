import Carousel from "../components/Carousel";
import { Link } from "react-router-dom";
import { algoliaClient } from "../services/algoliaClient";
import { useState, useEffect } from "react";
import config from "../config";

export default function Home() {
  const [carouselHits, setCarouselHits] = useState({
    on_sale: [],
    horror: [],
    action: [],
    drama: [],
  });

  const injectQueryIDAndPosition = (hits, results) => {
    return hits.map((hit) => ({
      ...hit,
      __queryID: results.queryID,
      __position: hits.indexOf(hit) + 1,
    }));
  };

  useEffect(() => {
    algoliaClient
      .search({
        requests: [
          {
            indexName: config.moviesIndexName,
            query: "",
            hitsPerPage: 4,
            filters: 'categoryPageIdentifiers:"Best Offers"',
            clickAnalytics: true,
          },
          {
            indexName: config.moviesIndexName,
            query: "",
            hitsPerPage: 4,
            filters: "categoryPageIdentifiers:Horror",
            clickAnalytics: true,
          },
          {
            indexName: config.moviesIndexName,
            query: "",
            hitsPerPage: 4,
            filters: "categoryPageIdentifiers:Action",
            clickAnalytics: true,
          },
          {
            indexName: config.moviesIndexName,
            query: "",
            hitsPerPage: 4,
            filters: "categoryPageIdentifiers:Drama",
            clickAnalytics: true,
          },
        ],
      })
      .then((response) => {
        const results = {
          on_sale: injectQueryIDAndPosition(
            response.results[0].hits,
            response.results[0]
          ),
          horror: injectQueryIDAndPosition(
            response.results[1].hits,
            response.results[1]
          ),
          action: injectQueryIDAndPosition(
            response.results[2].hits,
            response.results[2]
          ),
          drama: injectQueryIDAndPosition(
            response.results[3].hits,
            response.results[3]
          ),
        };

        console.log(results);

        setCarouselHits(results);
      });
  }, []);

  return (
    <div data-insights-index={config.moviesIndexName}>
      <Carousel
        title="Best Offers"
        category="Best Offers"
        hits={carouselHits.on_sale}
      />
      <Carousel title="Horror" category="Horror" hits={carouselHits.horror} />
      <Carousel title="Action" category="Action" hits={carouselHits.action} />
      <Carousel title="Drama" category="Drama" hits={carouselHits.drama} />
    </div>
  );
}
