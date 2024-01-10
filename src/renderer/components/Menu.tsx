import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BsArrowBarUp } from 'react-icons/bs';
import { menuParams } from '../utils/menuParams';
import type { Screens } from '../@types/Screens.type';

type MenuLabelsType = 'add' | 'edit' | 'reports' | 'themes';

interface MenuProps {
  selectedScreen: Screens | '';
}

export function Menu({ selectedScreen }: MenuProps) {
  const [menuOpened, setMenuOpened] = useState<MenuLabelsType[]>([]);

  const toggleMenu = (menuLabel: MenuLabelsType) => {
    const menu = [...menuOpened];
    const indexMenuOpened = menu.indexOf(menuLabel);
    if (indexMenuOpened !== -1) {
      menu.splice(indexMenuOpened, 1);
    } else {
      menu.push(menuLabel);
    }
    setMenuOpened(menu);
  };

  return (
    <nav className="overflow-y-auto scrollbar-thin min-h-screen max-h-screen min-w-max pr-[2px]">
      <ul className="w-full text-center relative">
        {Object.entries(menuParams).map(([menuLabel, { label, items }]) => (
          <li
            title={`Abrir menu ${label}`}
            className="relative h-max"
            key={menuLabel}
          >
            <button
              type="button"
              className={`relative focus:outline-none ${
                menuOpened.indexOf(menuLabel as MenuLabelsType) === -1
                  ? 'focus:bg-teal-500 focus:text-zinc-900'
                  : 'focus:bg-yellow-500 focus:text-zinc-900'
              } bg-zinc-900 text-zinc-200 w-full h-11 py-2 border-b-2 border-b-zinc-700 ${
                menuOpened.indexOf(menuLabel as MenuLabelsType) === -1
                  ? 'hover:bg-teal-500 hover:text-zinc-900'
                  : 'hover:bg-yellow-500 hover:text-zinc-900'
              } rounded-b-sm z-50`}
              onClick={() => toggleMenu(menuLabel as MenuLabelsType)}
            >
              {label}
            </button>
            <ul
              className={`${
                menuOpened.includes(menuLabel as MenuLabelsType)
                  ? 'opacity-100'
                  : 'invisible absolute transform -translate-y-[1024px] opacity-0'
              } right-0 w-full z-10 text-zinc-300 transition-opacity duration-200 ease-linear`}
            >
              {items.map(({ id, label: subLabel }) => (
                <li
                  title={subLabel}
                  className={`${
                    selectedScreen === id
                      ? 'bg-teal-500 text-zinc-900'
                      : 'bg-zinc-300 text-zinc-900'
                  } border-b-2 border-b-zinc-900 rounded-b-sm cursor-pointer hover:bg-teal-500 hover:text-zinc-900 text-sm`}
                  key={id}
                >
                  <Link
                    type="button"
                    to={id}
                    className="w-full h-full py-2 focus:outline-none focus:bg-teal-500 focus:text-zinc-900"
                  >
                    {subLabel}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
        <button
          type="button"
          title="Fechar todos os menus"
          className={`focus:outline-teal-500 focus:outline-4 disabled:cursor-not-allowed absolute -bottom-9 w-full flex items-center justify-center h-9 ${
            menuOpened.length && 'hover:animate-pulse active:animate-bounce'
          } z-50`}
          onClick={() => setMenuOpened([])}
          disabled={!menuOpened.length}
        >
          <BsArrowBarUp className="w-7 h-7 text-zinc-700 z-40" />
        </button>
      </ul>
    </nav>
  );
}
