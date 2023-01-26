import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import { FilterByMonthAndYear } from './FilterByMonthAndYear';
import { SubmitButton } from './SubmitButton';
import { ResetButton } from './ResetButton';
import { toast } from 'react-toastify';
import { findBalanceById, upsertBalance } from '#preload';
import { FcDataConfiguration } from 'react-icons/fc';
import { IoCloseSharp } from 'react-icons/io5';

export function BalanceConfig() {
  const [show, setShow] = useState(false);
  const [referenceMonth, setReferenceMonth] = useState(new Date().getMonth() + 1);
  const [referenceYear, setReferenceYear] = useState(new Date().getFullYear());
  const [defaultBalance, setDefaultBalance] = useState({
    value: 0,
    referenceMonth: new Date().getMonth() + 1,
    referenceYear: new Date().getFullYear(),
  });
  const [balance, setBalance] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    findBalanceById('INITIAL_BALANCE').then((balance) => {
      if (balance) {
        setDefaultBalance(balance);
        setBalance(balance.value.toFixed(2));
        setReferenceMonth(balance.referenceMonth);
        setReferenceYear(balance.referenceYear);
      }
    });
  }, []);

  const handleBalanceInputChange = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    const validateValue = /^(\d+)(\.|,)?(\d{0,2}$)/.test(value) || value === '';
    if (!validateValue) return;

    const valueEdit = value.match(/\d|\.|,/g) || '';
    const newValue = valueEdit.length ? [...valueEdit].join('') : '';

      setBalance(newValue.replace(',', '.'));
  };

  const handleBalanceInputBlur = ({ target: { value } }: React.FocusEvent<HTMLInputElement>) => {
    const newValue = value ? parseFloat(value).toFixed(2) : '';

    setBalance(newValue);
  };

  const validate = (balance: number, referenceMonth: number, referenceYear: number) => {
    if (balance < 0) {
      toast.error('Informe o saldo inicial!', {
        progress: undefined,
      });
      return false;
    }

    if (!referenceMonth) {
      toast.error('Por favor selecione o mês', {
        progress: undefined,
      });
      return false;
    }

    if (!referenceYear) {
      toast.error('Por favor selecione o ano', {
        progress: undefined,
      });
      return false;
    }

    return true;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const floatValue = parseFloat(balance);

    if (!validate(floatValue, referenceMonth, referenceYear)) return;

    setLoading(true);
    upsertBalance({
      id: 'INITIAL_BALANCE',
      value: floatValue,
      referenceMonth,
      referenceYear,
    }).then(() => {
      toast.success('Saldo inicial configurado com sucesso!', {
        progress: undefined,
      });
    }).catch((err) => {
      toast.error(`Erro ao configurar saldo inicial: ${err}`, {
        progress: undefined,
      });
    }).finally(() => {
      setDefaultBalance({
        value: floatValue,
        referenceMonth,
        referenceYear,
      });
      setLoading(false);
      setShow(false);
    });

  };

  const handleReset = (event: React.FormEvent<HTMLFormElement | HTMLButtonElement>) => {
    event.preventDefault();
    setBalance(defaultBalance.value.toFixed(2));
    setReferenceMonth(defaultBalance.referenceMonth);
    setReferenceYear(defaultBalance.referenceYear);
    setShow(false);
  };

  return (
    <>
      <button
        tabIndex={0}
        className="focus:outline-none focus:bg-teal-500 focus:text-zinc-900 flex items-center fixed top-4 right-6 bg-zinc-900 rounded-sm
        px-2 py-1 hover:text-zinc-900 hover:bg-teal-500"
        onClick={() => setShow(true)}
      >
        Configurar Saldo Inicial
        <FcDataConfiguration className="w-8 h-8" />
      </button>
      <Transition.Root show={show} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setShow(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <button
                      title='Fechar menu de configuração de saldo inicial'
                      type='reset'
                      className="focus:outline-none focus:text-red-600 cursor-pointer absolute top-2 right-2 text-zinc-900 hover:text-red-600"
                      onClick={handleReset}
                    >
                      <IoCloseSharp
                      className="w-6 h-6"
                      />
                    </button>
                    <div className="flex flex-col items-center justify-center ">
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                          Configurara Saldo Inicial
                        </Dialog.Title>
                        <div className="mt-2 flex flex-col items-center justify-center">
                          <form
                            onSubmit={handleSubmit}
                            onReset={handleReset}
                            className="text-sm text-zinc-600 flex flex-col items-center justify-center"
                          >
                            <div>
                              Selecione o mês e ano de referência:
                              <FilterByMonthAndYear
                                monthValue={referenceMonth}
                                yearValue={referenceYear}
                                setReferenceMonth={setReferenceMonth}
                                setReferenceYear={setReferenceYear}
                              />
                            </div>
                            <label className="flex items-center bg-zinc-900 p-2 border-l-4 border-teal-500 rounded-sm w-full text-zinc-200 text-sm">
                              R$
                              <input
                                className="focus:outline-2 focus:outline-teal-500 bg-zinc-900 placeholder:text-zinc-200 focus:outline-none block w-full appearance-none leading-normal pl-2"
                                title="Valor do Saldo Inicial"
                                name="balance"
                                placeholder="Digite o saldo inicial"
                                onChange={handleBalanceInputChange}
                                onBlur={handleBalanceInputBlur}
                                value={balance}
                              />
                            </label>
                            <div className="bg-gray-50 pt-6 gap-2 flex w-full text-zinc-200">
                              <SubmitButton
                                className="w-1/2 h-8"
                                text="SALVAR"
                                isLoading={loading}
                                title="Salvar saldo inicial"
                              />
                              <ResetButton
                                title="Cancelar configuração de saldo inicial"
                                className="w-1/2 h-8"
                                text="CANCELAR"
                              />
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
