import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { EditForm } from './EditForm';
import { FilterByMonthAndYear } from '../FilterByMonthAndYear';
import { LogoChurch } from '../LogoChurch';
import { useGlobalContext } from '../../context/GlobalContext/GlobalContextProvider';

interface TitheStateWithMemberName {
  id: string;
  memberId: string;
  memberName: string;
  value: string;
  referenceMonth: number;
  referenceYear: number;
}

export function EditTithes() {
  const [defaultTithes, setDefaultTithes] = useState<
    TitheStateWithMemberName[]
  >([]);
  const [tithes, setTithes] = useState<TitheStateWithMemberName[]>([]);
  const [editing, setEditing] = useState('');
  const [loading, setLoading] = useState(false);
  const [referenceMonth, setReferenceMonth] = useState(
    new Date().getMonth() + 1
  );
  const [referenceYear, setReferenceYear] = useState(new Date().getFullYear());

  const { setRefreshPartialBalance } = useGlobalContext();

  useEffect(() => {
    const getTithes = async () => {
      try {
        setLoading(true);
        const newTithes = await window.tithe.findAllByReferencesWithMemberName(
          referenceMonth,
          referenceYear
        );
        const toFixedTithes = newTithes.map((tithe) => ({
          ...tithe,
          value: tithe.value.toFixed(2),
        }));
        setTithes(toFixedTithes);
        setDefaultTithes(toFixedTithes);
      } catch (err) {
        toast.error(`Erro ao buscar dízimos: ${(err as Error).message}`, {
          progress: undefined,
        });
      } finally {
        setLoading(false);
      }
    };

    if (referenceMonth !== 0 && referenceYear !== 0) getTithes();
  }, [referenceMonth, referenceYear]);

  const handleReset = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTithes(defaultTithes);
    setEditing('');
  };

  const valueChangeReplace = (value: string, index: number) => {
    const validateValue = /^(\d+)(\.|,)?(\d{0,2}$)/.test(value) || value === '';
    if (!validateValue) return `${tithes[index].value}`;

    return value.replace(',', '.');
  };

  const handleChange = (
    {
      target: { name, value },
    }: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index: number
  ) => {
    const key = name as keyof TitheStateWithMemberName;
    const newTithe = {
      ...tithes[index],
      [key]: name === 'value' ? valueChangeReplace(value, index) : value,
    } as TitheStateWithMemberName;

    const newTithes = [...tithes];
    newTithes.splice(index, 1, newTithe);

    setTithes(newTithes);
  };

  const handleValueInputBlur = (
    { target: { value } }: React.FocusEvent<HTMLInputElement>,
    index: number
  ) => {
    const newValue = value ? parseFloat(value).toFixed(2) : '';
    const newTithe = {
      ...tithes[index],
      value: newValue,
    };

    const newTithes = [...tithes];
    newTithes.splice(index, 1, newTithe);

    setTithes(newTithes);
  };

  const handleSetEditing = (id: string) => {
    setEditing(id);
    setTithes(defaultTithes);
  };

  const handleEdit = async (
    event: React.FormEvent<HTMLFormElement>,
    index: number
  ) => {
    event.preventDefault();
    const editedTithe = tithes[index];
    if (editedTithe === defaultTithes[index]) {
      toast.warn('Faça alguma modificação ou clique em fechar para cancelar', {
        progress: undefined,
      });
      return;
    }

    const floatValue = parseFloat(editedTithe.value as string);

    if (floatValue <= 0) {
      toast.warn('Valor deve ser maior que zero', {
        progress: undefined,
      });
      return;
    }

    setLoading(true);
    try {
      await window.tithe.update({
        id: editedTithe.id,
        memberId: editedTithe.memberId,
        value: floatValue,
        referenceMonth: editedTithe.referenceMonth,
        referenceYear: editedTithe.referenceYear,
      });
      toast.success('Dízimo alterado com sucesso!', {
        progress: undefined,
      });
      setDefaultTithes(tithes);
      setRefreshPartialBalance(true);
    } catch (err) {
      toast.error(`Erro ao editar dízimo: ${(err as Error).message}`, {
        progress: undefined,
      });
    } finally {
      setLoading(false);
      setEditing('');
    }
  };

  const handleDelete = async (id: string, index: number) => {
    try {
      await window.tithe.delete(id);

      const newTithes = [...tithes];
      newTithes.splice(index, 1);
      setTithes(newTithes);
      setDefaultTithes(newTithes);

      toast.success('Dízimo excluído com sucesso!', {
        progress: undefined,
      });
    } catch (err) {
      toast.error(`Erro ao excluir dízimo: ${(err as Error).message}`, {
        progress: undefined,
      });
    }
  };

  return (
    <>
      <div className="flex flex-col items-center w-full h-full">
        <h1 className="flex items-center font-semibold text-2xl text-zinc-900 h-20">
          Editar Dízimos
        </h1>
        <FilterByMonthAndYear
          monthValue={referenceMonth}
          yearValue={referenceYear}
          setReferenceMonth={setReferenceMonth}
          setReferenceYear={setReferenceYear}
        />
        <div className="flex w-full h-10 items-center justify-between border-y border-zinc-300 text-zinc-900">
          <span className="w-6/12 flex items-center justify-center">
            Membro
          </span>
          <span className="w-1/12 flex items-center justify-center">
            Valor (R$)
          </span>
          <span className="w-2/6 flex items-center justify-center">Editar</span>
        </div>
        <div className="w-full h-full flex flex-col overflow-auto scrollbar-thin scrollbar-thumb-zinc-900 scrollbar-track-zinc-300">
          {!tithes.length ? (
            <span className="m-auto text-zinc-500">
              Não há dízimos cadastrados para o mês e ano selecionados!
            </span>
          ) : (
            tithes.map(({ id, value, memberName }, index) => (
              <EditForm
                key={id}
                handleSubmit={(event) => handleEdit(event, index)}
                handleReset={handleReset}
                isLoading={loading}
                editingId={id}
                isEditing={editing === id}
                setIsEditing={handleSetEditing}
                className={index % 2 === 0 ? 'bg-zinc-100' : ''}
                onDelete={() => handleDelete(id, index)}
                deleteMessage={`Tem certeza que deseja excluir este dízimo, no valor de "R$ ${value}"? Esta ação não poderá ser desfeita. Clique em "SIM" para confirmar.`}
                deleteTitle="Excluir Dízimo"
                editType="dízimo"
              >
                <label className="w-6/12 flex items-center justify-center text-zinc-900">
                  <input
                    title="Nome do membro"
                    value={memberName}
                    readOnly
                    name="memberId"
                    className="cursor-default text-center p-0 text-zinc-900 bg-transparent font-normal focus:outline-none block w-full h-full appearance-none leading-normal rounded-sm"
                  />
                </label>
                <label className="w-1/12 flex items-center justify-center text-zinc-900">
                  <input
                    required
                    title="Valor do dízimo"
                    name="value"
                    value={value}
                    onChange={(event) => handleChange(event, index)}
                    onBlur={(event) => handleValueInputBlur(event, index)}
                    className="text-center text-zinc-200 bg-zinc-900 disabled:p-0 disabled:text-zinc-900 disabled:bg-transparent font-light disabled:font-normal focus:outline-none block w-11/12 h-full disabled:appearance-none leading-normal rounded-sm"
                    disabled={editing !== id}
                  />
                </label>
              </EditForm>
            ))
          )}
        </div>
      </div>
      <LogoChurch />
    </>
  );
}
