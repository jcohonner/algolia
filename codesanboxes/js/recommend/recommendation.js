const recommend  = window['@algolia/recommend'];
const {h} = window['preact']
const { frequentlyBoughtTogether, relatedProducts } = window['@algolia/recommend-js'];
const htm = window['htm'];

// Initialize htm with Preact
const html = htm.bind(h);


const recommendClient =  recommend('U9UXVSI686', '737b3e1269f8cc2eeb6f8844b750996f');
const indexName = 'prod_ECOM_recommend';
const currentObjectID = 'A0E20000000279B';

frequentlyBoughtTogether({
  container: '#frequentlyBoughtTogether',
  recommendClient,
  indexName,
  objectIDs: [currentObjectID],
  itemComponent({ item }) {
    return (
      html`<h1>${item.name}</h1>`
    );
  },
});
