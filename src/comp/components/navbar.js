import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faGlobeEurope } from '@fortawesome/free-solid-svg-icons';
import { Navbar, Nav, NavDropdown, Form, FormControl, Button, Container } from 'react-bootstrap';
import cookie from 'react-cookies';

import translate from '../functions/translation';

import './style/navbar.sass';

class NavbarC extends Component {
    constructor() {
        super();

        this.state = {
            user_login: '',
            user_login_val: ''
        }
    }

    logout = () => {
        if (cookie.load('user'))
            cookie.remove('user', { path: '/' });
        else if (sessionStorage.getItem('user'))
            sessionStorage.removeItem('user');
    }

    render() {
        if (cookie.load('user') && this.state.user_login_val != cookie.load('user').username.toString()) {
            this.setState({
                user_login: <NavDropdown title={ cookie.load('user').username } className='drpdwn-arrw-rmv'>
                        <NavDropdown.Item onClick={ this.logout }>{ this.props.words.Logout }</NavDropdown.Item>
                    </NavDropdown>,
                user_login_val: cookie.load('user').username.toString()
            });
        } else if (sessionStorage.getItem('user') && this.state.user_login_val != JSON.parse(sessionStorage.getItem('user')).username.toString()) {
            this.setState({ 
                user_login: <NavDropdown title={ JSON.parse(sessionStorage.getItem('user')).username } className='drpdwn-arrw-rmv'>
                        <NavDropdown.Item onClick={ this.logout }>{ this.props.words.Logout }</NavDropdown.Item>
                    </NavDropdown>,
                user_login_val: JSON.parse(sessionStorage.getItem('user')).username.toString()
            });
        } else if (this.state.user_login_val != 'Login') {
            this.setState({ 
                user_login: <Nav.Link onClick={ this.props.loadLoginForm }>{ this.props.words.Login }</Nav.Link>,
                user_login_val: 'Login'
            });
        }
        
        return(
            <Navbar bg='primary' variant='dark'>
                <div className='custom-container'>
                    <Navbar.Brand href='/'>SPTS</Navbar.Brand>
                    <Navbar.Toggle aria-controls='basic-navbar-nav' />
                    <Navbar.Collapse id='basic-navbar-nav'>
                        <Nav className='mr-auto'>
                            <Nav.Link href='/'>{ this.props.words.Home }</Nav.Link>
                            <Nav.Link href='/news'>{ this.props.words.News }</Nav.Link>
                        </Nav>
                        <Nav>
                            { this.state.user_login }
                            <NavDropdown title={ <FontAwesomeIcon icon={ faGlobeEurope } /> } className='drpdwn-arrw-rmv'>
                                <NavDropdown.Item id='eng' onClick={ this.props.updateLanguage }>English (ENG)</NavDropdown.Item>
                                <NavDropdown.Item id='slo' onClick={ this.props.updateLanguage }>Slovenski (SLO)</NavDropdown.Item>
                                <NavDropdown.Item id='deu' onClick={ this.props.updateLanguage }>Deutsch (DEU)</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </div>
            </Navbar>
        );
    }
}

export default NavbarC;