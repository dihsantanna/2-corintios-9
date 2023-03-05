import { useGlobalContext } from '../context/GlobalContext/GlobalContextProvider';
import { ReactComponent as Logo } from '../assets/logo.svg';

interface LogoChurchProps {
  isHome?: boolean;
}

export function LogoChurch({ isHome }: LogoChurchProps) {
  const { logoSrc } = useGlobalContext();
  return (
    <>
      {logoSrc ? (
        <img
          src={logoSrc}
          alt="Logo"
          className={`${
            isHome ? 'w-[200px]' : 'w-12 fixed bottom-4 right-4 opacity-80'
          } transition-all duration-500 ease-in-out`}
        />
      ) : (
        <Logo
          className={`${
            isHome ? 'w-[200px]' : 'w-12 fixed bottom-4 right-4 opacity-80'
          } transition-all duration-500 ease-in-out`}
        />
      )}
    </>
  );
}
