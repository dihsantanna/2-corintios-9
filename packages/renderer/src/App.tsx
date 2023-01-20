import { useState } from 'react';
import { ReactComponent as Logo } from '../assets/logo.svg';
import { Menu } from './components/Menu';
import type { Screens } from './@types/Screens.type';
import { ToastContainer } from 'react-toastify';
import { AddMember } from './components/Add/AddMember';
import { AddTithe } from './components/Add/AddTithe';
import { AddOffer } from './components/Add/AddOffer';
import { AddExpenseCategory } from './components/Add/AddExpenseCategory';
import { AddExpense } from './components/Add/AddExpense';
import { EditMembers } from './components/Edit/EditMembers';
import 'react-toastify/dist/ReactToastify.css';
import { EditTithes } from './components/Edit/EditTithes';
import { EditOffers } from './components/Edit/EditOffers';
import { EditExpenseCategories } from './components/Edit/EditExpenseCategories';

export function App() {
  const [selectedScreen, setSelectedScreen] = useState<Screens>('' as Screens);

  const getSelectedScreen = (screen: Screens) => {
    setSelectedScreen(screen);
  };
  return (
    <div className="flex w-screen h-screen">
      <aside className="border-r-2 border-r-zinc-300 w-1/6 h-screen rounded-r-sm overflow-y-auto">
        <Menu getSelectedScreen={getSelectedScreen} />
      </aside>
      <main className="flex flex-1 justify-center items-center">
        {/*Add Screens*/}
        <AddMember screenSelected={selectedScreen} />
        <AddTithe screenSelected={selectedScreen} />
        <AddOffer screenSelected={selectedScreen} />
        <AddExpenseCategory screenSelected={selectedScreen} />
        <AddExpense screenSelected={selectedScreen} />
        {/*Edit Screens*/}
        <EditMembers screenSelected={selectedScreen} />
        <EditTithes screenSelected={selectedScreen} />
        <EditOffers screenSelected={selectedScreen} />
        <EditExpenseCategories screenSelected={selectedScreen} />
        <Logo
          className={
          (selectedScreen ? 'w-10 h-10 fixed bottom-4 right-4 opacity-80' : 'w-48 h-48')
          + ' transition-all duration-500 ease-in-out'
          }
        />
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
