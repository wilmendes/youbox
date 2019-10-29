import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from '../components/Button';
import strings from '../config/strings';
import authService from '../services/authService';

interface Props {
    newToken: (token: string) => void
}
export default class UserScreen extends React.Component<Props, {}> {
    constructor(public readonly props: Props) {
        super(props);
    }

    handleLogoutPress = async () => {
        try {
            await authService.logout();
            console.log('logging out')
        } catch(e){
            console.log('could not logout: ', e)
        }
        this.props.newToken(undefined);
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>User screen</Text>
                <Button label={strings.LOGOUT} onPress={this.handleLogoutPress} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center"
    }
})
