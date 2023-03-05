import { Route, Routes, redirect } from 'react-router-dom';
import { AddExpense } from './components/Add/AddExpense';
import { AddExpenseCategory } from './components/Add/AddExpenseCategory';
import { AddMember } from './components/Add/AddMember';
import { AddOffer } from './components/Add/AddOffer';
import { AddTithe } from './components/Add/AddTithe';
import { AddWithdrawToTheBankAccount } from './components/Add/AddWithdrawToTheBankAccount';
import { EditExpenseCategories } from './components/Edit/EditExpenseCategories';
import { EditExpenses } from './components/Edit/EditExpenses';
import { EditMembers } from './components/Edit/EditMembers';
import { EditOffers } from './components/Edit/EditOffers';
import { EditTithes } from './components/Edit/EditTithes';
import { EditWithdrawsToTheBankAccount } from './components/Edit/EditWithdrawsToTheBankAccount';
import { EntriesReport } from './components/Report/EntriesReport';
import { GeneralReport } from './components/Report/GeneralReport';
import { OutputReport } from './components/Report/OutputReport';
import { GlobalContextProvider } from './context/GlobalContext/GlobalContextProvider';
import { Home } from './Home';

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<GlobalContextProvider />}>
        <Route path="home" element={<Home />} />
        <Route path="addMember" element={<AddMember />} />
        <Route path="addTithe" element={<AddTithe />} />
        <Route path="addOffer" element={<AddOffer />} />
        <Route path="addExpenseCategory" element={<AddExpenseCategory />} />
        <Route path="addExpense" element={<AddExpense />} />
        <Route
          path="addWithdrawToTheBankAccount"
          element={<AddWithdrawToTheBankAccount />}
        />
        <Route path="editMembers" element={<EditMembers />} />
        <Route path="editTithes" element={<EditTithes />} />
        <Route path="editOffers" element={<EditOffers />} />
        <Route
          path="editExpenseCategories"
          element={<EditExpenseCategories />}
        />
        <Route path="editExpenses" element={<EditExpenses />} />
        <Route
          path="editWithdrawsToTheBankAccount"
          element={<EditWithdrawsToTheBankAccount />}
        />
        <Route path="entriesReport" element={<EntriesReport />} />
        <Route path="outputReport" element={<OutputReport />} />
        <Route path="generalReport" element={<GeneralReport />} />
      </Route>
    </Routes>
  );
}
