import { createSwitchNavigator, createAppContainer } from "react-navigation";
import { createDrawerNavigator } from "react-navigation-drawer"

import UserScreen from "./UserScreen";
import LoginScreen from "./LoginScreen";
import { createStackNavigator } from "react-navigation-stack";
import CreateUserScreen from "./CreateUserScreen";
import AuthLoadingScreen from "../screens/AuthLoadingScreen";
import OwnerScreen from "./OwnerScreen";
import SettingsScreen from "./SettingsScreen";
import CustomerPlaylistScreen from "./CustomerPlaylistScreen";
import YoutubePlayerScreen from "./YoutubePlayerScreen";

const CustomerHomeNavigator = createStackNavigator({
  List: {
    screen: UserScreen,
    navigationOptions: {
      title: 'Estabelecimentos'
    }
  },
  Musics: {
    screen: CustomerPlaylistScreen
  }
}, {
  initialRouteName: 'List'
});

const CustomerNavigator = createDrawerNavigator({
  Home: {
    screen: CustomerHomeNavigator,
  },
  Settings: {
    screen: SettingsScreen
  }
}, {
  initialRouteName: 'Home'
});

const YoutubePlayerNavigator = createStackNavigator({
  MusicList: {
    screen: OwnerScreen,
    navigationOptions: {
      title: 'Musicas'
    }
  },
  Player: {
    screen: YoutubePlayerScreen
  }
}, {
  initialRouteName: 'MusicList'
});

const OwnerNavigator = createDrawerNavigator({
  Home: {
    screen: YoutubePlayerNavigator,
    navigationOptions: {
      title: 'Musicas'
    }

  },
  Settings: {
    screen: SettingsScreen
  }
}, {
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
  Customer: {
    screen: CustomerNavigator,
  },
  Owner: {
    screen: OwnerNavigator
  }
},
  { initialRouteName: 'AuthLoading' });


export default createAppContainer(App);