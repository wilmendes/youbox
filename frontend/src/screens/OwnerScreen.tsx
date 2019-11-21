import React from 'react';
import { View, Text, StyleSheet, FlatList, Platform } from 'react-native';
import Button from '../components/Button';
import strings from '../config/strings';
import authService from '../services/authService';
import FormTextInput from '../components/FormTextInput';
import { Music, getIdFromVideo } from '../util/utils';
interface Props {
    navigation: any
}

interface State {
    musics: Music[],
    currentMusic: string
}
export default class OwnerScreen extends React.Component<Props, State> {
    state: State = {
        musics: [],
        currentMusic: ''
    }
    constructor(public readonly props: Props) {
        super(props);
        if (!authService.user) {
            this.props.navigation.navigate('AuthLoading');
        }
    }

    async updatePlaylist() {
        let playlist = (await authService.request('/playlists', 'GET'))[0];
        (playlist.musics as Music[]).sort((m1, m2) => m2.votes - m1.votes);
        this.setState({
            musics: playlist.musics
        });
        return playlist;
    }

    async componentDidMount() {
        await this.updatePlaylist();
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

    handleMusicChanged = async (currentMusic: string) => {
        this.setState({ currentMusic });
    }

    addMusic = async () => {
        const title = await getVideoTitle(this.state.currentMusic);
        const body = {
            playlist: authService.user.user.name,
            url: this.state.currentMusic,
            name: title
        }
        await authService.post('/playlists/music', JSON.stringify(body));
        // this.setState({
        //     musics: this.state.musics.concat([this.state.currentMusic])
        // })
        console.log('Music title', title)
        await this.updatePlaylist();
        this.setState({
            currentMusic: ''
        })
    }

    removeMusic = (item: Music) => {
        return async () => {
            const body = {
                playlist: authService.user.user.name,
                url: item.url
            }
            console.log('Deleting: ', item)
            await authService.request('/playlists/music', 'DELETE', JSON.stringify(body));
            await this.updatePlaylist();

        }
    }

    playMusic = (music: Music) => {
        return () => {
            this.props.navigation.navigate('Player', {
                music: music.url
            });
            console.log('playing: ', music)
        }
    }

    renderListItem = ({ item }: { item: Music }) =>
        <View style={styles.listItemContainer}>
            <Button style={styles.listItem} onPress={this.playMusic(item)} label={item.name}></Button>
            <Text>Votes: {item.votes} </Text>
            <Button style={styles.listItemButton} onPress={this.removeMusic(item)} label="Remove"></Button>
        </View>

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.musics}
                    renderItem={this.renderListItem}
                    keyExtractor={(item, index) => index.toString()}
                    style={styles.listContainer}></FlatList>
                <View style={styles.musicAddContainer}>
                    <FormTextInput
                        autoCapitalize='none'
                        autoCorrect={false}
                        onSubmitEditing={this.addMusic}
                        placeholder={strings.MUSIC_PLACEHOLDER}
                        returnKeyType="next"
                        onChangeText={this.handleMusicChanged}
                        value={this.state.currentMusic}
                        style={styles.musicInput}
                    />
                    <Button
                        label={strings.ADD_MUSIC}
                        onPress={this.addMusic}
                        style={styles.addMusicButton}
                    />

                </View>
                {/* <Button label={strings.LOGOUT} onPress={this.handleLogoutPress} /> */}
            </View>
        )
    }
}

async function getVideoTitle(url) {

    var videoId = getIdFromVideo(url);
    var ytApiKey = 'AIzaSyBnEsN-L81pBLh-VpMKKnNTFteqd0XW5jI';
    const requestUrl = "https://www.googleapis.com/youtube/v3/videos?part=snippet&id=" + videoId + "&key=" + ytApiKey;
    const data = await fetch(requestUrl, {
        method: 'GET'
    });
    const response = await data.json();
    console.log(response.items[0].snippet.title)
    return response.items[0].snippet.title;
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
        // margin: 3,
        paddingHorizontal: 5,
        // paddingVertical: 5,
    },
    listItemButton: {
        flex: 1,
        height: 30
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
