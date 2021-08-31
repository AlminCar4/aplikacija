import React from 'react';
import { Alert, Button, Card, Container, Form, Modal, Table} from 'react-bootstrap';
import { faEdit, faList, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Redirect } from 'react-router-dom';
import MovieType from '../../../types/MovieType';
import api, { ApiResponse } from '../../../api/api';
import ApiMovieDto from '../../dtos/ApiMovieDto';
import RoledMainMenu from '../../RoledMainMenu/RoledMainMenu';


interface AdministratorDashboardMovieState {
    isAdministratorLoggedIn: boolean;
    movies: MovieType[];

    addModal: {
        visible: boolean;
        name: string;
        genre: string;
        description: string;
        year: string;
        rating: number;
        price: number;
        message: string;
    };

    editModal: {
        visible: boolean;
        movieId: number;
        name: string;
        genre: string;
        description: string;
        year: string;
        rating: number;
        price: number;
        message: string;
    }
}

class AdministratorDashboardMovie extends React.Component {
    state: AdministratorDashboardMovieState;

    constructor(props: {} | Readonly<{}>) {
        super(props)
    
        this.state = {
            isAdministratorLoggedIn: true,
            movies: [],

            addModal: {
                visible: false,
                name: '',
                genre: '',
                description: '',
                year: '',
                rating: 0.01,
                price: 0.01,
                message: '',
            },

            editModal: {
                visible: false,
                movieId: 0,
                name: '',
                genre: '',
                description: '',
                year: '',
                rating: 0.01,
                price: 0.01,
                message: '',
            }
        };

    }

    private setAddModalVisibleState(newState: boolean) {
        this.setState(Object.assign(this.state, 
            Object.assign(this.state.addModal, {
                visible: newState
            })
        ));
    }

    private setAddModalStringFieldState(fieldName: string, newValue: string) {
        this.setState(Object.assign(this.state, 
            Object.assign(this.state.addModal, {
                [ fieldName ]: newValue,
            })
        ));
    }

    private setAddModalNumberFieldState(fieldName: string, newValue: any) {
        this.setState(Object.assign(this.state, 
            Object.assign(this.state.addModal, {
                [ fieldName ]: (newValue === 'null') ? null : Number(newValue),
            })
        ));
    }

    private setEditModalVisibleState(newState: boolean) {
        this.setState(Object.assign(this.state, 
            Object.assign(this.state.editModal, {
                visible: newState
            })
        ));
    }

    private setEditModalStringFieldState(fieldName: string, newValue: string) {
        this.setState(Object.assign(this.state, 
            Object.assign(this.state.editModal, {
                [ fieldName ]: newValue,
            })
        ));
    }

    private setEditModalNumberFieldState(fieldName: string, newValue: any) {
        this.setState(Object.assign(this.state, 
            Object.assign(this.state.editModal, {
                [ fieldName ]: (newValue === 'null') ? null : Number(newValue),
            })
        ));
    }

    componentDidMount() {
        this.getMovies();
    }

    // componentWillUpdate() {
    //     this.getMovies();
    // }

    private getMovies() {
        // const username = getIdentity('administrator'); // ovo
        api('api/movie/?join=moviePrices', 'get', {}, 'administrator')
        .then((res: ApiResponse) => {
            if (res.status === 'error' || res.status === 'login') {
                this.setLogginState(false);
                return;
            }

            this.putMoviesInState(res.data);
        });
    }

    private putMoviesInState(data?: ApiMovieDto[]) {
        const movies: MovieType[] | undefined = data?.map(movie => {
            return {
                movieId: movie.movieId,
                name: movie.name,
                genre: movie.genre,
                description: movie.description,
                year: movie.year,
                rating: movie.rating,
                price: movie.moviePrices[movie.moviePrices.length-1].price,
                moviePrices: movie.moviePrices,
            }
        });

        const newState = Object.assign(this.state, {
            movies: movies,
        });

        this.setState(newState);
    }

    private setLogginState(isLoggedIn: boolean) {
        this.setState(Object.assign(this.state, {
            isAdministratorLoggedIn: isLoggedIn,
        }));
    }
    
