// goal : {"filters":"colors:\"primary|orange|#FFA500\"<score=2> OR colors:\"secondary|orange|#FFA500\""}
export function connectDualColorRefinementList(renderFn, unmountFn = noop) {
  return function dualColorRefinementList(widgetParams) {
    const { attribute } = widgetParams;
    const connectorState = {};
    return {
      $$type: "salomon.dualColorRefinementList",
      getWidgetRenderState({ results, helper }) {
        if (!connectorState.refine) {

          // get the clicked facet values in the form of "color|hex"

          connectorState.refine = (value) => {

            if (connectorState.isRefined(value)) {
              helper.removeDisjunctiveFacetRefinement(attribute, "primary|" + value+"<score=2>");
              helper.removeDisjunctiveFacetRefinement(attribute, "secondary|" + value);
              helper.search();
              return;
            }

            helper.addDisjunctiveFacetRefinement(attribute, "primary|" + value+"<score=2>");
            helper.addDisjunctiveFacetRefinement(attribute, "secondary|" + value);
            helper.search();
          }

          connectorState.isRefined = (value) => {
            const refinements = helper.state.disjunctiveFacetsRefinements[attribute] || [];
            return refinements.includes("primary|" + value+"<score=2>") ||
                   refinements.includes("secondary|" + value);
          }
        }

        // When there are no results, return the API with default values.
        // This shows a fallback UI while waiting for results.
        if (!results) {
          return { items: [], refine: connectorState.refine, widgetParams };
        }

        // Retrieve the facet values for the given attribute and sort them by
        // ascending name. Store the facet values in the `items` variable.
        const allItems =
          results.getFacetValues(attribute, {
            sortBy: ["name:asc"],
          }) || [];

        const items = [];
        const itemMap = new Map();
        allItems.forEach((item) => {
          const parts = item.name.split('|'),
                name = parts[1],
                hex = parts[2],
                code = name+"|"+hex;

          if (itemMap.has(name)) {
            const existing = itemMap.get(name);
            existing.count += item.count;
            existing.isExcluded = existing.isExcluded && item.isExcluded;
          } else {
            itemMap.set(name, { ...item, name, hex, code, isRefined: connectorState.isRefined(code)});
          }
        });
        items.push(...itemMap.values());     

        return {
          items,
          refine: connectorState.refine,
          widgetParams,
        };

      },
      getRenderState(renderState, renderOptions) {
        return {
          ...renderState,
          dualColorRefinementList: {
            ...renderState.dualColorRefinementList,
            [attribute]: this.getWidgetRenderState(renderOptions),
          },
        };
      },
      init(initOptions) {
        const { instantSearchInstance } = initOptions;
        renderFn(
          {
            ...this.getWidgetRenderState(initOptions),
            instantSearchInstance,
          },
          true,
        );
      },
      render(renderOptions) {
        const { instantSearchInstance } = renderOptions;

        renderFn(
          {
            ...this.getWidgetRenderState(renderOptions),
            instantSearchInstance,
          },
          false,
        );
      },
      dispose(disposeOptions) {
        unmountFn();
      },
      getWidgetUiState(uiState, { searchParameters }) {
        // The global UI state is merged with a new one to store the UI
        // state of the current widget.
        return {
          ...uiState,
          dualColorRefinementList: {
            ...uiState.dualColorRefinementList,
            [attribute]: searchParameters.getExcludeRefinements(attribute),           
          },      
        }
      },
      getWidgetSearchParameters(searchParameters, { uiState }) {
        const state = searchParameters.addDisjunctiveFacet(attribute);
        const values = uiState.dualColorRefinementList?.[attribute];

        if (Array.isArray(values)) {
          return values.reduce(
            (acc, curr) => acc.addExcludeRefinement(attribute, curr),
            state,
          );
        }

        return state;
      },    

    };
  };
}

const noop = () => {};