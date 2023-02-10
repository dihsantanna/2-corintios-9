import { createRoot } from 'react-dom/client';
import { GlobalContextProvider } from './context/GlobalContext/GlobalContextProvider';
import { App } from './App';
import './styles/global.css';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(
  <GlobalContextProvider>
    <App />
  </GlobalContextProvider>
);
