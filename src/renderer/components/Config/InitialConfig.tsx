import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { DataOfChurchForm } from './DataOfChurchForm';
import { BalanceConfigForm } from './BalanceConfigForm';

export function InitialConfig() {
  const [show, setShow] = useState(true);
  const [toBalanceConfig, setToBalanceConfig] = useState(false);

  return (
    <Transition.Root show={show} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => {}}>
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
              <Dialog.Panel
                className={`relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full ${
                  toBalanceConfig ? 'sm:max-w-lg' : 'sm:max-w-4xl'
                }`}
              >
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex flex-col items-center">
                    <div className="w-full mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        {toBalanceConfig
                          ? 'Informe o Balanço Inicial'
                          : 'Informe os Dados da Igreja'}
                      </Dialog.Title>
                      <div className="w-full mt-2 flex flex-col items-center justify-center">
                        {toBalanceConfig ? (
                          <BalanceConfigForm
                            setShow={setShow}
                            isInitialConfig
                          />
                        ) : (
                          <DataOfChurchForm
                            isInitialConfig
                            setToBalanceConfig={setToBalanceConfig}
                          />
                        )}
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
  );
}
