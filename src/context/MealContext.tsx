import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface MealItem {
  name: string;
  portion: string;
  kcal: number;
}

export interface Meal {
  id: string;
  title: string;
  category: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  timeString: string;
  totalKcal: number;
  carbsGrams: number;
  proteinGrams: number;
  fatGrams: number;
  imageUri?: string | null;
  items?: MealItem[];
}

// Initial meals start empty so first navigation shows empty state
const INITIAL_MEALS: Meal[] = [];

interface MealContextType {
  meals: Meal[];
  addMeal: (meal: Omit<Meal, 'id'>) => void;
  removeMeal: (id: string) => void;
  clearMeals: () => void;
  pendingImageUri: string | null;
  setPendingImageUri: (uri: string | null) => void;
}

const MealContext = createContext<MealContextType | undefined>(undefined);

export function MealProvider({ children }: { children: ReactNode }) {
  const [meals, setMeals] = useState<Meal[]>(INITIAL_MEALS);
  const [pendingImageUri, setPendingImageUri] = useState<string | null>(null);

  const addMeal = (newMeal: Omit<Meal, 'id'>) => {
    const mealWithId: Meal = {
      ...newMeal,
      id: Date.now().toString(),
    };
    setMeals(prev => [...prev, mealWithId]);
  };

  const removeMeal = (id: string) => {
    setMeals(prev => prev.filter(m => m.id !== id));
  };

  const clearMeals = () => {
    setMeals([]);
  };

  return (
    <MealContext.Provider 
      value={{ 
        meals, 
        addMeal, 
        removeMeal, 
        clearMeals, 
        pendingImageUri, 
        setPendingImageUri 
      }}
    >
      {children}
    </MealContext.Provider>
  );
}

export function useMeals() {
  const context = useContext(MealContext);
  if (!context) {
    throw new Error('useMeals must be used within a MealProvider');
  }
  return context;
}
