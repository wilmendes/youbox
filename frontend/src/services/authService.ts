import constants from "../config/constants"
import { AsyncStorage } from "react-native";

class AuthService {
    public token = '';

    async createUser(email: string, password: string, name: string) {
        const body = JSON.stringify({
            email,
            password,
            name
        });
        try {
            const response = await this.post('/users', body);
            if (!response.token) {
                throw ("Missing token")
            }
            this.saveToken(response.token);
            console.log(response)
            return response;
        } catch (e) {
            console.log('Could not createUser: ', e)
            throw e
        }
    }

    async login(email: string, password: string) {
        const body = JSON.stringify({
            email,
            password
        });
        const response = await this.post('/users/login', body);
        if (!response.token) {
            throw ("Missing token")
        }
        this.saveToken(response.token);
        return response;
    }

    async logout() {
        console.log('logout: ', this.token)
        this.deleteToken();
        await this.post('/users/me/logout');
    }

    async saveToken(value) {
        try {
            await AsyncStorage.setItem('token', value);
            this.token = value;
        } catch (error) {
            console.log('AsyncStorage Error: ' + error.message);
        }
    }

    async getToken() {
        // AsyncStorage.clear()
        this.token = await AsyncStorage.getItem('token');
        return this.token

    }

    async deleteToken() {
        await AsyncStorage.removeItem('token')
        this.token = '';
    }

    private async post(url: string, body?: string) {
        url = `${constants.SERVER_URL}${url}`
        const request: RequestInit = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }
        if (this.token) {
            request.headers['Authorization'] = `Bearer ${this.token}`
        }
        if (body) {
            request.body = body;
        }
        const response = await fetch(url, request);
        if (response.status < 200 || response.status > 300) {
            var error: any = new Error(response.statusText || '' + response.status)
            error.response = response
            throw error;
        }
        const parsedResponse = await response.json();
        return parsedResponse
    }
}


const service = new AuthService()
export default service;