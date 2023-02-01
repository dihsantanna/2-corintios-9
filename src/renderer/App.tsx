import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { FaChurch } from 'react-icons/fa';
import { ReactComponent as Logo } from './assets/logo.svg';
import { Menu } from './components/Menu';
import type { Screens } from './@types/Screens.type';
import { PartialBalance } from './components/PartialBalance';
import { AddMember } from './components/Add/AddMember';
import { AddTithe } from './components/Add/AddTithe';
import { AddOffer } from './components/Add/AddOffer';
import { AddExpenseCategory } from './components/Add/AddExpenseCategory';
import { AddExpense } from './components/Add/AddExpense';
import { AddWithdrawToTheBankAccount } from './components/Add/AddWithdrawToTheBankAccount';
import { EditMembers } from './components/Edit/EditMembers';
import { EditTithes } from './components/Edit/EditTithes';
import { EditOffers } from './components/Edit/EditOffers';
import { EditExpenseCategories } from './components/Edit/EditExpenseCategories';
import { EditExpenses } from './components/Edit/EditExpenses';
import { EditWithdrawToTheBankAccount } from './components/Edit/EditWithdrawToTheBankAccount';
import { EntriesReport } from './components/Report/EntriesReport';
import { OutputReport } from './components/Report/OutputReport';
import { GeneralReport } from './components/Report/GeneralReport';
import { BalanceConfig } from './components/Config/BalanceConfig';
import './styles/reactToastify.css';

export function App() {
  const [selectedScreen, setSelectedScreen] = useState<Screens>('' as Screens);
  const [refreshPartialBalance, setRefreshPartialBalance] = useState(false);

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
            <BalanceConfig
              refreshPartialBalance={() => setRefreshPartialBalance(true)}
            />
            <PartialBalance
              refresh={refreshPartialBalance}
              refreshed={() => setRefreshPartialBalance(false)}
            />
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

        {/* Add Screens */}
        {selectedScreen === 'addMember' && <AddMember />}
        {selectedScreen === 'addTithe' && <AddTithe />}
        {selectedScreen === 'addOffer' && <AddOffer />}
        {selectedScreen === 'addExpenseCategory' && <AddExpenseCategory />}
        {selectedScreen === 'addExpense' && <AddExpense />}
        {selectedScreen === 'addWithdrawToAccount' && (
          <AddWithdrawToTheBankAccount />
        )}

        {/* Edit Screens */}
        {selectedScreen === 'editMembers' && <EditMembers />}
        {selectedScreen === 'editTithes' && <EditTithes />}
        {selectedScreen === 'editOffers' && <EditOffers />}
        {selectedScreen === 'editExpenseCategories' && (
          <EditExpenseCategories />
        )}
        {selectedScreen === 'editExpenses' && <EditExpenses />}
        {selectedScreen === 'editWithdrawToAccount' && (
          <EditWithdrawToTheBankAccount />
        )}

        {/* Report Screens */}
        {selectedScreen === 'entriesReport' && <EntriesReport />}
        {selectedScreen === 'outputReport' && <OutputReport />}
        {selectedScreen === 'generalReport' && <GeneralReport />}

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
    </div>
  );
}
