import { useMemo, useState } from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { store } from './store'
import AppRoutes from './routes/AppRoutes'
import { getTheme } from './theme'
import { queryClient } from './services/queryClient'
import { ThemeModeProvider } from './context/ThemeModeContext'

type ThemeMode = 'light' | 'dark'

function App() {
  const [mode, setMode] = useState<ThemeMode>('light')
  const theme = useMemo(() => getTheme(mode), [mode])

  const toggleMode = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  const setThemeMode = (newMode: ThemeMode) => {
    setMode(newMode)
  }

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeModeProvider value={{ mode, toggleMode, setMode: setThemeMode }}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
            <ReactQueryDevtools initialIsOpen={false} />
          </ThemeProvider>
        </ThemeModeProvider>
      </QueryClientProvider>
    </Provider>
  )
}

export default App
