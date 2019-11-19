import React from 'react';
import {
  ActivityIndicator,
  StatusBar,
  View,
} from 'react-native';
import authService from '../services/authService';
import { getUserScreen } from '../util/utils';

interface Props {
  navigation: any
}

class AuthLoadingScreen extends React.Component<Props, {}> {
  componentDidMount() {
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {


    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(await getScreen());
  };

  // Render any loading content that you like here
  render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

async function getScreen() {
  const token = await authService.getToken();
  let screen;
  if (token) {
    screen = getUserScreen(authService.user);
  } else {
    screen = 'Auth';
  }
  return screen;
}

export default AuthLoadingScreen;