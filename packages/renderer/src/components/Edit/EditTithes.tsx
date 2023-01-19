import { useEffect, useRef, useState } from 'react';
import { EditForm } from './EditForm';
import type { Screens } from '/@/@types/Screens.type';
import type { Member, Tithe} from '#preload';
import { findAllMembers} from '#preload';
import { findAllTithesWithMemberName, updateTithe } from '#preload';
import { toast } from 'react-toastify';
import { FilterByMonthAndYear } from '../FilterByMonthAndYear';
import { ImSpinner2 } from 'react-icons/im';

interface EditTitheProps {
  screenSelected: Screens;
}

interface TitheWithMember extends Tithe {
  member: {
    name: string;
  }
}

export function EditTithes({ screenSelected }: EditTitheProps) {
  const [defaultTithes, setDefaultTithes] = useState<TitheWithMember[]>([]);
  const [tithes, setTithes] = useState<TitheWithMember[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [editing, setEditing] = useState('');
  const [loading, setLoading] = useState(false);
  const [referenceMonth, setReferenceMonth] = useState(0);
  const [referenceYear, setReferenceYear] = useState(0);
  const mounted = useRef(false);

  useEffect(() => {
    if (screenSelected !== 'editTithes' && mounted.current) {
      setEditing('');
      setReferenceMonth(0);
      setReferenceYear(0);
      setTithes([]);
      setDefaultTithes([]);
      mounted.current = false;
    }

    if (screenSelected === 'editTithes') {
      findAllMembers().then((members) => {
        setMembers(members);
      });
      mounted.current = true;
    }
  }, [screenSelected]);

  useEffect(() => {
    if (referenceMonth !== 0 && referenceYear !== 0) {
      setLoading(true);
      findAllTithesWithMemberName(referenceMonth, referenceYear).then((tithes) => {
        setTithes(tithes);
        setDefaultTithes(tithes);
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
      [key]: name === 'value' ? parseFloat(valueChangeReplace(value, index) || '0') : value,
    } as TitheWithMember;

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

    if (editedTithe.value <= 0) {
      toast.warn('Valor deve ser maior que zero', {
        progress: undefined,
      });
      return;
    }

    setLoading(true);
    updateTithe({
      id: editedTithe.id,
      memberId: editedTithe.memberId,
      value: editedTithe.value,
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

  const orderedTithes = tithes.sort((a, b) => a.member.name.localeCompare(b.member.name));
  console.log(orderedTithes);

  return (
    <div
      style={{
      display: screenSelected === 'editTithes' ? 'flex' : 'none',
      }}
      className="flex-col items-center w-full h-full"
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
        <span className="w-1/6 flex items-center justify-center">id</span>
        <span className="w-4/12 flex items-center justify-center">Membro</span>
        <span className="w-1/12 flex items-center justify-center">Valor (R$)</span>
        <span className="w-2/6 flex items-center justify-center">Editar</span>
      </div>
      {loading && editing === ''
        ? <ImSpinner2 className="w-5 h-5 m-auto animate-spin" />
        : !orderedTithes.length
        ? <span className="m-auto text-zinc-500">Não há dízimos cadastrados para o mês e ano selecionados!</span>
        : orderedTithes.map(({ id, memberId, value }, index) => (
        <EditForm
          key={id}
          handleSubmit={(event) => handleEdit(event, index)}
          handleReset={handleReset}
          isLoading={loading}
          editingId={id}
          isEditing={editing === id}
          setIsEditing={handleSetEditing}
          className={(index % 2 === 0 ? 'bg-zinc-100' : '')}
        >
          <label className="w-1/6 flex items-center justify-center text-zinc-900">{id}</label>
          <label className="w-4/12 flex items-center justify-center text-zinc-900">
            <select
              value={memberId}
              name="memberId"
              onChange={(event) => handleChange(event, index)}
              className="cursor-pointer disabled:cursor-default text-center text-zinc-200 bg-zinc-900 p-2 disabled:p-0 disabled:text-zinc-900 disabled:bg-transparent font-light disabled:font-normal focus:outline-none block w-full h-full disabled:appearance-none leading-normal rounded-sm"
              disabled={editing !== id}
            >
              <option disabled value="">Selecione um Membro</option>
              {members.map(({ id, name }) => (
                <option key={id} value={id}>{`${id} - ${name}`}</option>
              ))}
            </select>
          </label>
          <label className="w-1/12 flex items-center justify-center text-zinc-900">
            <input
              name="value"
              value={value}
              onChange={(event) => handleChange(event, index)}
              className="text-center text-zinc-200 bg-zinc-900 p-2 disabled:p-0 disabled:text-zinc-900 disabled:bg-transparent font-light disabled:font-normal focus:outline-none block w-full h-full disabled:appearance-none leading-normal rounded-sm"
              disabled={editing !== id}
            />
          </label>
        </EditForm>
      ))}
    </div>
  );
}
