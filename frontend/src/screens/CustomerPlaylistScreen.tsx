import React from 'react';
import { View, Text, StyleSheet, FlatList, Platform } from 'react-native';
import Button from '../components/Button';
import strings from '../config/strings';
import authService from '../services/authService';
import FormTextInput from '../components/FormTextInput';
import { NavigationScreenProp, NavigationState } from 'react-navigation';
import { Music } from '../util/utils';
interface Props {
  navigation: NavigationScreenProp<NavigationState>
}

interface State {
  musics: Music[]
}
export default class CustomerPlaylistScreen extends React.Component<Props, State> {
  state: State = {
    musics: []
  }
  playlist: string;
  constructor(public readonly props: Props) {
    super(props);
    if (!authService.user) {
      this.props.navigation.navigate('AuthLoading');
    }
  }

  async updatePlaylist() {
    let playlist = (await authService.request('/allPlaylists', 'GET')).filter(p => p.name === this.playlist)[0];
    (playlist.musics as Music[]).sort((m1, m2) => m2.votes - m1.votes);
    this.setState({
      musics: playlist.musics
    });
    return playlist;
  }

  async componentDidMount() {
    this.playlist = this.props.navigation.getParam("playlist");
    await this.updatePlaylist();
  }

  handleListItemPress = (item: Music) => {
    return async () => {
      const body = {
        playlist: this.playlist,
        url: item.url
      }
      console.log('Votingo for: ', body)
      await authService.post('/playlists/music/vote', JSON.stringify(body));
      await this.updatePlaylist();
      console.log('pressed')

    }
  }

  renderListItem = ({ item }: {item: Music}) =>
    <View style={styles.listItemContainer}>
      <Text style={styles.listItem}>{item.name}</Text>
      <Button style={styles.listItemButton} onPress={this.handleListItemPress(item)} label={'Vote: ' + item.votes}></Button>
    </View>

  render() {
    return (
      <View style={styles.container}>
        <Text>Playlist</Text>
        <FlatList
          data={this.state.musics}
          renderItem={this.renderListItem}
          keyExtractor={(item, index) => index.toString()}
          style={styles.listContainer}></FlatList>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 40
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "center",
    margin: 3,
    paddingHorizontal: 5,
    paddingVertical: 5,
    backgroundColor: "#ccc",
    flex: 3
  },
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "center",
    margin: 3,
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  listItemButton: {
    flex: 1
  },
  listContainer: {
    width: 400,
    padding: 5
  },
  musicAddContainer: {
    flexDirection: "row",
    margin: 10
  },
  musicInput: {
    flex: 3
  },
  addMusicButton: {
    flex: 1
  }
})
