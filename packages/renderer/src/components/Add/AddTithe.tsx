import { useEffect, useState } from 'react';
import { AddForm } from './AddForm';
import type { Member} from '#preload';
import { addTithe} from '#preload';
import { findAllMembers } from '#preload';
import { months } from '/@/utils/months';
import { getYears } from '/@/utils/years';
import { toast } from 'react-toastify';

interface Tithe {
  memberId: string,
  value: string,
  referenceMonth: number,
  referenceYear: number
}

const INITIAL_STATE: Tithe = {
      memberId: '',
      value: '',
      referenceMonth: 0,
      referenceYear: 0,
  };

export function AddTithe() {
  const [tithe, setTithe] = useState<Tithe>({...INITIAL_STATE });

  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    findAllMembers().then((newMembers) => {
      setMembers(newMembers);
    });
  }, []);


  const formValidate = (floatValue: number, referenceMonth: number, referenceYear: number, memberId: string) => {
    if (floatValue <= 0) {
      toast.warn('Valor do dízimo deve ser maior que 0', {
        progress: undefined,
      });
      return false;
    } else if (referenceMonth === 0) {
      toast.warn('Por favor selecione o mês', {
        progress: undefined,
      });
      return false;
    } else if (referenceYear === 0) {
      toast.warn('Por favor selecione o ano', {
        progress: undefined,
      });
      return false;
    } else if (memberId === '') {
      toast.warn('Por favor selecione o membro', {
        progress: undefined,
      });
      return false;
    }

    return true;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { memberId, value, referenceMonth, referenceYear } = tithe;
    const floatValue = parseFloat(value);

    if (!formValidate(floatValue, referenceMonth, referenceYear, memberId)) return;

    setLoading(true);
    addTithe({ memberId, value: floatValue, referenceMonth, referenceYear })
      .then(() => {
        toast.success('Dízimo cadastrado com sucesso!', {
          progress: undefined,
        });
      }).catch((err) => {
        toast.error(`Erro ao cadastrar dízimo: ${err.message}`, {
          progress: undefined,
        });
      }).finally(() => {
        setLoading(false);
        setTithe({...INITIAL_STATE });
      });
  };

  const handleSelectChange = ({ target: { value, name } }: React.ChangeEvent<HTMLSelectElement>) => {
    setTithe({
      ...tithe,
      [name]: name === 'memberId' ? value : +value,
    });
  };

  const handleValueInputChange = ({ target: { value, name } }: React.ChangeEvent<HTMLInputElement>) => {
    const validateValue = /^(\d+)(\.|,)?(\d{0,2}$)/.test(value) || value === '';
    if (!validateValue) return;

    const valueEdit = value.match(/\d|\.|,/g) || '';
    const newValue = valueEdit.length ? [...valueEdit].join('') : '';

    setTithe({
      ...tithe,
      [name]: newValue.replace(',', '.'),
    });
  };

  const handleValueInputBlur = ({ target: { value, name } }: React.FocusEvent<HTMLInputElement>) => {
    const newValue = value ? parseFloat(value).toFixed(2) : '';

    setTithe({
      ...tithe,
      [name]: newValue,
    });
  };

  const handleReset = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTithe({...INITIAL_STATE });
  };

  return (
    <AddForm
      handleSubmit={handleSubmit}
      handleReset={handleReset}
      isLoading={loading}
      title="Cadastrar Dízimo"
    >
      <label
        className="flex items-center bg-zinc-900 p-2 border-l-4 border-teal-500 rounded-sm w-8/12"
      >
        <select
          required
          name="memberId"
          value={tithe.memberId}
          onChange={handleSelectChange}
          className="cursor-pointer bg-zinc-900 font-light focus:outline-none block w-full leading-normal"
        >
          <option disabled value="">Selecione o membro</option>
          {members.map(({id, name}) => (
            <option key={id} value={id}>{name}</option>
          ))}
        </select>
      </label>
      <label className="flex gap-2 items-center bg-zinc-900 p-2 border-l-4 border-teal-500 rounded-sm w-4/12">
        <span>R$</span>
        <input
          required
          className="bg-zinc-900 placeholder:text-zinc-200 font-light focus:outline-none block w-full appearance-none leading-normal"
          name="value"
          onChange={handleValueInputChange}
          onBlur={handleValueInputBlur}
          value={tithe.value}
          placeholder="Valor do Dízimo"
        />
      </label>
      <label
        className="flex items-center bg-zinc-900 p-2 border-l-4 border-teal-500 rounded-sm w-4/12"
      >
        <select
          required
          name="referenceMonth"
          value={tithe.referenceMonth}
          onChange={handleSelectChange}
          className="cursor-pointer bg-zinc-900 font-light focus:outline-none block w-full leading-normal"
        >
          <option disabled value={0}>Selecione o mês</option>
          {Object.entries(months).map(([monthIndex, month]) => (
            <option key={`${monthIndex}-${month}`} value={monthIndex}>{month}</option>
          ))}
        </select>
      </label>
      <label
        className="flex items-center bg-zinc-900 p-2 border-l-4 border-teal-500 rounded-sm w-4/12"
      >
        <select
          required
          name="referenceYear"
          value={tithe.referenceYear}
          onChange={handleSelectChange}
          className="cursor-pointer bg-zinc-900 font-light focus:outline-none block w-full leading-normal"
        >
          <option disabled value={0}>Selecione o ano</option>
          {getYears().map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </label>
    </AddForm>
  );
}
