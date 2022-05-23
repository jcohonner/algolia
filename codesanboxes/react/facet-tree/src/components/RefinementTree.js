import React, { Component } from 'react';
import { connectRefinementList, Highlight } from 'react-instantsearch-dom';
import { createClassNames } from 'react-instantsearch-dom/dist/es/core/utils';
import List from './List';
import PropTypes from 'prop-types';
import { translatable } from 'react-instantsearch-core';

const cx = createClassNames('RefinementList');

class RefinementTreeComponent extends Component {

  static propTypes = {
    refine: PropTypes.func.isRequired,
    searchForItems: PropTypes.func.isRequired,
    searchable: PropTypes.bool,
    createURL: PropTypes.func.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.arrayOf(PropTypes.string).isRequired,
        count: PropTypes.number.isRequired,
        isRefined: PropTypes.bool.isRequired,
      })
    ),
    isFromSearch: PropTypes.bool.isRequired,
    canRefine: PropTypes.bool.isRequired,
    showMore: PropTypes.bool,
    limit: PropTypes.number,
    showMoreLimit: PropTypes.number,
    transformItems: PropTypes.func,
    className: PropTypes.string,
  };

  

  static defaultProps = {
    className: '',
  };

  state = {
    query: '',
  };

  selectItem = (item, resetQuery) => {
    resetQuery();
    this.props.refine(item.value);
  };

  renderItem = (item, resetQuery) => {
    const label = this.props.isFromSearch ? (
      <Highlight attribute="label" hit={item} />
    ) : (
      item.label
    );

    return (
      <label className={cx('label')}>
        {(item.level===1)?<input
          className={cx('checkbox')}
          type="checkbox"
          checked={item.isRefined}
          onChange={() => this.selectItem(item, resetQuery)}
          disabled={item.count===0}
        />:''}
        <span className={cx('labelText')}>{label}</span>{' '}
        {(item.level===1)?<span className={cx('count')}>{item.count}</span>:''}
      </label>
    );
  };


  render() {
    console.log(this.props);
    const {
      translate,
      items,
      showMore,
      limit,
      showMoreLimit,
      isFromSearch,
      searchForItems,
      searchable,
      canRefine,
      className,
    } = this.props;
    return (
      <List
        renderItem={this.renderItem}
        selectItem={this.selectItem}
        cx={cx}
        translate={translate}
        items={items}
        showMore={showMore}
        limit={limit}
        showMoreLimit={showMoreLimit}
        isFromSearch={isFromSearch}
        searchForItems={searchForItems}
        searchable={searchable}
        canRefine={canRefine}
        className={className}
        query={this.state.query}
      />
    );
  }

}

// 2. Connect the component using the connector
const RefinementTree = connectRefinementList(RefinementTreeComponent);

export default translatable({
  showMore: (extended) => (extended ? 'Show less' : 'Show more'),
  noResults: 'No results',
  submit: null,
  reset: null,
  resetTitle: 'Clear the search query.',
  submitTitle: 'Submit your search query.',
  placeholder: 'Search here…',
})(RefinementTree);