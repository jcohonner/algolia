import { useEffect, useState } from "react";
import { RefinementList, useDynamicWidgets, useInstantSearch } from "react-instantsearch";

const LIST_OF_FACETS_ATTRIBUTE_NAME = "attributes_for_facetting_top5";
const FACET_OBJECT_NAME = "attributes";
const DEFAULT_FACETS_LIST = [
  "Alésage",
  "Angle",
  "Autonomie",
  "Base",
  "Capacité",
  "Capacité de charge",
  "Capacité de coupe",
  "Capacité de serrage",
  "Chanfrein",
  "Charge",
  "Classe",
  "Code",
  "Compatibilité",
  "Consommation",
  "Longueur"
  

];
const CATEGORY_ATTRIBUTE_NAME = "category_3";
const CATEGORY3_CONFIG ={
  "Gants de protection":["Taille","Matière","Couleur"]
}


const getMainCategoryFromResults = (results) => {

  //TODO : using, if available query categorization predictions

  //From Facets
  const categoryFacet = results.getFacetByName(CATEGORY_ATTRIBUTE_NAME);
  if (!categoryFacet) return null;

  const mainCategory = categoryFacet.data ? Object.keys(categoryFacet.data)[0] : null;
  const mainCategoryCount = categoryFacet.data ? categoryFacet.data[mainCategory] : 0;

  // We consider that the main category is relevant to determine facets to display if it represents at least 20% of the results
  if (mainCategoryCount / results.nbHits < 0.2) {

    //If not we consider the main category of the current page of results

    const categories = results.hits.map(hit => hit[`${CATEGORY_ATTRIBUTE_NAME}`]).filter(Boolean);
    const categoryCounts = categories.reduce((acc, category) => {
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    const sortedCategories = Object.entries(categoryCounts).sort(([, a], [, b]) => b - a);
    const mostCommonCategory = sortedCategories.length > 0 ? sortedCategories[0][0] : null;

    return mostCommonCategory;
  } 
    
  return mainCategory;
}


const transformItems = (items, { results }) => {
  
  const popularFacetsData = results.getFacetByName(LIST_OF_FACETS_ATTRIBUTE_NAME) || {data: {}};
  
  //Object is already sorted by count desc, we just need the list of attributes
  const attributesCountDesc = Object.entries(popularFacetsData.data||{})
    .sort(([, a], [, b]) => b - a) // du plus grand au plus petit
    .map(([key]) => `${FACET_OBJECT_NAME}.${key}`);

  // First priority is given to the facets coming from the facet display content (rule data)
  const finalItemList = items.map(item => {
    const facetData = results.getFacetByName(item);
    const isFacetLoaded = !!facetData;
    
    return {
      facet: item,
      isLoaded: isFacetLoaded,
      forceLoad: true // we will use this property to force load the facet in the UI if it's part of the facet display content
    }
  });

  /*
  //Then we add facets based on the product category
  const mainCategory = getMainCategoryFromResults(results);
  console.log("Main category:", mainCategory);
  if (mainCategory && CATEGORY3_CONFIG[mainCategory]) {
    CATEGORY3_CONFIG[mainCategory].forEach(facet => {
      finalItemList.push({
        facet: `${FACET_OBJECT_NAME}.${facet}`,
        isLoaded: !!results.getFacetByName(`${FACET_OBJECT_NAME}.${facet}`),
        forceLoad: true // we will use this property to force load the facet in the UI if it's part of the category configuration
      });
    });
  }*/

  //Finally we add the remaining available facets
  attributesCountDesc.forEach(attribute => {
    if (!items.includes(attribute)) {
      finalItemList.push({
        facet: attribute,
        isLoaded: !!results.getFacetByName(attribute),
        forceLoad: false // we won't force load these facets, they will be loaded on demand when the user clicks on them
      });
    }
  });


  console.log("Final list of facets to display:", finalItemList);

  return finalItemList;
};


export default function RelevantWidgets(props) {
  const facets = [LIST_OF_FACETS_ATTRIBUTE_NAME,CATEGORY_ATTRIBUTE_NAME,...DEFAULT_FACETS_LIST.map(facet => `${FACET_OBJECT_NAME}.${facet}`)];
  const dynamicWidgetsAPI = useDynamicWidgets({transformItems,facets,maxValuesPerFacet:100, ...props});
  const attributesToRender = dynamicWidgetsAPI.attributesToRender;

  return attributesToRender.map((attribute, index) => {
    return (
      <PanelRefinementAccordion attribute={attribute} key={index}/>
    );
  });
}


function PanelRefinementAccordion({ attribute }) {
  const {facet, isLoaded, forceLoad} = attribute;
  const [open, setOpen] = useState(isLoaded || forceLoad);

  return (
    <div>
      <h3 onClick={() => setOpen(!open)}>{facet} {isLoaded ? '(Loaded)' : '(Not Loaded)'}</h3>
      {open && <RefinementList attribute={facet} />}      
    </div>
  );

}