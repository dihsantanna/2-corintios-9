import { ToastContainer } from 'react-toastify';
import { FaChurch } from 'react-icons/fa';
import { useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Router } from './Router';
import { Menu } from './components/Menu';
import type { Screens } from './@types/Screens.type';
import './styles/reactToastify.css';

export function App() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/home', { replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    <div className="flex w-screen h-screen">
      <aside className="border-r-2 border-r-zinc-300 w-1/6 h-screen rounded-r-sm overflow-y-auto">
        <Menu selectedScreen={location.pathname.replace('/', '') as Screens} />
      </aside>
      <main className="flex flex-1 justify-center items-center w-5/6">
        {location.pathname !== '/home' && (
          <Link
            tabIndex={0}
            to="/home"
            className="z-40 focus:outline-none focus:text-teal-500 text-zinc-900  hover:text-teal-500 fixed top-2 right-12 cursor-pointer"
          >
            <FaChurch title="Voltar para tela inicial" className="w-14 h-14" />
          </Link>
        )}
        <Router />
        {/* Logo */}
      </main>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}
