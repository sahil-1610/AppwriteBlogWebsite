import conf from '../conf/conf.js';
import { Client, Account, ID } from "appwrite";


export class AuthService {
    client = new Client();
    account;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.account = new Account(this.client);
    }

    async createAccount({email, password, name}) {
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            if (userAccount) {
                // Login after successful account creation
                const session = await this.login({email, password});
                return { userAccount, session }; 
            }
            return null;
        } catch (error) {
            throw error;
        }
    }

    async login({email, password}) {
        try {
            const session = await this.account.createEmailSession(email, password);
            return session;
        } catch (error) {
            throw error;
        }
    }

    async getCurrentUser() {
        try {
            const user = await this.account.get();
            if (!user) return null;
            return user;
        } catch (error) {
            console.log("Appwrite service :: getCurrentUser :: error", error);
            return null;
        }
    }

    async logout() {
        try {
            return await this.account.deleteSessions();
        } catch (error) {
            console.log("Appwrite service :: logout :: error", error);
            throw error;
        }
    }
}

const authService = new AuthService();

export default authService


