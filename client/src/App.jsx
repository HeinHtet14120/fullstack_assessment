import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import { Layout, RequireAuth } from './routes/layout/layout'
import Login from './routes/login/login'
import Register from './routes/register/register'
import Home from './routes/home/home'
import Test from './routes/test/test'

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout/>,
      children: [
        {
          path: "/login",
          element:<Login/>
        },
        {
          path: "/register",
          element: <Register />
        }
      ]
    },
    {
      path: "/",
      element: <RequireAuth />,
      children: [
        {
          path: "/home",
          element:<Home/>
        }
      ]
    }
  ])

  return (
    <RouterProvider router={router}/>
  )
}

export default App
