import React from 'react'
import { AuthProvider } from './context/AuthContext'
import AppRoutes from './routes/AppRoutes'
import Footer from './components/common/Footer'

const App = () => {
  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col">
        <main className="flex-1">
          <AppRoutes />
        </main>
        {/* <Footer /> */}
      </div>
    </AuthProvider>
  )
}

export default App
