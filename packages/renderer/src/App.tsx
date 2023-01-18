import { useState } from 'react';
import { ReactComponent as Logo } from '../assets/logo.svg';
import { Menu } from './components/Menu';
import type { Screens } from './@types/Screens.type';
import { ToastContainer } from 'react-toastify';
import { AddMember } from './components/Add/AddMember';
import { AddTithe } from './components/Add/AddTithe';
import { AddOffer } from './components/Add/AddOffer';
import { AddExpenseCategory } from './components/Add/AddExpenseCategory';
import 'react-toastify/dist/ReactToastify.css';

export function App() {
  const [selectedScreen, setSelectedScreen] = useState<Screens>('' as Screens);

  const getSelectedScreen = (screen: Screens) => {
    setSelectedScreen(screen);
  };
  return (
    <div className="flex w-screen h-screen">
      <aside className="border-r-2 border-r-zinc-300 w-1/5 h-screen rounded-r-md overflow-y-auto">
        <Menu getSelectedScreen={getSelectedScreen} />
      </aside>
      <main className="flex flex-1 justify-center items-center">
        <AddMember screenSelected={selectedScreen} />
        <AddTithe screenSelected={selectedScreen} />
        <AddOffer screenSelected={selectedScreen} />
        <AddExpenseCategory screenSelected={selectedScreen} />
        <Logo className={selectedScreen ? 'w-10 h-10 fixed bottom-4 right-4 opacity-80' : 'w-48 h-48'} />
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
