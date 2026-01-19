import { useConnector } from 'react-instantsearch';
import { connectDualColorRefinementList } from './connectDualColorRefinementList';

export function useDualColorRefinementList(props, additionalWidgetProperties) {
  return useConnector(
    connectDualColorRefinementList,
    props,
    additionalWidgetProperties
  );
}
