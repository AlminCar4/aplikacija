import { faBoxOpen, faCartArrowDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component } from 'react'
import { Button, Card, Container, Modal, Tab, Table, Tabs } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import api, { ApiResponse } from '../../api/api';
import CartType from '../../types/CartType';
import OrderType from '../../types/OrderType';
import ApiOrderDto from '../dtos/ApiOrderDto';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';

interface AdministratorDashboardOrderState {
    isAdministratorLoggedIn: boolean;
    cartVisible: boolean;
    orders: ApiOrderDto[];
    cart?: CartType;
}

export class AdministratorDashboardOrder extends Component {
    state: AdministratorDashboardOrderState;

    constructor(props: {} | Readonly<{}>) {
        super(props)
    
        this.state = {
            isAdministratorLoggedIn: true,
            cartVisible: false,
            orders: [],
        }
    }
    
    private setOrders(orders: ApiOrderDto[]) {
        this.setState(Object.assign(this.state, {
            orders: orders,
        }));
    }

    private setLogginState(isLoggedIn: boolean) {
        this.setState(Object.assign(this.state, {
            isAdministratorLoggedIn: isLoggedIn,
        }));
    }

    reloadOrders() {
        api('api/order/', 'get', {}, 'administrator')
        .then((res: ApiResponse) => {
            if (res.status === 'login' || res.status === 'error') {
                this.setLogginState(false);
                return;
            }

            const data: ApiOrderDto[] = res.data;

            this.setOrders(data);
        });
    }

    componentDidMount() {
        this.reloadOrders();
    }

    changeStatus(orderId: number, newStatus: "waiting" | "not paid" | "paid" ) {
        api('api/order/' + orderId, 'patch', { newStatus }, 'administrator')
        .then((res: ApiResponse) => {
            if (res.status === 'login' || res.status === 'error') {
                this.setLogginState(false);
                return;
            }

            this.reloadOrders();
        });
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

    private setAndShowCart(cart: CartType) {
        this.setCartState(cart);
        this.showCart();
    }

    renderOrders(withStatus: "waiting" | "not paid" | "paid") {
        return(
            <Table hover size="sm" bordered>
                <thead>
                    <tr>
                        <th className="text-right pr-2">Order ID</th>
                        <th>Date</th>
                        <th>Cart</th>
                        <th>Options</th>
                    </tr>
                </thead>
                <tbody>
                    { this.state.orders.filter(order => order.status === withStatus).map(order => (
                        <tr>
                            <td className="text-right pr-2">{ order.orderId }</td>
                            <td>{ order.createdAt.substring(0, 10) }</td>
                            <td>
                                <Button size="sm" block variant="primary"
                                onClick={ () => this.setAndShowCart(order.cart)}>
                                <FontAwesomeIcon icon={ faBoxOpen } />
                                </Button>
                            </td>
                            <td>
                                { this.printStatusChangeButtons(order) }
                            </td>
                        </tr>    
                    ), this) }
                </tbody>
            </Table>
        );
    }

    render() {
        if (this.state.isAdministratorLoggedIn === false) {
            return (
                <Redirect to="/administrator/login" /> 
            );
        }

        const sum = this.calculateSum();

        return (
            <Container>
                <RoledMainMenu role="administrator" />
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={ faCartArrowDown } /> Orders
                        </Card.Title>

                        <Tabs defaultActiveKey="waiting" id="order-tabs" className="ml-0 mb-0">
                            <Tab eventKey="waiting" title="Waiting">
                                { this.renderOrders("waiting")}
                            </Tab>

                            <Tab eventKey="paid" title="Paid">
                                { this.renderOrders("paid")}
                            </Tab>

                            <Tab eventKey="notPaid" title="Not Paid">
                                { this.renderOrders("not paid")}
                            </Tab>
                        </Tabs>
                    </Card.Body>
                </Card>

                <Modal size="lg" centered show={ this.state.cartVisible }
                    onHide={ () => this.hideCart() }>
                    <Modal.Header closeButton>
                        <Modal.Title>Order content</Modal.Title>
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

    printStatusChangeButtons(order: OrderType) {
        if (order.status === 'waiting') {
            return (
                <>
                    <Button type="button" variant="primary" className="mr-1" size="sm"
                        onClick={ () => this.changeStatus(order.orderId, 'paid') }>Paid</Button>
                    <Button type="button" variant="danger" size="sm"
                         onClick={ () => this.changeStatus(order.orderId, 'not paid') }>Not paid</Button>
                </>
            );
        }

        if (order.status === 'paid') {
            return (
                <>
                    <Button type="button" variant="danger" className="mr-1" size="sm"
                         onClick={ () => this.changeStatus(order.orderId, 'paid') }>Not paid</Button>
                    <Button type="button" variant="secondary" size="sm"
                        onClick={ () => this.changeStatus(order.orderId, 'waiting') }>Waiting</Button>
                </>
            );
        }

        if (order.status === 'not paid') {
            return (
                <>
                    <Button type="button" variant="primary" className="mr-1" size="sm"
                         onClick={ () => this.changeStatus(order.orderId, 'paid') }>Paid</Button>
                    <Button type="button" variant="secondary" size="sm"
                         onClick={ () => this.changeStatus(order.orderId, 'waiting') }>Waiting</Button>
                </>
            );
        }
    }
}

export default AdministratorDashboardOrder;
