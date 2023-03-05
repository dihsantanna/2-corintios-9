import { BalanceConfig } from './components/Config/BalanceConfig';
import { DataOfChurchConfig } from './components/Config/DataOfChurchConfig';
import { InitialConfig } from './components/Config/InitialConfig';
import { LogoChurch } from './components/LogoChurch';
import { PartialBalance } from './components/PartialBalance';
import { useGlobalContext } from './context/GlobalContext/GlobalContextProvider';

export function Home() {
  const { showInitialConfig } = useGlobalContext();
  return (
    <>
      {showInitialConfig && <InitialConfig />}
      <>
        <div className="fixed top-4 right-4 flex items-center gap-6">
          <DataOfChurchConfig />
          <BalanceConfig />
        </div>
        <PartialBalance />
        <LogoChurch isHome />
      </>
    </>
  );
}
