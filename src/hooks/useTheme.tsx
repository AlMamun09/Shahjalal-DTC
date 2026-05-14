import { useEffect, type ReactNode } from 'react'

export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  }, [])
  return <>{children}</>
}

export function useTheme() {
  return { theme: 'dark' as const }
}