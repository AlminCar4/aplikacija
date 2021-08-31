import { faSearch, faVideo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Component } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import api, { ApiResponse } from "../../api/api";
import MovieType from "../../types/MovieType";
import RoledMainMenu from "../RoledMainMenu/RoledMainMenu";
import SingleMoviePreview from "../SingleMoviePreview/SingleMoviePreview";


interface MoviePageProperties {
    match: {
        params: {
            mId: number;
        }
    }
}

interface MoviePageState {
    isUserLoggedIn: boolean;
    movies?: MovieType[];
    message: string;
    filters: {
        keywords: string;
        genre: "comedy" | "action";
        priceMinimum: number;
        priceMaxium: number;
        order: "name asc" | "name desc" | "price asc" | "price desc";
    }
}

interface MovieDto {
    movieId: number;
    name: string;
    description?: string;
    genre?: string;
    year?: string;
    rating?: number;
    moviePrices?: {
        price: number;
        createdAt: string;
    }[];
}

export default class MoviePage extends Component<MoviePageProperties> {
    state: MoviePageState;
    
    constructor(props: MoviePageProperties | Readonly<MoviePageProperties>) {
        super(props);

        this.state = {
            isUserLoggedIn: true,
            message: '',
            filters: {
                keywords: '',
                genre: "comedy",
                priceMinimum: 0.01,
                priceMaxium: 100000,
                order: "price asc",
            }
         };
    }

    render() {
        if (this.state.isUserLoggedIn === false) {
            return (
                <Redirect to="/user/login" /> 
            );
        }
        return (
            <Container>
                <RoledMainMenu role="user" />
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={ faVideo } />
                            { this.printOptionalMessage() }

                            <Row>
                                <Col xs="12" md="4" lg="3">
                                    { this.printFilters() }
                                </Col>
                                <Col xs="12" md="8" lg="9">
                                    { this.showMovies() }
                                </Col>
                            </Row>
                           
                        </Card.Title>
                        
                    </Card.Body>
                </Card>
            </Container>
        );
    }
    
    private setNewFilter(newFilter: any) {
        this.setState(Object.assign(this.state, {
            filter: newFilter,
        }))
    }

    private filterKeywordsChanged(event: React.ChangeEvent<HTMLInputElement>) {
        this.setNewFilter(Object.assign(this.state.filters, {
            keywords: event.target.value,
        }));
    }

    private filterPriceMinChanged(event: React.ChangeEvent<HTMLInputElement>) {
        this.setNewFilter(Object.assign(this.state.filters, {
            priceMinimum: Number(event.target.value),
        }));
    }

    private filterPriceMaxChanged(event: React.ChangeEvent<HTMLInputElement>) {
        this.setNewFilter(Object.assign(this.state.filters, {
            priceMaxium: Number(event.target.value),
        }));
    }

    private filterOrderChanged(event: React.ChangeEvent<HTMLSelectElement>) {
        this.setNewFilter(Object.assign(this.state.filters, {
            order: event.target.value,
        }));
    }

    private filterGenreChanged(event: React.ChangeEvent<HTMLSelectElement>) {
        this.setNewFilter(Object.assign(this.state.filters, {
            genre: event.target.value,
        }));
    }

    private applyFilters() {
        console.log('Trenutni filteri su: ', this.state.filters);
        this.getMovieData();
    }

