//Create a simple server using express that listen to Algolia API search routes
const express = require('express');
const app = express();
var cors = require('cors');
const port = 3333;
const algoliasearch = require('algoliasearch');
const client = algoliasearch('3EA6KSSDGW', process.env.ALGOLIA_ADMIN_APIKEY);

app.use(cors());
app.use(express.json());

app.post('/search', async ({body}, res) => {
  var { requests } = body;
  

  //Get all the unique, non null, query strings from the requests array
  const queries = requests.filter(request => { return request.indexName==='movies' }).map(request => { return request.params.query }).filter((query, index, array) => { return query.length > 0 && array.indexOf(query) === index });

  //Search for query rules for each query string in the requests array
  const ruleQueries = queries.map(query => {
    return {
      indexName: 'movies_query_rules',
      params: {
        query,
      }
    }
  });  

  const QRresults = await client.search(ruleQueries);
  console.log(QRresults);

  const queryRulesPerQuery = {};
  QRresults.results.forEach(element => {
    queryRulesPerQuery[element.query]=element.hits.map(hit => { return hit.rule });
  });

  requests = requests.map(request => {
    if(request.indexName==='movies') {
      if (queryRulesPerQuery[request.params.query]) {
        request.params.rulesAtQueryTime = queryRulesPerQuery[request.params.query];
        request.params.getRankingInfo = true;
      }
    }
    return request;
  });


  const results = await client.search(requests);
  res.status(200).send(results);
});

app.post('/sffv', async ({body}, res) => {
  const { requests } = body;

  //see params.query in the requests array
  try {
    const results = await client.searchForFacetValues(requests);
    res.status(200).send(results);
  } catch (error) {
    console.log(error);
  }
});


app.listen(port, () => console.log(`Algolia proxy app listening on port ${port}!`));