import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import cookie from 'react-cookies';

import './style/login.sass';

class Login extends Component {
    constructor() {
        super();

        this.state = {
            form_val: {
                email: '',
                password: '',
                sli: false
            },
            response: '',
        }
    }

    login = () => {
        if (this.state.form_val.email !== '' && this.state.form_val.password !== '') {
            let user = {
                fetch: 'filtered',
                email: this.state.form_val.email
            }
    
            fetch(`/spts_user/get/${ JSON.stringify(user) }`)
                .then(res => res.json())
                .then(data => this.setState({ response: data.response }, () => {
                    if (this.state.response != 'null' && this.state.response != 'false')
                        user = {
                            email: this.state.form_val.email,
                            password: this.state.form_val.password
                        }

                        fetch(`/spts_user/check/${ JSON.stringify(user) }`)
                            .then(res => res.json())
                            .then(data => this.setState({ response: data.response }, () => {
                                if (this.state.response == 'true') {
                                    user = {
                                        fetch: ['email', 'username'],
                                        email: this.state.form_val.email
                                    }

                                    fetch(`/spts_user/get/${ JSON.stringify(user) }`)
                                        .then(res => res.json())
                                        .then(data => this.setState({ response: data.response[0] }, () => {
                                            if (this.state.form_val.sli) {
                                                if (cookie.load('user'))
                                                    cookie.remove('user', { path: '/' });
                                                
                                                cookie.save('user', JSON.stringify(this.state.response), { path: '/', maxAge: 604800 });
                                            } else {
                                                sessionStorage.setItem('user', JSON.stringify(this.state.response));
                                            }

                                            this.props.showMessageBox('Successfully logged in.', 'success', 3000);
                                            setTimeout(() => this.props.unloadLoginRegisterForm(), 3100);
                                        }));
                                }
                            }));
                }));
        }
    }

    handleEmailChange = (e) => this.setState({ form_val: { ...this.state.form_val, email: e.target.value } });
    handlePasswordChange = (e) => this.setState({ form_val: { ...this.state.form_val, password: e.target.value } });
    handleSLIChange = (e) => {
        if (e.target.checked)
            this.setState({ form_val: { ...this.state.form_val, sli: true } });
        else
            this.setState({ form_val: { ...this.state.form_val, sli: false } });
    }

    render() {
        return(
            <div className='f-w-container'>
                <div className='f-w-backblur' onClick={ this.props.unloadLoginRegisterForm } />
                <Form id='Login'>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>{ this.props.words.Email_address }</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" value={ this.state.form_val.email } onChange={ this.handleEmailChange } />
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>{ this.props.words.Password }</Form.Label>
                        <Form.Control type="password" placeholder="Password" value={ this.state.form_val.password } onChange={ this.handlePasswordChange } />
                    </Form.Group>
                    <Form.Group controlId="formBasicCheckbox">
                        <Form.Check type="checkbox" label={ this.props.words.Stay_logged_in } onChange={ this.handleSLIChange } />
                    </Form.Group>
                    <small id='RegisterLink' onClick={ this.props.loadRegisterForm } >{ this.props.words.Register_now }</small>
                    <Button variant="primary" onClick={ this.login }>{ this.props.words.Login }</Button>
                </Form>
            </div>
        );
    }
}

export default Login;