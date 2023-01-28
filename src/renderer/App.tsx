import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { FaChurch } from 'react-icons/fa';
import { ReactComponent as Logo } from './assets/logo.svg';
import { Menu } from './components/Menu';
import type { Screens } from './@types/Screens.type';
import { AddMember } from './components/Add/AddMember';
import { AddTithe } from './components/Add/AddTithe';
import { AddOffer } from './components/Add/AddOffer';
// import { AddExpenseCategory } from './components/Add/AddExpenseCategory';
// import { AddExpense } from './components/Add/AddExpense';
// import { EditMembers } from './components/Edit/EditMembers';
// import { EditTithes } from './components/Edit/EditTithes';
// import { EditOffers } from './components/Edit/EditOffers';
// import { EditExpenseCategories } from './components/Edit/EditExpenseCategories';
// import { EditExpenses } from './components/Edit/EditExpenses';
// import { EntriesReport } from './components/Report/EntriesReport';
// import { OutputReport } from './components/Report/OutputReport';
// import { GeneralReport } from './components/Report/GeneralReport';
// import { BalanceConfig } from './components/BalanceConfig';
import './styles/reactToastify.css';

export function App() {
  const [selectedScreen, setSelectedScreen] = useState<Screens>('' as Screens);

  return (
    <div className="flex w-screen h-screen">
      <aside className="border-r-2 border-r-zinc-300 w-1/6 h-screen rounded-r-sm overflow-y-auto">
        <Menu
          setSelectedScreen={setSelectedScreen}
          selectedScreen={selectedScreen}
        />
      </aside>
      <main className="flex flex-1 justify-center items-center w-5/6">
        {/* {!selectedScreen && <BalanceConfig />} */}

        {/* Add Screens */}
        {selectedScreen === 'addMember' && <AddMember />}
        {selectedScreen === 'addTithe' && <AddTithe />}
        {selectedScreen === 'addOffer' && <AddOffer />}
        {/* {selectedScreen === 'addExpenseCategory' && <AddExpenseCategory />} */}
        {/* {selectedScreen === 'addExpense' && <AddExpense />} */}

        {/* Edit Screens */}
        {/* {selectedScreen === 'editMembers' && <EditMembers />}
        {selectedScreen === 'editTithes' && <EditTithes />}
        {selectedScreen === 'editOffers' && <EditOffers />}
        {selectedScreen === 'editExpenseCategories' && <EditExpenseCategories />}
        {selectedScreen === 'editExpenses' && <EditExpenses />} */}

        {/* Report Screens */}
        {/* {selectedScreen === 'entriesReport' && <EntriesReport />}
        {selectedScreen === 'outputReport' && <OutputReport />}
        {selectedScreen === 'generalReport' && <GeneralReport />} */}

        <Logo
          className={`${
            selectedScreen
              ? 'w-10 h-10 fixed bottom-4 right-4 opacity-80'
              : 'w-48 h-48'
          } transition-all duration-500 ease-in-out`}
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
      {selectedScreen && (
        <button
          tabIndex={0}
          type="button"
          className="focus:outline-none focus:text-teal-500 text-zinc-900  hover:text-teal-500 fixed top-2 right-12 cursor-pointer"
          onClick={() => setSelectedScreen('' as Screens)}
        >
          <FaChurch title="Voltar para tela inicial" className="w-14 h-14" />
        </button>
      )}
    </div>
  );
}
