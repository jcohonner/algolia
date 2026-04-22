import { useEffect, useState } from "react";
import { RefinementList, useDynamicWidgets, useInstantSearch, ToggleRefinement, RangeInput } from "react-instantsearch";

const componentMapping = {
  "range": RangeInput,
  "toggle": ToggleRefinement,
  "list": RefinementList
}


export default function RelevantWidgets(props) {
  const dynamicWidgetsAPI = useDynamicWidgets({...props});
  const search = useInstantSearch();
  const attributesToRender = dynamicWidgetsAPI.attributesToRender;

  const userDataWithFacetMapping = search.results?.userData?.find(data => {
    return typeof data === "object" && data.hasOwnProperty("facetMapping");
  }) || {facetMapping:{}};

  const facetMapping = userDataWithFacetMapping.facetMapping || {};


 /* const facetMapping = {
    "price": {widget: "range"},
    "featured": {widget: "toggle"},
    "actors": {widget: "list", props: {"searchable": true}}
  }*/

  const defaultWidgetConfiguration = {widget: "list", props: {}};

  return attributesToRender.map((attribute, index) => {
    const widgetConfig = facetMapping[attribute] || defaultWidgetConfiguration;
    return (
      <PanelRefinement attribute={attribute} widget={widgetConfig} key={index}/>
    );
  });
}


function PanelRefinement({ attribute, widget }) {  
  const WidgetComponent = componentMapping[widget.widget];
  return (
    <div>
      <h3>{attribute}</h3>
      <WidgetComponent attribute={attribute} {...widget.props} />
    </div>
  );
}
