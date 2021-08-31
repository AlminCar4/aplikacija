import React, { Component } from 'react'
import {  Card, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import MovieType from '../../types/MovieType';


import AddToCartInput from '../AddToCartInput/AddToCartInput';

interface SingleMoviePreviewProperties {
    movie: MovieType,
}

export default class SingleMoviePreview extends Component<SingleMoviePreviewProperties> {
    
    
    constructor(props: SingleMoviePreviewProperties | Readonly<SingleMoviePreviewProperties>) {
        super(props)
    }

    
    render() {
        return (
            <Col lg="4" md="4" sm="6" xs="12">
                <Card className="mb-3">
                    <Card.Img>

                    </Card.Img>
                    <Card.Body>
                        <Card.Title as="p">
                            { this.props.movie.name }
                        </Card.Title>
                        <Card.Text as="p">
                            { this.props.movie.description }
                        </Card.Text>
                        <Card.Text>
                           Price: { Number(this.props.movie.price).toFixed(2) } EUR
                        </Card.Text>
                        
                        <AddToCartInput movie={ this.props.movie } />

                        <Link to={ `/movie/${ this.props.movie.movieId}`} className="btn btn-primary btn-block btn-sm">
                            Open movie page
                        </Link>
                    </Card.Body>
                </Card>
            </Col>
        )
    }
}

