import React from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MovieType from '../../types/MovieType';
import { Link, Redirect } from 'react-router-dom';
import api, { ApiResponse } from '../../api/api';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';

interface HomePageState {
    isUserLoggedIn: boolean;
    movies: MovieType[];
}

interface ApiMovieDto {
    movieId: number;
    name: string;
}

class HomePage extends React.Component {
    state: HomePageState;

    constructor(props: {} | Readonly<{}>) {
        super(props)
    
        this.state = {
             isUserLoggedIn: true,
             movies: [],
        };

    }

    componentWillMount() {
        this.getMovies();
    }

    componentWillUpdate() {
        this.getMovies();
    }

    private getMovies() {
        api('api/movie/', 'get', {})
            .then((res: ApiResponse) => {
                if (res.status === 'error' || res.status === 'login') {
                    this.setLogginState(false);
                    return;
                }

                this.putMoviesInState(res.data);
            });
    }

    private putMoviesInState(data: ApiMovieDto[]) {
        const movies: MovieType[] = data.map(movie => {
            return {
                movieId: movie.movieId,
                name: movie.name,
            };
        });

        const newState = Object.assign(this.state, {
            movies: movies,
        });

        this.setState(newState);
    }

    private setLogginState(isLoggedIn: boolean) {
        const newState = Object.assign(this.state, {
            isUserLoggedIn: isLoggedIn,
        });

        this.setState(newState);
    }
    
    render () {
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
                            <FontAwesomeIcon icon={ faHome } /> HomePage
                        </Card.Title>
                        
                        <Row>
                            { this.state.movies.map(this.showSingleMovie)}
                        </Row>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    private showSingleMovie(movie: MovieType) {
        return (
            <Col lg="3" md="4" sm="6" xs="12">
                <Card className="mb-3">
                    <Card.Img variant="top"/>
                    <Card.Body>
                        <Card.Title>
                            { movie.name }
                        </Card.Title>
                        <Card.Text>
                            { movie.description }
                        </Card.Text>
                        <Link to={`/movie/${ movie.movieId }`} className="btn btn-primary btn-block btn-md">
                            Open movie
                        </Link>
                    </Card.Body>
                </Card>
            </Col>
        );
    }
}

export default HomePage;
