import { faBoxOpen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component } from 'react'
import { Button, Card, Container, Modal, Table } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import api, { ApiResponse } from '../../api/api';
import CartType from '../../types/CartType';
import OrderType from '../../types/OrderType';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';

interface OrdersPageState {
    isUserLoggedIn: boolean;
    orders: OrderType[];
    cartVisible: boolean;
    cart?: CartType;

}

interface OrderDto {
    orderId: number;
    createdAt: string;
    status: "paid" | "not paid" | "waiting";
    cart: {
        cartId: number;
        createdAt: string;
        cartMovies: {
            movieId: number;
            quantity: number;
            movie: {
                movieId: number;
                name: string;
                description: string;
                genre: string;
                year: string;
                rating: number;
                moviePrices: {
                    price: number;
                    createdAt: string;
                }[];
            };
        }[],
    };
}

export default class OrdersPage extends Component {
    state: OrdersPageState;

    constructor(props: {} | Readonly<{}>) {
        super(props)
    
        this.state = {
             isUserLoggedIn: true,
             orders: [],
             cartVisible: false,
        }
    }
    
    private setLogginState(isLoggedIn: boolean) {
        const newState = Object.assign(this.state, {
            isUserLoggedIn: isLoggedIn,
        });
    
        this.setState(newState);
    }

    private setOrdersState(orders: OrderType[]) {
        this.setState(Object.assign(this.state, {
            orders: orders,
        }));
    }

    private setCartVisibleState(state: boolean) {
        this.setState(Object.assign(this.state, {
            cartVisible: state,
        }));
    }

    private setCartState(cart: CartType) {
        this.setState(Object.assign(this.state, {
            cart: cart,
        }));
    }

    private hideCart() {
        this.setCartVisibleState(false);
    }

    private showCart() {
        this.setCartVisibleState(true);
    }

    componentDidMount() {
        this.getOrders();
    }

    componentDidUpdate() {
        this.getOrders();
    }

    private getOrders() {
        api('api/user/cart/orders/', 'get', {})
        .then((res: ApiResponse) => {
            if (res.status === 'error' || res.status === 'login') {
                return this.setLogginState(false);
            }

            const data: OrderDto[] = res.data;

            const orders: OrderType[] = data.map(order => ({
                orderId: order.orderId,
                status: order.status,
                createdAt: order.createdAt,
                cart: {
                    cartId: order.cart.cartId,
                    user: null,
                    userId: 0,
                    createdAt: order.cart.createdAt,
                    cartMovies: order.cart.cartMovies.map(cm => ({
                        cartMovieId: 0,
                        movieId: cm.movie.movieId,
                        quantity: cm.quantity,
                        movie: {
                            movieId: cm.movie.movieId,
                            name: cm.movie.name,
                            genre: cm.movie.genre,
                            moviePrices: cm.movie.moviePrices.map(mp => ({
                                    moviePriceId: 0,
                                    createdAt: mp.createdAt,
                                    price: mp.price,
                                }))
                            }
                    }))
                }
            }));

            this.setOrdersState(orders);
        });
    }

    private getLatestPriceBeforeDate(movie: any, latestDate: any) {
        const cartTimestamp = new Date(latestDate).getTime();

        let price = movie.moviePrices[0];


        for (let mp of movie.moviePrices) {
            const moviePriceTimestamp = new Date(mp.createdAt).getTime();

            if (moviePriceTimestamp < cartTimestamp) {
                price = mp;
            } else {
                break;
            }
        }

        return price;
    }

    // Promena da se uzmu cene kada je korpa napravljena
    private calculateSum(): number {
        let sum: number = 0;

        if (!this.state.cart) {
            return sum;
        } else {

            for(const item of this.state.cart?.cartMovies) {
                let price = this.getLatestPriceBeforeDate(item.movie, this.state.cart.createdAt);


                sum += price.price * item.quantity;
            }
        }

        return sum;
    }

    render() {
        if (this.state.isUserLoggedIn === false) {
            return (
                <Redirect to="/user/login" /> 
            );
        }

        const sum = this.calculateSum();

        return (
            <Container>
                <RoledMainMenu role="user" />
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={ faBoxOpen } /> My Orders
                        </Card.Title>
                        
                        <Table hover size="sm">
                                <thead>
                                    <tr>
                                        <th>CreatedAt</th>
                                        <th>Status</th>
                                        <th></th>
                                    </tr>
                                </thead>

                                <tbody>
                                    { this.state.orders.map(this.printOrderRow, this) }
                                </tbody>
                        </Table>
                    </Card.Body>
                </Card>

                <Modal size="lg" centered show={ this.state.cartVisible }
                    onHide={ () => this.hideCart() }>
                    <Modal.Header closeButton>
                        <Modal.Title>Your order content</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Table hover size="sm">
                                <thead>
                                    <tr>
                                        <th>Movie</th>
                                        <th>Genre</th>
                                        <th className="text-right">Quantity</th>
                                        <th className="text-right">Price</th>
                                        <th className="text-right">Total</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    { this.state.cart?.cartMovies.map(item => {
                                        const moviePrice = this.getLatestPriceBeforeDate(item.movie, this.state.cart?.createdAt);
                                        const price = Number(moviePrice.price).toFixed(2);
                                        const total = Number(moviePrice.price * item.quantity).toFixed(2);
                                        
                                        return (
                                            <tr>
                                                <td>{ item.movie.name }</td>
                                                <td>{ item.movie.genre }</td>
                                                <td className="text-right"> { item.quantity }</td>
                                                <td className="text-right">{ price } EUR</td>
                                                <td className="text-right">{ total } EUR</td>
                    
                                            </tr>
                                        );
                                    }, this)}
                                </tbody>

                                <tfoot>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td className="text-right"><strong>Total:</strong></td>
                                        <td className="text-right">{ Number(sum).toFixed(2) } EUR</td>
                                    </tr>
                                </tfoot>
                            </Table>
                        
                        </Modal.Body>
                </Modal>
            </Container>
        )
    }

    private setAndShowCart(cart: CartType) {
        this.setCartState(cart);
        this.showCart();
    }

    private printOrderRow(order: OrderType) {
        return (
            <tr>
                <td>{ order.createdAt }</td>
                <td>{ order.status }</td>
                <td className="text-right">
                    <Button size="sm" block variant="primary"
                        onClick={ () => this.setAndShowCart(order.cart)}>
                            <FontAwesomeIcon icon={ faBoxOpen} />
                        </Button>

                </td>
            </tr>
        )
    }
}


