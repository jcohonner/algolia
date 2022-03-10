import React from 'react';
import AlgoliaContext from '../AlgoliaContext';
import CarouselHits from './CarouselHits';


class CarouselBestSellers extends React.Component {
    static contextType = AlgoliaContext;
    constructor(props) {
        super(props);
        this.state = {
            hits: []
        };
    }

    componentDidMount() {

        //get 3 random numbers between 0 and 100
        let randomNumbers = [];
        while (randomNumbers.length<3) {
            let randomNumber = Math.floor(Math.random() * 100);
            if (!randomNumbers.includes(randomNumber)) {
                randomNumbers.push(randomNumber);
            }
        }


        this.context.multipleQueries([
            {
                indexName: 'movies',
                query: '',
                params: {
                    "filters":"director:'Quentin Tarantino' OR director:'Clint Eastwood' OR director:'Steven Spielberg' OR director:'Martin Scorsese'  OR director:'Alfred Hitchcock'",
                    hitsPerPage: 1,
                    page:randomNumbers[0]
                }
            },
            {
                indexName: 'movies',
                query: '',
                params: {
                    "filters":"director:'Quentin Tarantino' OR director:'Clint Eastwood' OR director:'Steven Spielberg' OR director:'Martin Scorsese'  OR director:'Alfred Hitchcock'",
                    hitsPerPage: 1,
                    page:randomNumbers[1]
                }
            },
            {
                indexName: 'movies',
                query: '',
                params: {
                    "filters":"director:'Quentin Tarantino' OR director:'Clint Eastwood' OR director:'Steven Spielberg' OR director:'Martin Scorsese'  OR director:'Alfred Hitchcock'",
                    hitsPerPage: 1,
                    page:randomNumbers[2]
                }
            },
        ]).then(({results})=> {
            this.setState({hits : results.map(result => result.hits[0])});
        }).catch(err => { console.error(err); });
    }

    render() {
        return (
            <CarouselHits hits={this.state.hits} />
        )
    }
}

export default CarouselBestSellers;