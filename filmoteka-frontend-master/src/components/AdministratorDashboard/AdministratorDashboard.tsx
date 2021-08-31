import React from 'react';
import { Card, Container} from 'react-bootstrap';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, Redirect } from 'react-router-dom';
import api, { ApiResponse } from '../../api/api';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';


interface AdministratorDashboardState {
    isAdministratorLoggedIn: boolean;
}

class AdministratorDashboard extends React.Component {
    state: AdministratorDashboardState;

    constructor(props: {} | Readonly<{}>) {
        super(props)
    
        this.state = {
            isAdministratorLoggedIn: true,
        };

    }

    componentWillMount() {
        this.getMyData();
    }

    componentWillUpdate() {
        this.getMyData();
    }

    private getMyData() {
        // const username = getIdentity('administrator'); // ovo
        api('api/administrator/', 'get', {}, 'administrator')
        .then((res: ApiResponse) => {
            if (res.status === 'error' || res.status === 'login') {
                this.setLogginState(false);
                return;
            }
        });
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
                            <FontAwesomeIcon icon={ faHome } /> AdministratorDashboard
                        </Card.Title>
                        <ul>
                             <li><Link to="/administrator/dashboard/movies/">Movies</Link></li>
                            <li><Link to="/administrator/dashboard/order/">Orders</Link></li>
                        </ul>
                    </Card.Body>
                </Card>
            </Container>
        );
    }
}

export default AdministratorDashboard;
