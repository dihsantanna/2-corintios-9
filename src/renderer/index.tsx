import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import moment from 'moment';
import { App } from './App';
import './styles/global.css';

moment.locale('pt-br');

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(
  <HashRouter>
    <App />
  </HashRouter>,
);
