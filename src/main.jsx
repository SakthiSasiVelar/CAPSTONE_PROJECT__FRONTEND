import React, { lazy,Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import Home from './Pages/Home'
// import TrackOrder from './Pages/TrackOrder';
// import Login from './Pages/Login';
import { createBrowserRouter , RouterProvider ,Outlet } from 'react-router-dom';
// import Cart from './Pages/Cart';
// import CategoryPage from './Pages/Category.jsx'
// import BrandPage from './Pages/Brand.jsx'
import { Provider } from 'react-redux'
import store from './Store/store.js'
// import SignUp from './Pages/SignUp.jsx'
// import ProductDetail from './Pages/ProductDetail.jsx'
// import Checkout from './Pages/Checkout.jsx'
// import TrackOrderItem from './Pages/TrackOrderItem.jsx'
// import AdminHome from './Pages/AdminHome.jsx'
import { ToastContainer } from 'react-toastify';
import TrackOrderShimmer from './Components/Shimmer/TrackOrderShimmer.jsx'
import CartShimmer from './Components/Shimmer/CartShimmer.jsx'
import CategoryShimmer from './Components/Shimmer/CategoryShimmer.jsx'
import CheckoutShimmer from './Components/Shimmer/CheckoutShimmer.jsx'
import ProductDetailShimmer from './Components/Shimmer/ProductDetailShimmer.jsx'
import ShimmerTable from './Components/Shimmer/ShimmerTable.jsx'


const TrackOrder = lazy(() => import("./Pages/TrackOrder.jsx"));
const TrackOrderItem = lazy(()=>import('./Pages/TrackOrderItem.jsx'))
const Cart = lazy(()=> import('./Pages/Cart.jsx'))
const Login = lazy(()=>import('./Pages/Login.jsx'))
const SignUp = lazy(()=>import('./Pages/SignUp.jsx'))
const CategoryPage = lazy(()=>import('./Pages/Category.jsx'))
const BrandPage = lazy(()=>import('./Pages/Brand.jsx'))
const Checkout = lazy(()=>import('./Pages/Checkout.jsx'))
const AdminHome = lazy(()=>import('./Pages/AdminHome.jsx'))
const ProductDetail = lazy(()=>import('./Pages/ProductDetail.jsx'))




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
        element:(
          <Suspense fallback={<TrackOrderShimmer />}>
            <TrackOrder />
          </Suspense>
        )
      },
      {
        path:'/login',
        element:(
          <Suspense >
            <Login />
          </Suspense>
        )
      },
      {
        path:'/cart',
        element:(
          <Suspense fallback={<CartShimmer />}>
            <Cart />
          </Suspense>
        )
      },
      {
        path:'/category',
         element:(
          <Suspense fallback={<CategoryShimmer />}>
            <CategoryPage />
          </Suspense>
        ),
        children : [
          {
            path:':categoryName',
            element:(
          <Suspense fallback={<CategoryShimmer />}>
            <CategoryPage />
          </Suspense>
        ),
          }
        ]
      },
      {
        path:'/brand',
        element:(
          <Suspense fallback={<CategoryShimmer />}>
            <BrandPage />
          </Suspense>
        ),
        children:[
          {
            path:':brandName',
             element:(
          <Suspense fallback={<CategoryShimmer />}>
            <BrandPage />
          </Suspense>
        ),
          }
        ]
      },
      {
        path:'/signUp',
         element:(
          <Suspense >
            <SignUp />
          </Suspense>
        )
      },
      {
        path:'/category/:categoryName/:productId',
        element:(
          <Suspense fallback={<ProductDetailShimmer />}>
            <ProductDetail />
          </Suspense>
        ),
      },
      {
        path:'/brand/:brandName/:productId',
        element:(
          <Suspense fallback={<ProductDetailShimmer />}>
            <ProductDetail />
          </Suspense>
        ),
      },
      {
        path:'/:productId',
        element:(
          <Suspense fallback={<ProductDetailShimmer />}>
            <ProductDetail />
          </Suspense>
        ),
      },
       {
          path:'/trackOrder/:orderItemId',
          element:(
            <Suspense fallback={<TrackOrderShimmer />}>
                <TrackOrderItem />
             </Suspense>
          )
      }
    ]
  },
  {
    path :'/checkout',
     element:(
          <Suspense fallback={<CheckoutShimmer />}>
            <Checkout />
          </Suspense>
        ),
  },
  {
    path : '/adminHome',
     element:(
          <Suspense fallback={<ShimmerTable />}>
            <AdminHome />
          </Suspense>
        ),
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
