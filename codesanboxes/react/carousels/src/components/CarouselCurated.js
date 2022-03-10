import React from 'react';
import AlgoliaContext from '../AlgoliaContext';
import CarouselHits from './CarouselHits';


class CarouselCurated extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            hits: []
        };
    }

    componentDidMount() {
        this.context.initIndex('movies_distinct_director_release_date_desc').search('',
        {
            hitsPerPage: 4,
            ruleContexts: 'holiday_playlist'
        }
        ).then(({hits})=> {
            this.setState({hits});
        }).catch(err => { console.error(err); });
    }

    render() {
        return (
            <CarouselHits hits={this.state.hits} />
        )
    }
}
CarouselCurated.contextType = AlgoliaContext;

export default CarouselCurated;