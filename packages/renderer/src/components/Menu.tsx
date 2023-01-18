import { useState } from 'react';
import { menuParams } from '../utils/menuParams';
import type { Screens } from '../@types/Screens.type';

type MenuLabelsType = 'add' | 'edit' | 'reports' | 'themes';

interface MenuProps {
  getSelectedScreen: (screen: Screens) => void;
}

export function Menu({getSelectedScreen}: MenuProps) {
  const [menuOpened, setMenuOpened] = useState<MenuLabelsType[]>([]);
  const [selectedScreen, setSelectedScreen] = useState('');

  const selectScreen = (screen: Screens) => {
    getSelectedScreen(screen);
    setSelectedScreen(screen);
  };

  const toggleMenu = (menuLabel: MenuLabelsType) => {
    const menu = [ ...menuOpened ];
    const indexMenuOpened = menu.indexOf(menuLabel);
    if (indexMenuOpened !== -1) {
      menu.splice(indexMenuOpened, 1);
    } else {
      menu.push(menuLabel);
    }
    setMenuOpened(menu);
  };

  return (
    <nav>
      <ul className="w-full text-center">
        {Object.entries(menuParams).map(([menuLabel, {label, items}]) => (
        <li className="relative h-max" key={menuLabel}>
          <button
            className="relative bg-zinc-900 text-zinc-200 w-full h-11 py-2 border-b-2 border-b-zinc-400 hover:bg-teal-500 hover:text-zinc-900 rounded-b-sm z-50"
            onClick={() => toggleMenu(menuLabel as MenuLabelsType)}
          >{label}</button>
          <ul className={`${menuOpened.includes(menuLabel as MenuLabelsType) ? 'opacity-100' : 'absolute transform -translate-y-[1024px] opacity-0'} right-0 w-full z-10 text-zinc-300 transition-opacity duration-200 ease-linear`}>
              {items.map(({ id, label: subLabel }) => (
                <li
                  className={`py-2 ${selectedScreen === id
                    ? 'bg-teal-500 text-zinc-900'
                    : 'bg-zinc-500 text-zinc-200'} border-b-2 border-b-zinc-900 rounded-b-sm cursor-pointer hover:bg-teal-500 hover:text-zinc-900 text-sm`}
                  key={id}
                  onClick={() => selectScreen(id as Screens)}
                >{subLabel}</li>
            ))}
          </ul>
          </li>
      ))}
        </ul>
    </nav>
  );
}
