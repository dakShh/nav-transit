'use client';

// root
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// types
import { Location, User } from '@/types/user';

// Define the context type
interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    isLoading: boolean;
    logout: () => void;
    updateUserLocation: (location: Location) => void;
}

// Create the context with default values
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider props
interface UserProviderProps {
    children: ReactNode;
}

// Dummy user
const dummyUser = {
    id: 'aspoasdbnqotin',
    first_name: 'Daksh',
    last_name: 'Khatri',
    email: 'daksh.dk207@gmail.com',
};
// Provider component
export function UserProvider({ children }: UserProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load user from localStorage or load from db
    useEffect(() => {
        const loadUser = () => {
            try {
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                } else {
                    setUser(dummyUser);
                    localStorage.setItem('user', JSON.stringify(dummyUser));
                }
            } catch (error) {
                console.error('Failed to load user:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadUser();
    }, []);

    // Save user to localStorage whenever it changes (optional)
    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    // Logout function
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    // Update user location
    const updateUserLocation = (location: Location) => {
        if (!user) return;

        let currentUser = { ...user };
        currentUser.location = location;

        setUser(currentUser);
    };

    const value = {
        user,
        setUser,
        isLoading,
        logout,
        updateUserLocation,
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}
