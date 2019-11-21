import React from 'react';
import { View, Text, StyleSheet, FlatList, Platform } from 'react-native';
import Button from '../components/Button';
import strings from '../config/strings';
import authService from '../services/authService';
import FormTextInput from '../components/FormTextInput';
import { NavigationScreenProp, NavigationState } from 'react-navigation';
interface Props {
    navigation: NavigationScreenProp<NavigationState>
}

interface State {
    playlists: string[]
}
export default class UserScreen extends React.Component<Props, State> {
    state = {
        playlists: []
    }
    constructor(public readonly props: Props) {
        super(props);
        if (!authService.user) {
            this.props.navigation.navigate('AuthLoading');
        }
    }

    async updatePlaylist() {
        let playlists = (await authService.request('/allPlaylists', 'GET'));
        if (playlists) {
            this.setState({
                playlists: playlists.map(p => p.name)
            });
        }
    }

    async componentDidMount() {
        // this.setState({

        // });
        await this.updatePlaylist();
        console.log('Playlist: ', this.state.playlists)
    }

    // addMusic = async () => {
    //     const body = {
    //         playlist: authService.user.user.name,
    //         url: this.state.currentMusic
    //     }
    //     await authService.post('/playlists/music', JSON.stringify(body));
    //     // this.setState({
    //     //     musics: this.state.musics.concat([this.state.currentMusic])
    //     // })
    //     await this.updatePlaylist();
    // }

    navigateToPlaylist = (item) => {
        return async () => {
            this.props.navigation.navigate('Musics',{
                playlist: item
            });
        }
    }

    renderListItem = ({ item }) =>
        <View style={styles.listItemContainer}>
            {/* <Text style={styles.listItem}>{item}</Text> */}
            <Button style={styles.listItemButton} onPress={this.navigateToPlaylist(item)} label={item}></Button>
        </View>

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.playlists}
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