    render () {
        if (this.state.isAdministratorLoggedIn === false) {
            return (
                <Redirect to="/administrator/login" /> 
            );
        }

        return (
            <Container>
                <RoledMainMenu role="administrator" />
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={ faList } /> AdministratorDashboardMovie
                        </Card.Title>
                        
                        <Table hover size="sm" bordered>
                            <thead>
                                <tr>
                                    <th colSpan= { 6 }></th>
                                    <th className="text-center">
                                        <Button variant="primary" size="sm"
                                            onClick={() => this.showAddModal()}>
                                            <FontAwesomeIcon icon={ faPlus } /> Add
                                        </Button>
                                    </th>
                                </tr>
                                <tr>
                                    <th className="text-right">ID</th>
                                    <th>Name</th>
                                    <th>Genre</th>
                                    <th>Year</th>
                                    <th>Rating</th>
                                    <th className="text-right">Price</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.movies.map(movie => (
                                    <tr>
                                        <td className="text-right">{ movie.movieId }</td>
                                        <td>{ movie.name }</td>
                                        <td>{ movie.genre }</td>
                                        <td className="text-right">{ movie.year }</td>
                                        <td className="text-center">{ movie.rating }</td>
                                        <td className="text-right">{ movie.price }</td>
                                        <td className="text-center">
                                            <Button variant="info" size="sm"
                                                onClick={ () => this.showEditModal(movie) }>
                                                <FontAwesomeIcon icon={ faEdit } /> Edit
                                            </Button>
                                        </td>
                                    </tr>
                                ), this)}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>

                <Modal size="lg" centered show={ this.state.addModal.visible }
                    onHide={ () => this.setAddModalVisibleState(false) }>
                    <Modal.Header closeButton>
                        <Modal.Title>Add movie</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form.Group>
                                <Form.Label htmlFor="name">Name</Form.Label>
                                <Form.Control id="name" type="text" value={ this.state.addModal.name } 
                                    onChange={ (e) => this.setAddModalStringFieldState('name', e.target.value)}/>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label htmlFor="genre">Genre</Form.Label>
                                <Form.Control id="genre" type="text" value={ this.state.addModal.genre } 
                                    onChange={ (e) => this.setAddModalStringFieldState('genre', e.target.value)}/>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label htmlFor="description">Description</Form.Label>
                                <Form.Control id="description" as="textarea" value={ this.state.addModal.description } 
                                    onChange={ (e) => this.setAddModalStringFieldState('description', e.target.value)} 
                                    rows={10} />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label htmlFor="year">Year</Form.Label>
                                <Form.Control id="year" type="text" value={ this.state.addModal.year } 
                                    onChange={ (e) => this.setAddModalStringFieldState('year', e.target.value)}/>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label htmlFor="rating">Rating</Form.Label>
                                <Form.Control id="rating" type="number" value={ this.state.addModal.rating } 
                                    onChange={ (e) => this.setAddModalNumberFieldState('rating', e.target.value)}/>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label htmlFor="price">Price</Form.Label>
                                <Form.Control id="price" type="number" min={ 0.01 } step={ 0.01 }value={ this.state.addModal.price } 
                                    onChange={ (e) => this.setAddModalNumberFieldState('price', e.target.value)}/>
                            </Form.Group>
                            <Form.Group>
                                <Button variant="primary" onClick={() => this.doAddMovie()}>
                                    <FontAwesomeIcon icon={ faPlus} /> Add new movie
                                </Button>
                            </Form.Group>
                            { this.state.addModal.message ? (
                                <Alert variant="danger" value={ this.state.addModal.message } />
                            ) : ''}
                        </Modal.Body>
                </Modal>

                <Modal size="lg" centered show={ this.state.editModal.visible }
                    onHide={ () => this.setEditModalVisibleState(false) }>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit movie</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form.Group>
                                <Form.Label htmlFor="edit-name">Name</Form.Label>
                                <Form.Control id="edit-name" type="text" value={ this.state.editModal.name } 
                                    onChange={ (e) => this.setEditModalStringFieldState('name', e.target.value)}/>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label htmlFor="edit-genre">Genre</Form.Label>
                                <Form.Control id="edit-genre" type="text" value={ this.state.editModal.genre } 
                                    onChange={ (e) => this.setEditModalStringFieldState('genre', e.target.value)}/>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label htmlFor="edit-description">Description</Form.Label>
                                <Form.Control id="edit-description" as="textarea" value={ this.state.editModal.description } 
                                    onChange={ (e) => this.setEditModalStringFieldState('description', e.target.value)} 
                                    rows={10} />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label htmlFor="edit-year">Year</Form.Label>
                                <Form.Control id="edit-year" type="text" value={ this.state.editModal.year } 
                                    onChange={ (e) => this.setEditModalStringFieldState('year', e.target.value)}/>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label htmlFor="edit-rating">Rating</Form.Label>
                                <Form.Control id="edit-rating" type="number" value={ this.state.editModal.rating } 
                                    onChange={ (e) => this.setEditModalNumberFieldState('rating', e.target.value)}/>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label htmlFor="edit-price">Price</Form.Label>
                                <Form.Control id="edit-price" type="number" min={ 0.01 } step={ 0.01 }value={ this.state.editModal.price } 
                                    onChange={ (e) => this.setEditModalNumberFieldState('price', e.target.value)}/>
                            </Form.Group>

                            <Form.Group>
                                <Button variant="primary" onClick={() => this.doEditMovie()}>
                                    <FontAwesomeIcon icon={ faEdit } /> Edit movie
                                </Button>
                            </Form.Group>
                            { this.state.editModal.message ? (
                                <Alert variant="danger" value={ this.state.editModal.message } />
                            ) : ''}
                        </Modal.Body>
                </Modal>
            </Container>
        );
    }

    private showAddModal() {
        this.setAddModalStringFieldState('name', '');
        this.setAddModalStringFieldState('genre', '');
        this.setAddModalStringFieldState('description', '');
        this.setAddModalStringFieldState('year', '');
        this.setAddModalNumberFieldState('rating', 0);
        this.setAddModalNumberFieldState('price', 0);
        this.setAddModalStringFieldState('message', '');
        this.setAddModalVisibleState(true);
    }

    private showEditModal(movie: MovieType) {
        this.setEditModalNumberFieldState('movieId', movie.movieId);
        this.setEditModalStringFieldState('name', String(movie.name));
        this.setEditModalStringFieldState('genre', String(movie.genre));
        this.setEditModalStringFieldState('description', String(movie.description));
        this.setEditModalStringFieldState('year', String(movie.year));
        this.setEditModalNumberFieldState('rating', movie.rating);
        this.setEditModalNumberFieldState('price', movie.price);
        this.setEditModalStringFieldState('message', '');
        this.setEditModalVisibleState(true);
    }

    private doAddMovie() {
        api('api/movie/createFull', 'post', {
            name: this.state.addModal.name,
            genre: this.state.addModal.genre,
            description: this.state.addModal.description,
            year: this.state.addModal.year,
            rating: this.state.addModal.rating,
            price: this.state.addModal.price,
        }, 'administrator')
        .then((res: ApiResponse) => {
            if (res.status === 'login') {
                this.setLogginState(false);
                return;
            }

            if (res.status === 'error') {
                this.setAddModalStringFieldState('message', JSON.stringify(res.data));
            }

            this.setAddModalVisibleState(false);
            this.getMovies();
        });
    }

    private doEditMovie() {
        api('api/movie/'  + this.state.editModal.movieId, 'patch', {
            name: this.state.editModal.name,
            genre: this.state.editModal.genre,
            description: this.state.editModal.description,
            year: this.state.editModal.year,
            rating: this.state.editModal.rating,
            price: this.state.editModal.price,
        }, 'administrator')
        .then((res: ApiResponse) => {
            if (res.status === 'login') {
                this.setLogginState(false);
                return;
            }

            if (res.status === 'error') {
                this.setEditModalStringFieldState('message', JSON.stringify(res.data));
            }

            this.setEditModalVisibleState(false);
            this.getMovies();
        });
    }
}

export default AdministratorDashboardMovie;
