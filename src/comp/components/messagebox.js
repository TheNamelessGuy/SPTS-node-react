import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

import './style/messagebox.sass';

class MessageBox extends Component {
    componentDidMount() {
        setTimeout(() => {
            this.props.hideMessageBox();
        }, this.props.timeout);
    }
    render() {
        let icon;

        if (this.props.icon === 'success')
            icon = <FontAwesomeIcon icon={ faCheckCircle } className='green-check' />
        else if (this.props.icon === 'error')
            icon = <FontAwesomeIcon icon={ faExclamationCircle } className='red-exclamation' />
        else if (this.props.icon === 'notification')
            icon = <FontAwesomeIcon icon={ faExclamationTriangle } className='yellow-notification' />
        
        return(
            <div id='MsBoxParent'>
                <div className='f-w-container'>
                    <div className='f-w-backblur' />
                    <div id='MessageBox'>
                        <div id='MsbIcon'>{ icon }</div>
                        <div>{ this.props.message }</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default MessageBox;