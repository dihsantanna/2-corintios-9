import { useState } from 'react';
import { ReactComponent as Logo } from '../assets/logo.svg';
import { Menu } from './components/Menu';
import type { Screens } from './@types/Screens.type';

export function App() {
  const [selectedScreen, setSelectedScreen] = useState<Screens>('' as Screens);

  const getSelectedScreen = (screen: Screens) => {
    setSelectedScreen(screen);
  };
  return (
    <div className="grid grid-cols-2 col-span-1 w-screen h-screen items-center justify-center">
      <aside className="border-r-2 border-r-zinc-300 w-1/3 h-screen rounded-r-md overflow-y-auto">
        <Menu getSelectedScreen={getSelectedScreen} />
      </aside>
      <main>
        <Logo className="w-48 h-48" />
        {selectedScreen}
      </main>
    </div>
  );
}
