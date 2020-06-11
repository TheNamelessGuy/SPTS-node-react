import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import LoadingOverlay from 'react-loading-overlay';

import User from './comp/users_test';
import NavbarC from './comp/components/navbar';
import Login from './comp/pages/login';
import Registration from './comp/pages/registration';
import translate from './comp/functions/translation';
import MessageBox from './comp/components/messagebox';

//import logo from './logo.svg';
import './App.sass';

class App extends Component {
    constructor() {
        super();

        if (sessionStorage.getItem('lang') === null)
            sessionStorage.setItem('lang', 'eng');

        this.loadLoginForm = this.loadLoginForm.bind(this);
        this.loadRegisterForm = this.loadRegisterForm.bind(this);
        this.unloadLoginRegisterForm = this.unloadLoginRegisterForm.bind(this);
        this.updateLanguage = this.updateLanguage.bind(this);
        this.showMessageBox = this.showMessageBox.bind(this);
        this.hideMessageBox = this.hideMessageBox.bind(this);
        
        this.state = {
            lang: '',
            words: {
                Home: '',
                News: '',
                Login: '',
                Firstname: '',
                Lastname: '',
                Age: '',
                Gender: '',
                Email_address: '',
                R_email_address: '',
                Password: '',
                R_password: '',
                Register: '',
                Stay_logged_in: '',
                Register_now: ''

            },
            lor: -1,
            login_register: '',
            messagebox: ''
        }
    }

    componentDidMount() {
        this.updateWords();
    }

    updateWords() {
        let tran_words = translate(sessionStorage.getItem('lang'))

        if (tran_words != '')
            this.setState({
                lang: sessionStorage.getItem('lang'),
                words: tran_words
            });
    }

    updateLanguage = (e) => {
        sessionStorage.setItem('lang', e.target.id);
        this.updateWords();
    }

    loadLoginForm() {
        this.setState({
            lor: 0,
            login_register: <Login loadRegisterForm={ this.loadRegisterForm } unloadLoginRegisterForm={ this.unloadLoginRegisterForm } words={ this.state.words } showMessageBox={ this.showMessageBox } />
        });
    }

    loadRegisterForm() {
        this.setState({
            lor: 1,
            login_register: <Registration unloadLoginRegisterForm={ this.unloadLoginRegisterForm } words={ this.state.words } showMessageBox={ this.showMessageBox } />
        });
    }

    unloadLoginRegisterForm() {
        this.setState({
            lor: -1,
            login_register: ''
        });
    }

    showMessageBox = (message, icon, timeout) => {
        this.setState({
            messagebox: <MessageBox message={ message } icon={ icon } timeout={ timeout } hideMessageBox={ this.hideMessageBox } />
        });
    }

    hideMessageBox() {
        this.setState({
            messagebox: ''
        });
    }

    render() {
        return(
            <div className="App">
                { this.state.messagebox }
                { this.state.login_register }
                <Router>
                    <NavbarC loadLoginForm={ this.loadLoginForm } updateLanguage={ this.updateLanguage } words={ this.state.words } />
                    <Route path='/users'>
                        <User />
                    </Route>
                </Router>
            </div>
        );
    }
}

export default App;