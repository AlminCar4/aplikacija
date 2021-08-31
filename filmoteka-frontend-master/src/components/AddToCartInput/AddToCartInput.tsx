import React, { Component } from 'react'
import { Button,  Col, Form, Row } from 'react-bootstrap'
import api, { ApiResponse } from '../../api/api';
import MovieType from '../../types/MovieType'

interface AddToCartInputPreviewProperties {
    movie: MovieType,
}

interface AddToCartInputPreviewState {
    quantity: number;
}

export default class AddToCartInput extends Component<AddToCartInputPreviewProperties> {
    state: AddToCartInputPreviewState;
    
    constructor(props: AddToCartInputPreviewProperties | Readonly<AddToCartInputPreviewProperties>) {
        super(props)
    
        this.state = {  
            quantity: 1,
        }
    }

    private quantityChaned(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            quantity: Number(event.target.value),
        });
    }

    private addToCart() {
        const data = {
            movieId: this.props.movie.movieId,
            quantity: this.state.quantity,
        };

        api('api/user/cart/addToCart', 'post', data)
        .then((res: ApiResponse) => {
            if (res.status === 'error' || res.status === 'login') {
                return;
            }

            window.dispatchEvent(new CustomEvent('cart.update'));
        });
    }
    
    render() {
        return (
            <Form.Group>
                <Row>
                    <Col sm="7">
                        <Form.Control type="number" min="1" step="1" value={ this.state.quantity} 
                            onChange={(e) => this.quantityChaned(e as any)}/>
                    </Col>
                    <Col sm="5">
                        <Button block variant="primary"
                            onClick={ () => this.addToCart() }>Buy</Button>
                    </Col>
                </Row>
            </Form.Group>
        )
    }
}

