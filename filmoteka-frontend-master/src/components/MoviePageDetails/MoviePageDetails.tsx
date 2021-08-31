import { faVideo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component } from 'react'
import { Card, Col, Container, Row } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import api, { ApiResponse } from '../../api/api';
import AddToCartInput from '../AddToCartInput/AddToCartInput';
import ApiMovieDto from '../dtos/ApiMovieDto';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';

interface MoviePageProperties {
    match: {
        params: {
            mId: number;
        }
    }
}

interface MoviePageState {
    isUserLoggedIn: boolean;
    message: string;
    movie?: ApiMovieDto;
}

export class MoviePageDetails extends Component<MoviePageProperties> {
    state: MoviePageState;

    constructor(props: MoviePageProperties | Readonly<MoviePageProperties>) {
        super(props);

        this.state = {
            isUserLoggedIn: true,
            message: '',
        };
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

    private setMovieData(movieData: ApiMovieDto | undefined) {
        this.setState(Object.assign(this.state, {
            movie: movieData,
        }));
    }

    componentDidMount() {
        this.getMovieData();
    }

    componentWillReceiveProps(newProps: MoviePageProperties) {
        if (newProps.match.params.mId === this.props.match.params.mId) {
            return;
        }

        this.getMovieData();
    }

    getMovieData() {
        api('api/movie/' + this.props.match.params.mId + '/?join=moviePrices', 'get',  {})
        .then((res: ApiResponse) => {
            if (res.status === 'login') {
                return this.setLogginState(false);
            }

            if (res.status === 'error') {
                this.setMovieData(undefined);
                this.setMessage('This movie does not exist.');
                return;
            }

            const data: ApiMovieDto = res.data;

            this.setMessage('');
            this.setMovieData(data);
        });
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
                            { this.state.movie?.name }
                        </Card.Title>
                        { this.printOptionalMessage() }

                        <Row>
                            <Col xs="12" lg="8">
                                <div className="genre"><b>Genre: </b>
                                    { this.state.movie?.genre }
                                </div>
                                <hr />

                                <div className="year"><b>Year: </b> 
                                    { this.state.movie?.year }
                                </div>
                                <hr />
                                <div className="description"><b>Description: </b> 
                                    { this.state.movie?.description }
                                </div>
                                <hr />
                                <div className="rating"><b>Rating: </b> 
                                    { this.state.movie?.rating }
                                </div>
                                <hr />
                            </Col>
                
                            <Col xs="12" lg="4">
                                <Row>
                                    <Col xs="12" className="mb-3">
                                        <img alt="taIta" src="#" />
                                    </Col>

                                </Row>

                                <Row>
                                    <Col xs="12" className="align-center mt-3 mb-3">
                                        <b>
                                        Price: {
                                            Number(this.state.movie?.moviePrices[this.state.movie.moviePrices.length-1].price).toFixed(2) + ' EUR'
                                        } </b>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col xs="12" className="mt-3">
                                        {
                                            this.state.movie ?
                                            (<AddToCartInput movie={ this.state.movie } />) : ''
                                        }
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    renderMovieData(movie: ApiMovieDto) {

    }
}

export default MoviePageDetails;
