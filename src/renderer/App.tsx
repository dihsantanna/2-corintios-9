import { useCallback, useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { FaChurch } from 'react-icons/fa';
import { IPartialBalance } from 'main/@types/Report';
import { ReactComponent as Logo } from './assets/logo.svg';
import { Menu } from './components/Menu';
import type { Screens } from './@types/Screens.type';
import { InitialConfig } from './components/Config/InitialConfig';
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
import { DataOfChurchConfig } from './components/Config/DataOfChurchConfig';
import './styles/reactToastify.css';

const INITIAL_STATE: IPartialBalance = {
  previousBalance: 0.0,
  totalTithes: 0.0,
  totalSpecialOffers: 0.0,
  totalLooseOffers: 0.0,
  totalWithdraws: 0.0,
  totalEntries: 0.0,
  totalExpenses: 0.0,
  totalBalance: 0.0,
};

export interface ChurchData {
  logoSrc: string;
  name: string;
  foundationDate: string;
  cnpj: string;
  street: string;
  number: string;
  district: string;
  city: string;
  state: string;
  cep: string;
}

export function App() {
  const [selectedScreen, setSelectedScreen] = useState<Screens>('' as Screens);
  const [partialBalance, setPartialBalance] = useState<IPartialBalance>({
    ...INITIAL_STATE,
  });
  const [showInitialConfig, setShowInitialConfig] = useState(false);
  const [dataOfChurch, setDataOfChurch] = useState({} as ChurchData);
  const [refresh, setRefresh] = useState(false);

  const setInitialConfig = useCallback(async () => {
    const date = new Date();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const churchData = await window.dataOfChurch.get();
    const balance = await window.report.partial(month, year);

    if (!churchData) {
      setShowInitialConfig(true);
      return;
    }
    setDataOfChurch({
      ...churchData,
      foundationDate: new Date(churchData.foundationDate)
        .toLocaleString('pt-BR')
        .split(' ')[0]
        .split('/')
        .join('/'),
    });
    setPartialBalance(balance);
  }, []);

  useEffect(() => {
    setInitialConfig();
  }, [setInitialConfig]);

  useEffect(() => {
    if (refresh) {
      setInitialConfig();
      setRefresh(false);
    }
  }, [refresh, setInitialConfig]);

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
              <DataOfChurchConfig
                churchData={dataOfChurch}
                refreshData={() => setRefresh(true)}
              />
              <BalanceConfig refreshPartialBalance={() => setRefresh(true)} />
            </div>
            <PartialBalance partialBalance={partialBalance} />
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
        {showInitialConfig && (
          <InitialConfig
            refreshPartialBalance={() => {
              setShowInitialConfig(false);
              setRefresh(true);
            }}
          />
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
        {selectedScreen === 'entriesReport' && (
          <EntriesReport dataOfChurch={dataOfChurch} />
        )}
        {selectedScreen === 'outputReport' && (
          <OutputReport dataOfChurch={dataOfChurch} />
        )}
        {selectedScreen === 'generalReport' && (
          <GeneralReport dataOfChurch={dataOfChurch} />
        )}

        {/* Logo */}
        {dataOfChurch.logoSrc ? (
          <img
            src={dataOfChurch.logoSrc}
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
