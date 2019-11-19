import React from 'react';
import { View, Text, StyleSheet, FlatList, Platform } from 'react-native';
import Button from '../components/Button';
import strings from '../config/strings';
import authService from '../services/authService';
import FormTextInput from '../components/FormTextInput';
interface Props {
    navigation: any
}

interface State {
    musics: string[],
    currentMusic: string
}
export default class OwnerScreen extends React.Component<Props, State> {
    state = {
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
        if (playlist) {
            this.setState({
                musics: playlist.musics
            });
        }
        return playlist;
    }

    async componentDidMount() {
        // this.setState({

        // });
        let playlist = await this.updatePlaylist();
        console.log('Playlist: ', playlist)
        if (!playlist) {
            const body = JSON.stringify({
                name: authService.user.user.name
            });
            await authService.post('/playlists', body);
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

    handleMusicChanged = async (currentMusic: string) => {
        this.setState({ currentMusic });
    }

    addMusic = async () => {
        const body = {
            playlist: authService.user.user.name,
            url: this.state.currentMusic
        }
        await authService.post('/playlists/music', JSON.stringify(body));
        // this.setState({
        //     musics: this.state.musics.concat([this.state.currentMusic])
        // })
        await this.updatePlaylist();
    }

    removeMusic = (item) => {
        return async () => {
            const body = {
                playlist: authService.user.user.name,
                url: item
            }
            console.log('Deleting: ', item)
            await authService.request('/playlists/music', 'DELETE', JSON.stringify(body));
            await this.updatePlaylist();

        }
    }

    renderListItem = ({ item }) =>
        <View style={styles.listItemContainer}>
            <Text style={styles.listItem}>{item}</Text>
            <Button style={styles.listItemButton} onPress={this.removeMusic(item)} label="Remove"></Button>
        </View>

    render() {
        return (
            <View style={styles.container}>
                <Text>Owner screen</Text>
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
