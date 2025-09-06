import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { EditForm } from './EditForm';
import { FilterByMonthAndYear } from '../FilterByMonthAndYear';
import { LogoChurch } from '../LogoChurch';
import { useGlobalContext } from '../../context/GlobalContext/GlobalContextProvider';

interface OtherEntry {
  id: string;
  title: string;
  value: string;
  description?: string | null;
  referenceMonth: number;
  referenceYear: number;
}

export function EditOtherEntries() {
  const [defaultOtherEntries, setDefaultOtherEntries] = useState<OtherEntry[]>(
    [],
  );
  const [otherEntries, setOtherEntries] = useState<OtherEntry[]>([]);
  const [editing, setEditing] = useState('');
  const [loading, setLoading] = useState(false);

  const { setRefreshPartialBalance, referenceDate } = useGlobalContext();

  useEffect(() => {
    const { month, year } = referenceDate;
    const getOtherEntries = async () => {
      setLoading(true);
      try {
        const newEntries = await window.otherEntry.findAllByReferences(
          month,
          year,
        );
        const toFixedEntries = newEntries.map((entry) => ({
          ...entry,
          value: (entry.value as number).toFixed(2),
        }));
        setOtherEntries(toFixedEntries);
        setDefaultOtherEntries(toFixedEntries);
      } catch (err) {
        toast.error(`Erro ao carregar entradas: ${(err as Error).message}`, {
          progress: undefined,
        });
      } finally {
        setLoading(false);
      }
    };

    if (month !== 0 && year !== 0) getOtherEntries();
  }, [referenceDate]);

  const handleReset = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setOtherEntries(defaultOtherEntries);
    setEditing('');
  };

  const valueChangeReplace = (value: string, entry: OtherEntry) => {
    const validateValue = /^(\d+)(\.|,)?(\d{0,2}$)/.test(value) || value === '';
    if (!validateValue) return `${entry.value}`;

    return value.replace(',', '.');
  };

  const handleChange = (
    {
      target: { name, value },
    }: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
    entry: OtherEntry,
  ) => {
    const key = name as keyof OtherEntry;
    const newEntry = {
      ...entry,
      [key]: name === 'value' ? valueChangeReplace(value, entry) : value,
    } as OtherEntry;

    const newEntries = otherEntries.map((item) =>
      item.id === entry.id ? newEntry : item,
    );

    setOtherEntries(newEntries);
  };

  const handleValueInputBlur = (
    { target: { value } }: React.FocusEvent<HTMLInputElement>,
    entry: OtherEntry,
  ) => {
    const newValue = value ? parseFloat(value).toFixed(2) : '';
    const newEntry = {
      ...entry,
      value: newValue,
    };

    const newEntries = otherEntries.map((item) =>
      item.id === entry.id ? newEntry : item,
    );

    setOtherEntries(newEntries);
  };

  const handleSetEditing = (id: string) => {
    setEditing(id);
    setOtherEntries(defaultOtherEntries);
  };

  const handleEdit = async (
    event: React.FormEvent<HTMLFormElement>,
    id: string,
  ) => {
    event.preventDefault();
    const editedEntry = otherEntries.find(
      (entry) => entry.id === id,
    ) as OtherEntry;
    if (editedEntry === defaultOtherEntries.find((entry) => entry.id === id)) {
      toast.warn('Faça alguma modificação ou clique em fechar para cancelar', {
        progress: undefined,
      });
      return;
    }

    const floatValue = parseFloat(editedEntry.value as string);

    if (floatValue <= 0) {
      toast.warn('Valor deve ser maior que zero', {
        progress: undefined,
      });
      return;
    }

    if (editedEntry.title.length < 4) {
      toast.warn('O Título da entrada deve possuir pelo menos 4 caracteres', {
        progress: undefined,
      });
      return;
    }

    setLoading(true);
    try {
      await window.otherEntry.update({
        id: editedEntry.id,
        title: editedEntry.title,
        value: floatValue,
        description: editedEntry?.description || '',
        referenceMonth: editedEntry.referenceMonth,
        referenceYear: editedEntry.referenceYear,
      });
      toast.success('Entrada alterada com sucesso!', {
        progress: undefined,
      });
      setDefaultOtherEntries(otherEntries);
      setRefreshPartialBalance(true);
    } catch (err) {
      toast.error(`Erro ao editar entrada: ${(err as Error).message}`, {
        progress: undefined,
      });
    } finally {
      setLoading(false);
      setEditing('');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await window.otherEntry.delete(id);

      const newEntries = otherEntries.filter((entry) => entry.id !== id);
      setOtherEntries(newEntries);
      setDefaultOtherEntries(newEntries);

      toast.success('Entrada excluída com sucesso!', {
        progress: undefined,
      });
    } catch (err) {
      toast.error(`Erro ao excluir entrada: ${(err as Error).message}`, {
        progress: undefined,
      });
    }
  };

  return (
    <>
      <div className="flex flex-col items-center w-full h-full">
        <h1 className="flex items-center font-semibold text-2xl text-zinc-900 h-20">
          Editar Outras Despesas
        </h1>
        <div className="flex items-center gap-2 w-full px-4 mb-2">
          <FilterByMonthAndYear />
        </div>
        <div className="flex w-full h-10 items-center justify-between border-y border-zinc-300 text-zinc-900">
          <span className="w-3/12 flex items-center ml-2">Título</span>
          <span className="w-3/12 flex items-center">Descrição</span>
          <span className="w-1/12 flex items-center">Valor (R$)</span>
          <span className="w-2/6 flex items-center justify-center">Editar</span>
        </div>
        <div className="w-full h-full flex flex-col overflow-auto scrollbar-thin scrollbar-thumb-zinc-900 scrollbar-track-zinc-300">
          {!otherEntries.length ? (
            <span className="m-auto text-zinc-500">
              Não há entrada cadastradas para o mês e ano selecionados!
            </span>
          ) : (
            otherEntries.map(
              (
                {
                  id,
                  title,
                  value,
                  description = '',
                  referenceMonth: month,
                  referenceYear: year,
                },
                index,
              ) => (
                <EditForm
                  key={id}
                  handleSubmit={(event) => handleEdit(event, id)}
                  handleReset={handleReset}
                  isLoading={loading}
                  editingId={id}
                  isEditing={editing === id}
                  setIsEditing={handleSetEditing}
                  className={index % 2 === 0 ? 'bg-zinc-100' : ''}
                  onDelete={() => handleDelete(id)}
                  deleteMessage={`Tem certeza que deseja excluir esta entrada, no valor de "R$ ${value}"? Esta ação não poderá ser desfeita. Clique em "SIM" para confirmar.`}
                  deleteTitle="Excluir Entrada"
                  editType="entrada"
                >
                  <label className="w-3/12 flex items-center ml-2 text-zinc-900">
                    <input
                      required
                      title="Título da Entrada"
                      name="title"
                      value={title}
                      onChange={(event) =>
                        handleChange(event, {
                          id,
                          title,
                          value,
                          description,
                          referenceMonth: month,
                          referenceYear: year,
                        })
                      }
                      className="text-zinc-200 bg-zinc-900 disabled:p-0 disabled:text-zinc-900 disabled:bg-transparent font-light disabled:font-normal block w-11/12 h-full disabled:appearance-none leading-normal rounded-sm"
                      disabled={editing !== id}
                    />
                  </label>
                  <label className="w-3/12 flex items-center text-zinc-900">
                    {editing !== id ? (
                      <div className="w-full break-words max-h-12 overflow-y-auto">
                        {description}
                      </div>
                    ) : (
                      <textarea
                        title="Descrição da Entrada"
                        name="description"
                        className="px-1 text-zinc-200 bg-zinc-900 font-light block w-11/12 h-full leading-normal rounded-sm resize-none border-2 border-transparent focus:border-teal-500 outline-none"
                        value={description || ''}
                        onChange={(event) => {
                          handleChange(event, {
                            id,
                            title,
                            value,
                            description,
                            referenceMonth: month,
                            referenceYear: year,
                          });
                        }}
                        rows={2}
                      />
                    )}
                  </label>
                  <label className="w-1/12 flex items-center text-zinc-900">
                    <input
                      required
                      title="Valor da entrada"
                      name="value"
                      value={value}
                      onChange={(event) =>
                        handleChange(event, {
                          id,
                          title,
                          value,
                          description,
                          referenceMonth: month,
                          referenceYear: year,
                        })
                      }
                      onBlur={(event) =>
                        handleValueInputBlur(event, {
                          id,
                          title,
                          value,
                          description,
                          referenceMonth: month,
                          referenceYear: year,
                        })
                      }
                      className="text-zinc-200 bg-zinc-900 disabled:p-0 disabled:text-zinc-900 disabled:bg-transparent font-light disabled:font-normal block w-11/12 h-full disabled:appearance-none leading-normal rounded-sm"
                      disabled={editing !== id}
                    />
                  </label>
                </EditForm>
              ),
            )
          )}
        </div>
      </div>
      <LogoChurch />
    </>
  );
}
