import { useEffect, useState } from 'react';
import { EditForm } from './EditForm';
import { findTithesWithMemberNameByReferences, updateTithe, deleteTithe } from '#preload';
import { toast } from 'react-toastify';
import { FilterByMonthAndYear } from '../FilterByMonthAndYear';
import { ImSpinner2 } from 'react-icons/im';

export interface TitheWithMember {
  id: string;
  memberId: string;
  value: string | number;
  referenceMonth: number;
  referenceYear: number;
  member: {
    name: string;
  };
}

export function EditTithes() {
  const [defaultTithes, setDefaultTithes] = useState<TitheWithMember[]>([]);
  const [tithes, setTithes] = useState<TitheWithMember[]>([]);
  const [editing, setEditing] = useState('');
  const [loading, setLoading] = useState(false);
  const [referenceMonth, setReferenceMonth] = useState(new Date().getMonth() + 1);
  const [referenceYear, setReferenceYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (referenceMonth !== 0 && referenceYear !== 0) {
      setLoading(true);
      findTithesWithMemberNameByReferences(referenceMonth, referenceYear).then((tithes) => {
        const toFixedTithes = tithes.map((tithe) => ({
          ...tithe,
          value: (tithe.value as number).toFixed(2),
        }));
        setTithes(toFixedTithes);
        setDefaultTithes(toFixedTithes);
      }).finally(() => {
        setLoading(false);
      });
    }
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
    { target: { name, value } }: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index: number,
  ) => {
    const key = name as keyof TitheWithMember;
    const newTithe = {
      ...tithes[index],
      [key]: name === 'value' ? valueChangeReplace(value, index) : value,
    } as TitheWithMember;

    const newTithes = [...tithes];
    newTithes.splice(index, 1, newTithe);

    setTithes(newTithes);
  };

  const handleValueInputBlur = (
    { target: { value } }: React.FocusEvent<HTMLInputElement>, index: number,
  ) => {
    const newValue = (value ? parseFloat(value).toFixed(2) : '');
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

  const handleEdit = (event: React.FormEvent<HTMLFormElement>, index: number) => {
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
    updateTithe({
      id: editedTithe.id,
      memberId: editedTithe.memberId,
      value: floatValue,
      referenceMonth: editedTithe.referenceMonth,
      referenceYear: editedTithe.referenceYear,
    }).then(() => {
      toast.success('Dízimo alterado com sucesso!', {
        progress: undefined,
      });
      setDefaultTithes(tithes);
    }).catch((err) => {
      toast.error(`Erro ao editar dízimo: ${err.message}`, {
        progress: undefined,
      });
    }).finally(() => {
      setLoading(false);
      setEditing('');
    }) ;
  };

    const handleDelete = (id: string, index: number) => {
      deleteTithe(id).then(() => {
        const newTithes = [...tithes];
        newTithes.splice(index, 1);
        setTithes(newTithes);
        setDefaultTithes(newTithes);

        toast.success('Dízimo excluído com sucesso!', {
          progress: undefined,
        });
      })
        .catch((err) => {
          toast.error(`Erro ao excluir dízimo: ${err.message}`, {
            progress: undefined,
          });
        });
    };

  const orderedTithes = tithes.sort((a, b) => a.member.name.localeCompare(b.member.name));

  return (
    <div
      className="flex flex-col items-center w-full h-full"
    >
      <h1 className="flex items-center font-semibold text-2xl text-zinc-900 h-20">Editar Dízimos</h1>
      <FilterByMonthAndYear
        monthValue={referenceMonth}
        yearValue={referenceYear}
        setReferenceMonth={setReferenceMonth}
        setReferenceYear={setReferenceYear}
      />
      <div
        className="flex w-full h-10 items-center justify-between border-y border-zinc-300 text-zinc-900"
      >
        <span className="w-6/12 flex items-center justify-center">Membro</span>
        <span className="w-1/12 flex items-center justify-center">Valor (R$)</span>
        <span className="w-2/6 flex items-center justify-center">Editar</span>
      </div>
      <div className="w-full h-full overflow-auto scrollbar-thin scrollbar-thumb-zinc-900 scrollbar-track-zinc-300">
        {loading && editing === ''
          ? <ImSpinner2 className="w-5 h-5 m-auto animate-spin" />
          : !orderedTithes.length
            ? <span className="m-auto text-zinc-500">
              Não há dízimos cadastrados para o mês e ano selecionados!
            </span>
          : orderedTithes.map(({ id, value, member: { name } }, index) => (
          <EditForm
            key={id}
            handleSubmit={(event) => handleEdit(event, index)}
            handleReset={handleReset}
            isLoading={loading}
            editingId={id}
            isEditing={editing === id}
            setIsEditing={handleSetEditing}
            className={(index % 2 === 0 ? 'bg-zinc-100' : '')}
            onDelete={() => handleDelete(id, index)}
            deleteMessage={`Tem certeza que deseja excluir este dízimo, no valor de "R$ ${value}"? Esta ação não poderá ser desfeita. Clique em "SIM" para confirmar.`}
            deleteTitle="Excluir Dízimo"
            editType='dízimo'
          >
            <label className="w-6/12 flex items-center justify-center text-zinc-900">
              <input
                title="Nome do membro"
                value={name}
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
                  className="focus:outline-2 focus:outline-teal-500 text-center text-zinc-200 bg-zinc-900 p-2 disabled:p-0 disabled:text-zinc-900 disabled:bg-transparent font-light disabled:font-normal focus:outline-none block w-11/12 h-full disabled:appearance-none leading-normal rounded-sm"
                  disabled={editing !== id}
              />
            </label>
          </EditForm>
        ))}
      </div>
    </div>
  );
}
