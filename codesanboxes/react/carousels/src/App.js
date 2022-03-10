import algolia from 'algoliasearch';
import React from 'react';
import AlgoliaContext from './AlgoliaContext';
import CarouselBestSelletsAndArrivals from './components/CarouselBestSelletsAndArrivals';
import CarouselMoreFrom from './components/CarouselMoreFrom';
import CarouselNewArrivals from './components/CarouselNewArrivals';
import CarouselCurated from './components/CarouselCurated';
import CarouselWeightedFilters from './components/CarouselWeightedFilters';
import CarouselBestSellers from './components/CarouselBestSellers';

const algoliaClient = algolia('3EA6KSSDGW', '23fef1254e41ec407b1fc80f852e4a40');


export default function App() {
  return (
    <AlgoliaContext.Provider value={algoliaClient}>
    <div className="App">
        
      <h1>Hearst Carousel demo</h1>

      <div className="bg-gray-50 rounded-lg p-5 m-5">
        <h2 className="text-xl">New Arrivals</h2>
        <p><strong>Automation Logic</strong>: Most recent products from New Arrivals, no more than 1 from any one designer</p>
        <p><strong>Algolia implementation</strong>: Replica index of products using distinct feature on designer and sort on date, filter query on "New arrival" boolean</p>
        <p><strong>Demo</strong>: 3 movies from index with distinct on director and sort on release date</p>
        <CarouselNewArrivals />
      </div>
      <div className="bg-gray-50 rounded-lg p-5 m-5">
        <h2 className="text-xl">Essentials Home Selects, Top Beauty Items This Week</h2>
        <p><strong>Automation Logic</strong>: 50/50 Best Sellers and New Arrivals from Home, no more than 1 New Arrival from any one designer</p>
        <p><strong>Algolia implementation</strong>: Replica index of products using distinct feature on designer and sort on date, 2 queries then dedupe and sort: </p> <ul>
            <li>Query 1: 2 items filters on "New arrival" boolean + sub category</li>
            <li>Query 2: 4 items filters on "Best seller" boolean + sub category</li></ul>
        <p><strong>Demo</strong>: 2 movies from index with distinct on director and sort on release date, filter on on_sale and genre=Comedy + 4 movies from same index, filter on "featured" and genre=Comedy</p>
        <CarouselBestSelletsAndArrivals />
      </div>
      <div className="bg-gray-50 rounded-lg p-5 m-5">
        <h2 className="text-xl">More from This Designer</h2>
        <p><strong>Automation Logic</strong>: 50/50 Best Sellers and New Arrivals from the Designer, If not enough eligible products then do not display carousel</p>
        <p><strong>Algolia implementation</strong>: Replica index of products using with custom ranking on date, 2 queries then dedupe and sort: </p>
        <ul>
            <li>Query 1: 2 items filters on "Best seller" boolean + designer, optional filters on category</li>
            <li>Query 2: 4 items filters on "New arrival" boolean + sub category, optional filters on category</li>
            </ul>
        
        <p><strong>Demo</strong>: 2 movies from index with custom ranking on date, filter on director="Quentin Tarantino" and on_sale, optional filter genre=Comedy + 4 movies from same index, filter on director="Quentin Tarantino" and "featured" optional filter genre=Comedy</p>
        <CarouselMoreFrom />
      </div>
      <div className="bg-gray-50 rounded-lg p-5 m-5">
        <h2 className="text-xl">Curated lists</h2>
        <p><strong>Automation Logic</strong>: curated</p>
        <p><strong>Algolia implementation</strong>: leveraging Algolia rules feature you can "pin" records to a specific context. That context will be passed to the query (usually empty). This also provide an easy way the create both curated & autocmatic results from a single query. 
        Rules may be created from Algolia Dashboard as well as using the API</p>
        <p><strong>Demo</strong>: 1 rule triggered by rule context "holiday_playlits" and an empty query
        <img src="/public/img/rule.png"/></p>
        <CarouselCurated />
      </div>
      <div className="bg-gray-50 rounded-lg p-5 m-5">
        <h2 className="text-xl">Weighted filters / More from the editors / Latest Obessions / Shop the trend / You May also like</h2>
        <p><strong>Automation Logic</strong>: Shoppable articles featuring the same Product, then Trend, then Designer, then Menu Category</p>
        <p><strong>Algolia implementation</strong>: by weighting a set of filters you can leverage the ranking formula "filters" that will rank results based on the sum of the scored of matched filters and optionalFilters.</p>
        <p><strong>Demo</strong>: director:'Lana Wachowski'&lt;score=4&gt; OR genres:'Science Fiction'&lt;score=2&gt; OR genres:'Adventure'&lt;score=1&gt;
        </p>
        <CarouselWeightedFilters />
      </div>
      <div className="bg-gray-50 rounded-lg p-5 m-5">
        <h2 className="text-xl">Best Sellers this season</h2>
        <p><strong>Automation Logic</strong>: Products that are in the top 10 sellers by $ or qty for the last 4 weeks, sorting logic: random</p>
        <p><strong>Algolia implementation</strong>: Algolia do not provide any random feature</p>
        <p><strong>Demo</strong>: 3 random pages from index movies with directors (= top sellers) 'Quentin Tarantino','Clint Eastwood','Steven Spielberg','Martin Scorsese','Alfred Hitchcock' </p>
        <CarouselBestSellers />
      </div>
      
    </div>
    </AlgoliaContext.Provider>
  );
}