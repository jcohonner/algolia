const recommend = window["@algolia/recommend"];
const {
  frequentlyBoughtTogether,
  relatedProducts,
  trendingItems,
  trendingFacets,
} = window["@algolia/recommend-js"];
const recommendClient = recommend("", "");
const indexName = "prod_ECOM";
const currentObejctIDs = [
  "A0E20000000279B",
  "M0E20000000DVL9",
  "A0E20000000278Z",
];

frequentlyBoughtTogether({
  container: "#frequentlyBoughtTogether",
  recommendClient,
  indexName,
  transformItems(items) {
    return items
      .filter((item) => !currentObejctIDs.includes(item.objectID)) //remove products already in the cart
      .sort((a, b) => b._score - a._score) //sort by score, randomizing can also be an option for a shopping cart page
      .splice(0, 3); //keeep only 3 items
  },
  objectIDs: currentObejctIDs,
  itemComponent({ item, html }) {
    return html`<div>${item.objectID} ${item.name} ${item._score}</div>`;
  },
});
