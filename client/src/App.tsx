import "./App.css";
import Login from "./auth/Login";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./MainLayout";
import Signup from "./auth/Signup";
import ForgotPassword from "./auth/ForgotPassword";
import ResetPassword from "./auth/ResetPassword";
import VerifyEmail from "./auth/VerifyEmail";
import Navbar from "./components/Navbar";

const appRouter = createBrowserRouter([
  {
    path: "",
    element: <Navbar />,
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
