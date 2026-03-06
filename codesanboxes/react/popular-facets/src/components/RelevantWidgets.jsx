import { useEffect, useState } from "react";
import { RefinementList, useDynamicWidgets } from "react-instantsearch";

const transformItems = (items, { results }) => {
  console.log('transformItems', items,results);

  //items contains the list of facets to be displayed coming from the facet display content default or rule data

  //deep dive into the specific attribute to get the list of facets available for this result set

  //Trick : we use the name of the attribute to indicate if the facet is loaded or not, and if it should be auto forced to be loaded in the next search state. We can also use the content of the attribute to pass custom data
  // attribute|0 => facet not loaded
  // attribute|1 => facet loaded
  // attribute|2 => facet not loaded, but should be displayed immediately, so it should be forced to be loaded in the next search state
  

  const itemsWithData = items.map(item => {
    const facetData = results.getFacetByName(item);
    const isFacetLoaded = !!facetData;
    
    return `${item}|${isFacetLoaded ? '1' : '2'}`;
  });
    

  return itemsWithData;
};


export default function RelevantWidgets(props) {
  const facets = ["actors"]
  const dynamicWidgetsAPI = useDynamicWidgets({transformItems,facets, ...props});
  

  console.log('dynamicWidgetsAPI', dynamicWidgetsAPI);

  const attributesToRender = dynamicWidgetsAPI.attributesToRender;

  return attributesToRender.map((attribute, index) => {
    


    return (
      <div key={index}>
        <PanelRefinementAccordion attribute={attribute} />
      </div>
    );
  });
}


function PanelRefinementAccordion({ attribute }) {
  const [attributeName, isLoaded] = attribute.split('|');
  const [open, setOpen] = useState(isLoaded === '1' || isLoaded === '2');

  return (
    <div>
      <h3 onClick={() => setOpen(!open)}>{attributeName} {isLoaded === '1' ? '(Loaded)' : '(Not Loaded)'}</h3>
      {open && <RefinementList attribute={attributeName} />}
    </div>
  );

}