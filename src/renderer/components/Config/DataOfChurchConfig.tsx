import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { FcDataConfiguration } from 'react-icons/fc';
import { DataOfChurchForm } from './DataOfChurchForm';

interface DataOfChurchConfigProps {
  refreshData: () => void;
}

export function DataOfChurchConfig({ refreshData }: DataOfChurchConfigProps) {
  const [show, setShow] = useState(false);

  const afterSubmit = () => {
    refreshData();
  };

  return (
    <>
      <button
        type="button"
        tabIndex={0}
        className="focus:outline-none focus:bg-teal-500 focus:text-zinc-900 flex items-center bg-zinc-900 rounded-sm
        px-2 py-1 hover:text-zinc-900 hover:bg-teal-500 gap-2"
        onClick={() => setShow(true)}
      >
        Configurar Dados da Igreja
        <FcDataConfiguration className="w-8 h-8" />
      </button>
      <Transition.Root show={show} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setShow(false)}
        >
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
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl">
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="flex flex-col items-center justify-center ">
                      <div className="w-full mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-lg font-medium leading-6 text-gray-900"
                        >
                          Configurar Dados da Igreja
                        </Dialog.Title>
                        <div className="w-full mt-2 flex flex-col items-center justify-center">
                          <DataOfChurchForm
                            setShow={setShow}
                            afterSubmit={afterSubmit}
                          />
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
