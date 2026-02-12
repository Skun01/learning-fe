import {BrowserRouter, Route, Routes} from 'react-router'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { DashboardPage } from './pages/DashboardPage'
import { HomePage } from './pages/HomePage'
import {Toaster} from 'sonner'

function App() {
  return <>
    <Toaster richColors/>
    <BrowserRouter>
      <Routes>
        {/* public routes */}
        <Route
          path="/"
          element={<HomePage/>}
        />

        <Route
          path='/login'
          element={<LoginPage/>}
        />
        <Route
          path='/register'
          element={<RegisterPage/>}
        />

        {/* protected routes */}
        <Route
          path='/dashboard'
          element={<DashboardPage/>}
        />
      </Routes>
    </BrowserRouter>
  </>
}

export default App
