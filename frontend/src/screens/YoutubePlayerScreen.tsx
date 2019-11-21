import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview'
import Button from '../components/Button';
import strings from '../config/strings';
import authService from '../services/authService';
import { NavigationScreenProp, NavigationState, SafeAreaView } from 'react-navigation';
import { getIdFromVideo } from '../util/utils';

interface Props {
  navigation: NavigationScreenProp<NavigationState>
}

interface State {
  music: string
}
export default class YoutubePlayerScreen extends React.Component<Props, State> {
  state = {
    music: ''
  }
  constructor(public readonly props: Props) {
    super(props);
  }

  componentDidMount() {
    this.setState({
      music: "http://www.youtube.com/embed/"+getIdFromVideo(this.props.navigation.getParam("music"))
    });
  }

  render() {
    return (
      <View style={styles.safeArea}>
        <WebView
          source={{ uri: this.state.music}}
          style={styles.video}
          startInLoadingState={true}
          originWhitelist={['*']}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1
  },
  video: {
    marginTop: 20,
  }
})
