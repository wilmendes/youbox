import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from '../components/Button';
import strings from '../config/strings';
import authService from '../services/authService';

interface Props {
    navigation: any
}
export default class SettingsScreen extends React.Component<Props, {}> {
    constructor(public readonly props: Props) {
        super(props);
        if (!authService.user) {
            this.props.navigation.navigate('AuthLoading');
        }
    }

    handleLogoutPress = async () => {
        try {
            await authService.logout();
            console.log('logging out')
        } catch (e) {
            console.log('could not logout: ', e)
        }
        this.props.navigation.navigate('AuthLoading');
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>Settings</Text>
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
