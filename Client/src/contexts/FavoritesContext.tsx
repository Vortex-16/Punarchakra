"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface FavoritesContextType {
    favorites: string[];
    addFavorite: (binId: string) => void;
    removeFavorite: (binId: string) => void;
    isFavorite: (binId: string) => boolean;
    toggleFavorite: (binId: string) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function useFavorites() {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error("useFavorites must be used within FavoritesProvider");
    }
    return context;
}

const STORAGE_KEY = "punarchakra_favorite_bins";

export function FavoritesProvider({ children }: { children: ReactNode }) {
    const [favorites, setFavorites] = useState<string[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load favorites from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setFavorites(JSON.parse(stored));
            }
        } catch (error) {
            console.error("Error loading favorites:", error);
        }
        setIsLoaded(true);
    }, []);

    // Save favorites to localStorage whenever they change
    useEffect(() => {
        if (isLoaded) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
            } catch (error) {
                console.error("Error saving favorites:", error);
            }
        }
    }, [favorites, isLoaded]);

    const addFavorite = (binId: string) => {
        setFavorites((prev) => [...new Set([...prev, binId])]);
    };

    const removeFavorite = (binId: string) => {
        setFavorites((prev) => prev.filter((id) => id !== binId));
    };

    const isFavorite = (binId: string) => {
        return favorites.includes(binId);
    };

    const toggleFavorite = (binId: string) => {
        if (isFavorite(binId)) {
            removeFavorite(binId);
        } else {
            addFavorite(binId);
        }
    };

    return (
        <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite, toggleFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
}
