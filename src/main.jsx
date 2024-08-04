import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import Home from './Pages/Home'
import TrackOrder from './Pages/TrackOrder';
import Login from './Pages/Login';
import { createBrowserRouter , RouterProvider ,Outlet } from 'react-router-dom';
import Cart from './Pages/Cart';
import CategoryPage from './Pages/Category.jsx'
import BrandPage from './Pages/Brand.jsx'
import { Provider } from 'react-redux'
import store from './Store/store.js'
import SignUp from './Pages/SignUp.jsx'
import ProductDetail from './Pages/ProductDetail.jsx'
import Checkout from './Pages/Checkout.jsx'
import TrackOrderItem from './Pages/TrackOrderItem.jsx'
import AdminHome from './Pages/AdminHome.jsx'
import { ToastContainer } from 'react-toastify';



const appConfig = createBrowserRouter([
  {
    path: '/',
    element:<App />,
    children: [
      { 
        path: '/', 
        element: <Home /> 
      },
      {
        path:'/trackOrder',
        element:<TrackOrder />,
      },
      {
        path:'/login',
        element:<Login />
      },
      {
        path:'/cart',
        element:<Cart />
      },
      {
        path:'/category',
        element : <CategoryPage />,
        children : [
          {
            path:':categoryName',
            element:<CategoryPage />,
          }
        ]
      },
      {
        path:'/brand',
        element:<BrandPage />,
        children:[
          {
            path:':brandName',
            element:<BrandPage />
          }
        ]
      },
      {
        path:'/signUp',
        element:<SignUp />
      },
      {
        path:'/category/:categoryName/:productId',
        element:<ProductDetail />
      },
      {
        path:'/brand/:brandName/:productId',
        element:<ProductDetail />
      },
      {
        path:'/:productId',
        element:<ProductDetail />
      },
       {
          path:'/trackOrder/:orderItemId',
          element:<TrackOrderItem />
      }
    ]
  },
  {
    path :'/checkout',
    element:<Checkout />
  },
  {
    path : '/adminHome',
    element:<AdminHome />
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={appConfig} />
    <ToastContainer 
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
      />
  </Provider>
)
