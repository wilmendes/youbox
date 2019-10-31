import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from '../components/Button';
import strings from '../config/strings';
import authService from '../services/authService';
import { Screens } from '../config/constants';

interface Props {
    navigation: any
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
        console.log(this.props.navigation)
        this.props.navigation.navigate('AuthLoading');
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
