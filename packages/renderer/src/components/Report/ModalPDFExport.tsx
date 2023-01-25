import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useRef, useState } from 'react';
import { FaFilePdf } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { BsCheckCircleFill } from 'react-icons/bs';
import { months } from '/@/utils/months';

interface ModalPDFExportProps {
  reportToPdf: () => Promise<Buffer | undefined>;
  title: string;
  referenceMonth: number;
  referenceYear: number;
}

type MonthKey = keyof typeof months;

export function ModalPDFExport({
  reportToPdf,
  title,
  referenceMonth,
  referenceYear,
}: ModalPDFExportProps) {
  const [show, setShow] = useState(false);
  const [pdf, setPdf] = useState<Blob>(new Blob());
  const [loading, setLoading] = useState(false);

  const cancelButtonRef = useRef(null);

  const showPdf = async () => {
    try {
      setLoading(true);
      const report = await reportToPdf();
      if (report) {
        const blob = new Blob([report], { type: 'application/pdf' });
        setPdf(blob);
        setShow(true);
        return;
      }
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="absolute top-2 left-4 z-10">
        {!loading ? (
          <FaFilePdf
            className="relative w-10 h-10 z-30 cursor-pointer fill-zinc-700 hover:fill-red-600"
            title="Gerar PDF"
            onClick={showPdf}
          />
        )
          : (
            <span className="animate-ping mt-2 text-zinc-900">
              Gerando PDF do {title} ...
          </span>
        )}
      </div>
      <Transition.Root
        show={show}
        as={Fragment}
      >
        <Dialog
          as="div"
          className="relative z-50"
          initialFocus={cancelButtonRef}
          onClose={setShow}
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
            <div className="flex min-h-full items-end justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4"
                enterTo="opacity-100 translate-y-0"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-4"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all m-auto">
                  <div className="bg-white px-4 pt-5 pb-4">
                    <div>
                      <div className="mt-3 text-center">
                        <Dialog.Title
                          as="h3"
                          className="text-lg font-medium leading-6 text-gray-900"
                        >
                          {title}
                        </Dialog.Title>
                        <BsCheckCircleFill className="w-10 h-10 text-green-500 mx-auto my-3" />
                        <span className="text-zinc-600 text-base text-center">
                          Relatório Gerado com Sucesso.
                          <br />
                          Clique em Exportar para salvar.
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 flex justify-around gap-2">
                    <a
                      className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-green-500 px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-green-600"
                      href={URL.createObjectURL(pdf)}
                      download={
                        `${title} ${months[referenceMonth as MonthKey]}-${referenceYear}.pdf`
                      }
                      onClick={() => setShow(false)}
                    >
                      Exportar
                    </a>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                      onClick={() => setShow(false)}
                      ref={cancelButtonRef}
                    >
                      Fechar
                    </button>
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
