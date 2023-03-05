import { useContext, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { FaChurch } from 'react-icons/fa';
import { Outlet } from 'react-router-dom';
import { ReactComponent as Logo } from './assets/logo.svg';
import { Menu } from './components/Menu';
import type { Screens } from './@types/Screens.type';
import { InitialConfig } from './components/Config/InitialConfig';
import { PartialBalance } from './components/PartialBalance';
import { BalanceConfig } from './components/Config/BalanceConfig';
import { DataOfChurchConfig } from './components/Config/DataOfChurchConfig';
import { GlobalContext } from './context/GlobalContext';
import './styles/reactToastify.css';

export function App() {
  const [selectedScreen, setSelectedScreen] = useState<Screens>('' as Screens);
  const { logoSrc, showInitialConfig } = useContext(GlobalContext);

  return (
    <div className="flex w-screen h-screen">
      <aside className="border-r-2 border-r-zinc-300 w-1/6 h-screen rounded-r-sm overflow-y-auto">
        <Menu
          setSelectedScreen={setSelectedScreen}
          selectedScreen={selectedScreen}
        />
      </aside>
      <main className="flex flex-1 justify-center items-center w-5/6">
        {!selectedScreen && (
          <>
            <div className="fixed top-4 right-4 flex items-center gap-6">
              <DataOfChurchConfig />
              <BalanceConfig />
            </div>
            <PartialBalance />
          </>
        )}
        {selectedScreen && (
          <button
            tabIndex={0}
            type="button"
            className="z-40 focus:outline-none focus:text-teal-500 text-zinc-900  hover:text-teal-500 fixed top-2 right-12 cursor-pointer"
            onClick={() => setSelectedScreen('' as Screens)}
          >
            <FaChurch title="Voltar para tela inicial" className="w-14 h-14" />
          </button>
        )}

        {/* Initial Config */}
        {showInitialConfig && <InitialConfig />}

        <Outlet />

        {/* Logo */}
        {logoSrc ? (
          <img
            src={logoSrc}
            alt="Logo"
            className={`${
              selectedScreen
                ? 'w-12 fixed bottom-4 right-4 opacity-80'
                : 'w-[200px]'
            } transition-all duration-500 ease-in-out`}
          />
        ) : (
          <Logo
            className={`${
              selectedScreen
                ? 'w-12 fixed bottom-4 right-4 opacity-80'
                : 'w-[200px]'
            } transition-all duration-500 ease-in-out`}
          />
        )}
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