    private printFilters() {
        return (
            <>
                <Form.Group>
                    <Form.Label htmlFor="keywods">Search keywords:</Form.Label> 
                    <Form.Control type="text" id="keywords" value={ this.state.filters.keywords} 
                        onChange={ (e) => this.filterKeywordsChanged(e as any)}/>
                </Form.Group>
                <Form.Group>
                    <Row>
                        <Col xs="12" sm="6">
                        <Form.Label htmlFor="priceMin">Minimum price:</Form.Label> 
                            <Form.Control type="number" id="priceMin" 
                                step="0.01" min="0.01" max="99999.99"
                                value={this.state.filters.priceMinimum}
                                onChange={ (e) => this.filterPriceMinChanged(e as any)}/>
                        </Col>
                        <Col xs="12" sm="6">
                        <Form.Label htmlFor="priceMax">Maximum price:</Form.Label> 
                            <Form.Control type="number" id="priceMax" 
                                step="0.01" min="0.02" max="100000"
                                value={this.state.filters.priceMaxium}
                                onChange={ (e) => this.filterPriceMaxChanged(e as any)}/>
                        </Col>
                    </Row>
                </Form.Group>
                <Form.Group>
                    <Form.Control as="select" id="sortOrder"
                        value={ this.state.filters.order }
                        onChange={ (e) => this.filterOrderChanged(e as any)}>
                        <option value="name asc">Sort by name - ascending</option>
                        <option value="name desc">Sort by name - descending</option>
                        <option value="price asc">Sort by price - ascending</option>
                        <option value="price desc">Sort by price - descending</option>
                    </Form.Control>
                </Form.Group>

                {/* <Form.Group>
                    <Form.Control as="select" id="genreOrder"
                        value={ this.state.filters.genre }
                        onChange={ (e) => this.filterGenreChanged(e as any)}>
                        <option value="comedy">Sort by comedy</option>
                        <option value="action">Sort by action</option>
                    </Form.Control>
                </Form.Group> */}

                
                <Form.Group>
                    <Button variant="primary" block onClick={() => this.applyFilters() } >
                        <FontAwesomeIcon icon={ faSearch } /> Search
                    </Button>
                </Form.Group>
            </>
        );
    }

    private showMovies() {
        if (this.state.movies?.length === 0) {
            return (
                <div>There are no movie data to show.</div>
            );
        }

        return (
            <Row>
                { this.state.movies?.map(this.singleMovie) }
            </Row>
        )
    }

    private singleMovie(movie: MovieType) {
        return (
            <SingleMoviePreview movie={movie} />
        );
    }

    private printOptionalMessage() {
        if (this.state.message === '') {
            return;
        }
        return (
            <Card.Text>
                { this.state.message }
            </Card.Text>
        );
    }

    componentWillMount() {
        this.getMovieData();
    }

    componentWillReceiveProps(newProps: MoviePageProperties) {
        // if (newProps.match.params.mId === this.props.match.params.mId) {
        //     return;
        // }

        this.getMovieData();
    }

    private setLogginState(isLoggedIn: boolean) {
        this.setState(Object.assign(this.state, {
            isUserLoggedIn: isLoggedIn,
        }));
    }

    private setMessage(message: string) {
        this.setState(Object.assign(this.state, {
            message: message,
        }));
    }

    private setMovies(movies: MovieType[]) {
        this.setState(Object.assign(this.state, {
            movies: movies,
        }));
    }

    private getMovieData() {

        const orderParts = this.state.filters.order.split(' ');
        const orderBy = orderParts[0];
        const orderDirection = orderParts[1].toUpperCase();

        api('api/movie/search', 'post', {
            keywords: this.state.filters.keywords,
            genre: this.state.filters.genre,
            priceMin: this.state.filters.priceMinimum,
            priceMax: this.state.filters.priceMaxium,
            orderBy: orderBy,
            orderDirection: orderDirection,
        })
        .then((res: ApiResponse) => {
            if (res.status === 'login') {
                return this.setLogginState(false);
            }

            if (res.status === 'error') {
                return this.setMessage('Request error. Please try again.');
            }

            if (res.data.statusCode === 0) {
                this.setMessage('');
                this.setMovies([]);
                return;
            }

            const movies: MovieType[] = res.data.map( (movie: MovieDto) => {
                const object: MovieType = {
                    movieId: movie.movieId,
                    name: movie.name,
                    description: movie.description,
                    genre: movie.genre,
                    year: movie.year,
                    rating: movie.rating,
                    
                    price: 0,
                }

                if (movie.moviePrices !== undefined && movie.moviePrices.length > 0) {
                    object.price = movie.moviePrices[movie.moviePrices.length-1].price;
                }

                return object;
            });

            this.setMovies(movies);
        });
    }
}