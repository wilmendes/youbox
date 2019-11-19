import * as React from "react";
import { Image, KeyboardAvoidingView, StyleSheet, View } from "react-native";
import Button from "../components/Button";
import FormTextInput from "../components/FormTextInput";
import colors from "../config/colors";
import strings from "../config/strings";
import authService from "../services/authService";
import { NavigationScreenProp, NavigationState, NavigationParams } from "react-navigation";
import { getUserScreen } from "../util/utils";

const imageLogo = require("../assets/images/logo2.jpg");

interface State {
    email: string;
    password: string;
    name: string;
}

interface Props {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

class LoginScreen extends React.Component<Props, State> {
    passwordInputRef = React.createRef<FormTextInput>()
    nameInputRef = React.createRef<FormTextInput>()
    constructor(public readonly props: Props) {
        super(props);
    }

    readonly state: State = {
        email: "",
        password: "",
        name: ""
    };

    handleEmailChange = (email: string) => {
        this.setState({ email });
    };

    handlePasswordChange = (password: string) => {
        this.setState({ password });
    };

    handleNameChange = (name: string) => {
        this.setState({ name });
    }

    handleEmailSubmitPress = () => {
        if (this.passwordInputRef) {
            this.passwordInputRef.current.focus();
        }
    }

    handleLoginPress = async () => {
        await authService.login(this.state.email, this.state.password);
        console.log('logging in');
        this.props.navigation.navigate(getUserScreen(authService.user));
    };

    handleCreatePress = async () => {
        this.props.navigation.navigate('CreateUser');
        console.log("Create button pressed")
    }

    render() {
        return (
            <KeyboardAvoidingView style={styles.container} behavior="padding">
                <Image source={imageLogo} style={styles.logo} />
                <View style={styles.form}>
                    <FormTextInput
                        autoCapitalize='none'
                        autoCorrect={false}
                        keyboardType="email-address"
                        onChangeText={this.handleEmailChange}
                        onSubmitEditing={this.handleEmailSubmitPress}
                        placeholder={strings.EMAIL_PLACEHOLDER}
                        returnKeyType="next"
                        value={this.state.email}
                    />
                    <FormTextInput
                        ref={this.passwordInputRef}
                        value={this.state.password}
                        onChangeText={this.handlePasswordChange}
                        placeholder={strings.PASSWORD_PLACEHOLDER}
                        secureTextEntry={true}
                        returnKeyType="done"
                    />
                    <Button label={strings.LOGIN} onPress={this.handleLoginPress} />
                    <Button label={strings.CREATE} onPress={this.handleCreatePress} />
                </View>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.WHITE,
        alignItems: "center",
        justifyContent: "space-between"
    },
    logo: {
        flex: 1,
        width: "100%",
        resizeMode: "contain",
        alignSelf: "center"
    },
    form: {
        flex: 1,
        justifyContent: "center",
        width: "80%"
    }
});

export default LoginScreen;
