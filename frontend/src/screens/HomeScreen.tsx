import { createSwitchNavigator, createAppContainer } from "react-navigation";
import { createDrawerNavigator } from "react-navigation-drawer"

import HomeScreen from "../screens/HomeScreen";
import UserScreen from "./UserScreen";
import LoginScreen from "./LoginScreen";
import { createStackNavigator } from "react-navigation-stack";
import CreateUserScreen from "./CreateUserScreen";
import AuthLoadingScreen from "../screens/AuthLoadingScreen";
// import SettingsScreen from "./screens/SettingsScreen";
const AppNavigator = createDrawerNavigator({
  Home: {
    screen: UserScreen
  },
  // Settings: {
  //     screen: SettingsScreen
  // }
},{
  initialRouteName: 'Home'
});


const AuthStack = createStackNavigator({
  Landing: {
    screen: LoginScreen,
    navigationOptions: {
      headerTitle: 'Log in',
    },
  },
  CreateUser: {
    screen: CreateUserScreen,
    navigationOptions: {
      headerTitle: 'Create Account',
    },
  }
}, {
  initialRouteName: 'Landing'
});

const App = createSwitchNavigator({
  // Loading: {
  //     screen: Example,
  // },
  AuthLoading: {
    screen: AuthLoadingScreen,
  },
  Auth: {
    screen: AuthStack,
  },
  App: {
    screen: AppNavigator,
  }
},
  { initialRouteName: 'AuthLoading' });


export default createAppContainer(App);