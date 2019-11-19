import constants from "../config/constants"
import { AsyncStorage } from "react-native";

class AuthService {
    public token = '';
    user: any;

    async createUser(email: string, password: string, name: string, isOwner: boolean) {
        const body = JSON.stringify({
            email,
            password,
            name,
            isOwner
        });
        try {
            const response = await this.post('/users', body);
            if (!response.token) {
                throw ("Missing token")
            }
            this.saveUser(response);
            this.user = response;
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
        this.saveUser(response);
        this.user = response;
        return response;
    }

    async logout() {
        console.log('logout: ', this.token)
        this.user = undefined;
        await this.post('/users/me/logout');
        this.deleteToken();
    }

    async saveUser(user) {
        try {
            await AsyncStorage.setItem('token', user.token);
            await AsyncStorage.setItem('user', JSON.stringify(user));
            this.token = user.token;
        } catch (error) {
            console.log('AsyncStorage Error: ' + error.message);
        }
    }

    async getToken() {
        // AsyncStorage.clear()
        this.token = await AsyncStorage.getItem('token');
        const user = await AsyncStorage.getItem('user');
        if (user) {
            this.user = JSON.parse(user);
        }
        return this.token;

    }

    async deleteToken() {
        await AsyncStorage.removeItem('token')
        this.token = '';
    }

    async post(url: string, body?: string) {
        return this.request(url, 'POST', body);
    }

    async request(url: string, method: string, body?: string) {
        url = `${constants.SERVER_URL}${url}`
        const request: RequestInit = {
            method,
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