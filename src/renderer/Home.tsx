import { BalanceConfig } from './components/Config/BalanceConfig';
import { DataOfChurchConfig } from './components/Config/DataOfChurchConfig';
import { InitialConfig } from './components/Config/InitialConfig';
import { FilterByMonthAndYear } from './components/FilterByMonthAndYear';
import { LogoChurch } from './components/LogoChurch';
import { PartialBalance } from './components/PartialBalance';
import { useGlobalContext } from './context/GlobalContext/GlobalContextProvider';

export function Home() {
  const { showInitialConfig } = useGlobalContext();

  return (
    <>
      {showInitialConfig && <InitialConfig />}
      <div className="flex flex-col grow-1 flex-1 p-4 h-full items-center">
        <div className="flex gap-6 w-full h-max">
          <div className="flex-1">
            <FilterByMonthAndYear />
          </div>
          <div>
            <DataOfChurchConfig />
          </div>
          <div>
            <BalanceConfig />
          </div>
        </div>
        <PartialBalance />
        <div className="m-auto">
          <LogoChurch isHome />
        </div>
      </div>
    </>
  );
}
