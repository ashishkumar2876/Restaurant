import "./App.css";
import Login from "./auth/Login";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Signup from "./auth/Signup";
import ForgotPassword from "./auth/ForgotPassword";
import ResetPassword from "./auth/ResetPassword";
import VerifyEmail from "./auth/VerifyEmail";
import HeroSection from "./components/HeroSection";
import MainLayout from "./layout/MainLayout";
import Profile from "./components/Profile";
import SearchPage from "./components/SearchPage";
import RestaurantDetails from "./components/RestaurantDetails";
import Cart from "./components/Cart";

const appRouter = createBrowserRouter([
  {
    path: "",
    element: <MainLayout />,
    children:[
      {
        path:'/',
        element:<HeroSection/>
      },
      {
        path:'/profile',
        element:<Profile/>
      },
      {
        path:'/search/:text',
        element:<SearchPage/>
      },
      {
        path:"/restaurant/:id",
        element:<RestaurantDetails/>
      },
      {
        path:"/cart",
        element:<Cart/>
      }
    ]
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path:'/forgot-password',
    element:<ForgotPassword/>
  },
  {
    path:'/reset-password',
    element:<ResetPassword/>
  },
  {
    path:'/verify-email',
    element:<VerifyEmail/>
  }
]);
function App() {
  return (
    <>
      <RouterProvider router={appRouter}>
      </RouterProvider>
    </>
  );
}

export default App;
