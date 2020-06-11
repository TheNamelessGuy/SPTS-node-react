import React, { Component } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import striptags from 'striptags';

import './style/registration.sass';

class Registration extends Component {
    constructor() {
        super();

        this.state = {
            form_val: {
                firstname: '',
                lastname: '',
                password: '',
                r_password: '',
                email: '',
                r_email: '',
                age: '',
                gender: ''
            },
            response: ''
        }
    }

    checkInsertedValues = () => {
        let register = true;
        let inputs = this.state.form_val;
        
        for (let [key, val] of Object.entries(inputs)) {
            inputs[key] = striptags(val.trim());
            if (inputs[key] === '' || inputs[key] === null)
                register = false;
        }

        if (inputs.email !== inputs.r_email)
            register = false;
        else if (inputs.password !== inputs.r_password)
            register = false;

        if (register)
            this.register();
        else
            this.setState(inputs);
    }

    register() {
        let new_user = {
            firstname: this.state.form_val.firstname,
            lastname: this.state.form_val.lastname,
            username: `${ this.state.form_val.firstname } ${ this.state.form_val.lastname }`,
            email: this.state.form_val.email,
            password: this.state.form_val.password,
            age: this.state.form_val.age,
            gender: this.state.form_val.gender
        }

        fetch(`/spts_user/add/${ JSON.stringify(new_user) }`)
            .then(res => res.json())
            .then(data => this.setState({ response: data.response }, () => {
                if (this.state.response === 'true') {
                    this.props.showMessageBox('Successfully created user! First you must enable your account though the email we sent you.', 'success', 6500);
                    setTimeout(() => this.props.unloadLoginRegisterForm(), 6600);
                }
            }));
    }

    handleFirstnameChange = (e) => this.setState({ form_val: { ...this.state.form_val, firstname: striptags(e.target.value.trim()) } })
    handleLastnameChange = (e) => this.setState({ form_val: { ...this.state.form_val, lastname: striptags(e.target.value.trim()) } })
    handleAgeChange = (e) => this.setState({ form_val: { ...this.state.form_val, age: striptags(e.target.value.trim()) } })
    handleGenderChange = (e) => this.setState({ form_val: { ...this.state.form_val, gender: striptags(e.target.value.trim()) } })
    handleEmailChange = (e) => this.setState({ form_val: { ...this.state.form_val, email: striptags(e.target.value.trim()) } })
    handleREmailChange = (e) => this.setState({ form_val: { ...this.state.form_val, r_email: striptags(e.target.value.trim()) } })
    handlePasswordChange = (e) => this.setState({ form_val: { ...this.state.form_val, password: striptags(e.target.value.trim()) } })
    handleRPasswordChange = (e) => this.setState({ form_val: { ...this.state.form_val, r_password: striptags(e.target.value.trim()) } })

    render() {
        return(
            <div className='f-w-container'>
                <div className='f-w-backblur' onClick={ this.props.unloadLoginRegisterForm } />
                <Form id='Register'>
                    <Row>
                        <Col>
                            <Form.Group controlId='firstname'>
                                <Form.Label>{ this.props.words.Firstname }</Form.Label>
                                <Form.Control type='text' placeholder='John / Jane' value={ this.state.form_val.firstname } onChange={ this.handleFirstnameChange } required />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId='lastname'>
                                <Form.Label>{ this.props.words.Lastname }</Form.Label>
                                <Form.Control type='text' placeholder='Doe' value={ this.state.form_val.lastname } onChange={ this.handleLastnameChange } required />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Row>
                                <Col>
                                    <Form.Group controlId='age'>
                                        <Form.Label>{ this.props.words.Age }</Form.Label>
                                        <Form.Control type='number' placeholder='20' value={ this.state.form_val.age } onChange={ this.handleAgeChange } required />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId='gender'>
                                        <Form.Label>{ this.props.words.Gender }</Form.Label>
                                        <Form.Control as="select" value={ this.state.form_val.gender } onChange={ this.handleGenderChange } >
                                            <option>Neutral</option>
                                            <option>Male</option>
                                            <option>Female</option>
                                            <option>IT</option>
                                            <option>Toaster</option>
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group controlId='email'>
                                <Form.Label>{ this.props.words.Email_address }</Form.Label>
                                <Form.Control type='email' placeholder='john/jane.doe@gmail.com' value={ this.state.form_val.email } onChange={ this.handleEmailChange } required />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId='r_email'>
                                <Form.Label>{ this.props.words.R_email_address }</Form.Label>
                                <Form.Control type='email' placeholder='john/jane.doe@gmail.com' value={ this.state.form_val.r_email } onChange={ this.handleREmailChange } required />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group controlId='password'>
                                <Form.Label>{ this.props.words.Password }</Form.Label>
                                <Form.Control type='password' placeholder='j0hNDo3a6e2o' value={ this.state.form_val.password } onChange={ this.handlePasswordChange } required />
                                <Form.Text>The password should be at least 8 caractors long</Form.Text>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId='r_password'>
                                <Form.Label>{ this.props.words.R_password }</Form.Label>
                                <Form.Control type='password' placeholder='j0hNDo3a6e2o' value={ this.state.form_val.r_password } onChange={ this.handleRPasswordChange } required />
                            </Form.Group>
                        </Col>
                    </Row>
                    <br/>
                    <Button variant='primary' onClick={ this.checkInsertedValues }>{ this.props.words.Register }</Button>
                </Form>
            </div>
        );
    }
}

export default Registration;