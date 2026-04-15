const USERS_KEY = 'onboarding_app_users';

export const TEST_CREDENTIALS = {
    username: 'demo',
    password: 'mypass@123',
};

export interface StoredUser {
    username: string;
    password: string;
}

export const getUsers = (): StoredUser[] => {
    try {
        const data = localStorage.getItem(USERS_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
};

export const validateUser = (username: string, password: string): boolean => {
    if (username === TEST_CREDENTIALS.username && password === TEST_CREDENTIALS.password) {
        return true;
    }
    const users = getUsers();
    return users.some(u => u.username === username && u.password === password);
};
