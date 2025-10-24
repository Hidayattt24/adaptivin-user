"use client";

import { createContext, useContext, ReactNode } from 'react';
import { ClassTheme, getClassTheme } from '@/config/classThemes';

interface ClassThemeContextType {
  theme: ClassTheme;
  classId: string;
}

const ClassThemeContext = createContext<ClassThemeContextType | null>(null);

interface ClassThemeProviderProps {
  children: ReactNode;
  classId: string;
}

/**
 * ClassThemeProvider
 *
 * Provides class theme context to all child components
 * Automatically loads the correct theme based on classId
 *
 * Usage:
 * ```tsx
 * <ClassThemeProvider classId="4">
 *   <YourComponent />
 * </ClassThemeProvider>
 * ```
 */
export function ClassThemeProvider({ children, classId }: ClassThemeProviderProps) {
  const theme = getClassTheme(classId);

  return (
    <ClassThemeContext.Provider value={{ theme, classId }}>
      {children}
    </ClassThemeContext.Provider>
  );
}

/**
 * useClassTheme Hook
 *
 * Access the current class theme from any component
 *
 * Usage:
 * ```tsx
 * const { theme, classId } = useClassTheme();
 * ```
 */
export function useClassTheme(): ClassThemeContextType {
  const context = useContext(ClassThemeContext);

  if (!context) {
    throw new Error('useClassTheme must be used within ClassThemeProvider');
  }

  return context;
}
