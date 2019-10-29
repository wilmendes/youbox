import React from 'react';
import LogingScreen from './LoginScreen';
import UserScreen from './UserScreen';
import authService from '../services/authService';
interface State {

}
export default class InitialScreen extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props);
        this.loadToken();
    }
    readonly state = {
        jwt: '',
    }
    async loadToken() {
        this.setState({ jwt: await authService.getToken() });
    }

    newToken = (jwt: string) => {
        console.log('setting token: ', jwt)
        this.setState({ jwt })
    }

    render() {
        if (this.state.jwt) {
            return (
                <UserScreen newToken={this.newToken} />
            );
        } else {
            return (
                <LogingScreen newToken={this.newToken} />
            );
        }
    }
}