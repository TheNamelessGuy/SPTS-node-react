import React, { Component } from 'react';

class User extends Component {

    constructor() {
        super();

        this.state = {
            users: [],
            response: ''
        }
    }

    componentDidMount() {
        fetch('/spts_user')
            .then(res => res.json())
            .then(data => this.setState({ response: data.response }, () => {
                if (this.state.response != 'false' && this.state.response != 'null')
                    this.setState({ users: this.state.response });
            }));
    }

    render() {
        let ths = [];
        let tds = [];
        for (let user of this.state.users) {

            let table_data = []
            for (let [key, value] of Object.entries(user)) {
                if (user == this.state.users[0])
                    ths.push(key);

                table_data.push(value);
            }
            tds.push(table_data);
        }

        return (
            <table className='table table-striped'>
                <thead className='thead-dark'>
                    <tr>
                        { ths.map(th => 
                            <th scope='col'>{ th }</th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    { tds.map(td => 
                        <tr>
                            { td.map(data => 
                                <td>{ data }</td>
                            )}
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }
}

export default User;