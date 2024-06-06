import './App.css';
import Login from './Components/Login';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Users from './Components/Users';
import Register from './Components/Register';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login />
    },
    {
      path: "/register",
      element: <Register />
    },

    {
      path: "/Users",
      element: <Users />
    },
  ])
  return (
    <div >
      <RouterProvider router={router} />


    </div>
  );
}

export default App;
