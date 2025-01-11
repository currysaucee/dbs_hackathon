import React, { Suspense, useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { CSpinner, useColorModes } from '@coreui/react' 
import PrivateRoutes from './components/PrivateRoutes' 

import './scss/style.scss' 
import './scss/examples.scss' 

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout')) 

// ADD HERE TO REGISTER YOUR PAGE
// Pages
const Table = React.lazy(() => import('./views/pages/Table')) 
const Login = React.lazy(() => import('./views/pages/Login')) 
const Register = React.lazy(() => import('./views/pages/Register')) 
const Page404 = React.lazy(() => import('./views/pages/Page404')) 
const Page500 = React.lazy(() => import('./views/pages/Page500')) 
const Dashboard = React.lazy(() => import('./views/pages/Dashboard')) 
const Order = React.lazy(() => import('./views/pages/Order')) 
const MakeRequest = React.lazy(() => import('./views/pages/MakeRequest')) 
const OrderRequests = React.lazy(() => import('./views/pages/OrderRequests')) 



const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme') 
  const storedTheme = useSelector((state) => state.theme) 

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1]) 
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0] 
    if (theme) {
      setColorMode(theme) 
    }

    if (isColorModeSet()) {
      return 
    }

    setColorMode(storedTheme) 
  }, [])  // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          <Route exact path="/login" name="Login Page" element={<Login />} />
          <Route exact path="/register" name="Register Page" element={<Register />} />
          <Route exact path="/404" name="Page 404" element={<Page404 />} />
          <Route exact path="/500" name="Page 500" element={<Page500 />} />
          <Route
            path="/*"
            element={
              <PrivateRoutes>
                <DefaultLayout />
              </PrivateRoutes>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  ) 
} 

export default App 
