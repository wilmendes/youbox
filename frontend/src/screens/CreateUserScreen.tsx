import * as React from "react";
import { Image, KeyboardAvoidingView, StyleSheet, View } from "react-native";
import Button from "../components/Button";
import FormTextInput from "../components/FormTextInput";
import colors from "../config/colors";
import strings from "../config/strings";
import authService from "../services/authService";
import { Screens } from "../config/constants";
import { NavigationScreenProp, NavigationState, NavigationParams } from "react-navigation";

interface State {
    email: string;
    password: string;
    name: string;
}

interface Props {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

class CreateUserScreen extends React.Component<Props, State> {
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
        if (this.nameInputRef) {
            this.nameInputRef.current.focus();
        }
    }

    handleNameSubmitPress = () => {
        if (this.passwordInputRef) {
            this.passwordInputRef.current.focus();
        }
    }

    handleCreatePress = async () => {
        const response = await authService.createUser(this.state.email, this.state.password, this.state.name);
        this.props.navigation.navigate('App');
        console.log("Create button pressed")
    }

    render() {
        return (
            <KeyboardAvoidingView style={styles.container} behavior="padding">
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
                        autoCapitalize='none'
                        autoCorrect={false}
                        keyboardType="email-address"
                        onChangeText={this.handleNameChange}
                        onSubmitEditing={this.handleNameSubmitPress}
                        placeholder={strings.NAME_PLACEHOLDER}
                        ref={this.nameInputRef}
                        returnKeyType="next"
                        value={this.state.name}
                    />
                    <FormTextInput
                        ref={this.passwordInputRef}
                        value={this.state.password}
                        onChangeText={this.handlePasswordChange}
                        placeholder={strings.PASSWORD_PLACEHOLDER}
                        secureTextEntry={true}
                        returnKeyType="done"
                    />
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

export default CreateUserScreen;
