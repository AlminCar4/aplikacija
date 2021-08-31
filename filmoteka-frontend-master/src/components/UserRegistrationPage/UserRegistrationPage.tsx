import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Component } from "react";
import { Alert, Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import api, { ApiResponse } from "../../api/api";
import RoledMainMenu from "../RoledMainMenu/RoledMainMenu";

interface UserRegistrationPageState {
    formData: {
        email: string;
        username: string;
        password: string;
        forename: string;
        surname: string;
    };
    
    message?: string;
    
    isRegistrationComplete: boolean;
}

export class UserRegistrationPage extends Component {
    state: UserRegistrationPageState;

    constructor(props: {} | Readonly<{}>) {
        super(props);

        this.state = {
            isRegistrationComplete: false,
            formData: {
                email:    '',
                username: '',
                password: '',
                forename: '',
                surname:  '',
            }
        }
    }

    render() {
        return (
            <Container>
            <RoledMainMenu role="visitor" />
            <Col md={ { span: 8, offset: 2 } } className="mt-3">
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={ faUserPlus } />User Registration
                        </Card.Title>
                            {
                                (this.state.isRegistrationComplete === false) ?
                                    this.renderForm() :
                                    this.renderRegistrationCompleteMessage()
                            }
                    </Card.Body>
                </Card>
            </Col>
        </Container>
        );
    }

    private formInputChanged(event: React.ChangeEvent<HTMLInputElement>) {
        const newFormData = Object.assign(this.state.formData, {
            [ event.target.id ]: event.target.value,
        });
       
        const newState = Object.assign(this.state, {
            formData: newFormData,
        });
        
        this.setState(newState);
    }

    private renderForm() {
        return (
            <>
                <Form>
                    <Form.Group>
                        <Form.Label htmlFor="username">Username:</Form.Label>
                        <Form.Control type="text" id="username" 
                            value={ this.state.formData.username }
                            onChange={ event => this.formInputChanged(event as any) } />
                    </Form.Group>
                    <Row>
                        <Col md="6">
                            <Form.Group>
                                <Form.Label htmlFor="email">E-mail:</Form.Label>
                                <Form.Control type="email" id="email" 
                                    value={ this.state.formData.email }
                                    onChange={ event => this.formInputChanged(event as any) } />
                            </Form.Group>
                        </Col>
                        <Col md="6">
                            <Form.Group>
                                <Form.Label htmlFor="password">Password:</Form.Label>
                                <Form.Control type="password" id="password" 
                                    value={ this.state.formData.password }
                                    onChange={ event => this.formInputChanged(event as any) } />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md="6">
                            <Form.Group>
                                <Form.Label htmlFor="surname">Surname:</Form.Label>
                                <Form.Control type="text" id="surname" 
                                    value={ this.state.formData.surname }
                                    onChange={ event => this.formInputChanged(event as any) } />
                            </Form.Group>
                        </Col>
                        <Col md="6">
                            <Form.Group>
                                <Form.Label htmlFor="forename">Forename:</Form.Label>
                                <Form.Control type="text" id="forename" 
                                    value={ this.state.formData.forename }
                                    onChange={ event => this.formInputChanged(event as any) } />
                            </Form.Group>
                        </Col>
                    </Row>

                    
                    <Form.Group>
                        <Button variant="primary"
                            onClick={ () => this.doRegister() }>
                        Log in</Button>
                    </Form.Group>
                </Form>
                <Alert variant="danger" 
                    className={ this.state.message ? '' : 'd-none'}>
                    { this.state.message }
                </Alert>
            </>
        );
    }

    private renderRegistrationCompleteMessage() {
        return (
            <p>
                The account has been registered. <br />
                <Link to="/user/login" replace>Click here</Link> to go to the login page.
            </p>
        );
    }

    private doRegister() {
        const data = {
            username: this.state.formData.username,
            email: this.state.formData.email,
            password: this.state.formData.password,
            forename: this.state.formData.forename,
            surname: this.state.formData.surname,
        };

        api('auth/user/register/', 'post', data)
            .then((res: ApiResponse) => {
                console.log(res);
                if (res.status === 'error') {
                    this.setErrorMessage('System error...Try again.');
                    return;
                }

                if (res.data.statusCode !== undefined) {
                    this.handleErrors(res.data);
                    return;
                }

                this.registrationComplete();
            })
    }

    private setErrorMessage(message: string) {
        const newState = Object.assign(this.state, {
            message: message,
        });

        this.setState(newState);
    }

    private handleErrors(data: any) {
        let message = '';

        switch (data.statusCode) {
            case -6001: message = 'This account already exists!'; break;
        }

        this.setErrorMessage(message);
    }
    
    private registrationComplete() {
        const newState = Object.assign(this.state, {
            isRegistrationComplete: true,
        });

        this.setState(newState);
    }
}