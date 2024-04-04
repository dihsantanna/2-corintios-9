import { useState } from 'react';
import { toast } from 'react-toastify';
import { AddForm } from './AddForm';
import { months } from '../../utils/months';
import { getYears } from '../../utils/years';
import { useGlobalContext } from '../../context/GlobalContext/GlobalContextProvider';

interface OtherEntry {
  title: string;
  value: string;
  description?: string | null;
  referenceMonth: number;
  referenceYear: number;
}

const INITIAL_STATE: OtherEntry = {
  title: '',
  value: '',
  description: '',
  referenceMonth: new Date().getMonth() + 1,
  referenceYear: new Date().getFullYear(),
};

export function AddOtherEntry() {
  const [otherEntry, setOtherEntry] = useState<OtherEntry>({
    ...INITIAL_STATE,
  });
  const [loading, setLoading] = useState(false);

  const { setRefreshPartialBalance } = useGlobalContext();

  const formValidate = (
    floatValue: number,
    referenceMonth: number,
    referenceYear: number,
    title: string,
  ) => {
    if (floatValue <= 0) {
      toast.warn('Valor da entrada deve ser maior que 0', {
        progress: undefined,
      });
      return false;
    }
    if (referenceMonth === 0) {
      toast.warn('Por favor selecione o mês', {
        progress: undefined,
      });
      return false;
    }
    if (referenceYear === 0) {
      toast.warn('Por favor selecione o ano', {
        progress: undefined,
      });
      return false;
    }
    if (title === '') {
      toast.warn('Por favor descreva a entrada', {
        progress: undefined,
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { title, value, description, referenceMonth, referenceYear } =
      otherEntry;
    const floatValue = parseFloat(value);

    if (!formValidate(floatValue, referenceMonth, referenceYear, title)) return;

    setLoading(true);
    try {
      await window.otherEntry.create({
        title,
        value: floatValue,
        description,
        referenceMonth,
        referenceYear,
      });
      toast.success('Entrada cadastrado com sucesso!', {
        progress: undefined,
      });
      setRefreshPartialBalance(true);
    } catch (err) {
      toast.error(`Erro ao cadastrar entrada: ${(err as Error).message}`, {
        progress: undefined,
      });
    } finally {
      setLoading(false);
      setOtherEntry({ ...INITIAL_STATE });
    }
  };

  const handleSelectChange = ({
    target: { value, name },
  }: React.ChangeEvent<HTMLSelectElement>) => {
    setOtherEntry({
      ...otherEntry,
      [name]: +value,
    });
  };

  const handleValueInputChange = ({
    target: { value, name },
  }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (name === 'title') {
      setOtherEntry({ ...otherEntry, title: value });
      return;
    }

    if (name === 'description') {
      setOtherEntry({ ...otherEntry, description: value });
      return;
    }

    const validateValue = /^(\d+)(\.|,)?(\d{0,2}$)/.test(value) || value === '';
    if (!validateValue) return;

    const valueEdit = value.match(/\d|\.|,/g) || '';
    const newValue = valueEdit.length ? [...valueEdit].join('') : '';

    setOtherEntry({
      ...otherEntry,
      [name]: newValue.replace(',', '.'),
    });
  };

  const handleValueInputBlur = ({
    target: { value, name },
  }: React.FocusEvent<HTMLInputElement>) => {
    const newValue = value ? parseFloat(value).toFixed(2) : '';

    setOtherEntry({
      ...otherEntry,
      [name]: newValue,
    });
  };

  const handleReset = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setOtherEntry({ ...INITIAL_STATE });
  };

  return (
    <AddForm
      handleSubmit={handleSubmit}
      handleReset={handleReset}
      isLoading={loading}
      title="Cadastrar Outras Entradas"
    >
      <label className="flex items-center bg-zinc-900 p-2 border-l-4 border-teal-500 rounded-sm w-8/12">
        <input
          required
          title="Título da Entrada"
          name="title"
          className="bg-zinc-900 placeholder:text-zinc-200 font-light block w-full appearance-none leading-normal"
          value={otherEntry.title}
          onChange={handleValueInputChange}
          placeholder="Título da Entrada"
        />
      </label>
      <label className="flex gap-2 items-center bg-zinc-900 p-2 border-l-4 border-teal-500 rounded-sm w-4/12">
        <span>R$</span>
        <input
          required
          title="Valor da entrada"
          className="bg-zinc-900 placeholder:text-zinc-200 font-light block w-full appearance-none leading-normal"
          name="value"
          onChange={handleValueInputChange}
          onBlur={handleValueInputBlur}
          value={otherEntry.value}
          placeholder="Valor da entrada"
        />
      </label>
      <label className="flex items-center bg-zinc-900 p-2 border-l-4 border-teal-500 rounded-sm w-8/12">
        <textarea
          title="Descrição da Entrada"
          name="description"
          className="bg-zinc-900 placeholder:text-zinc-200 font-light block w-full appearance-none outline-none border-2 border-transparent rounded-md focus:border-teal-500 leading-normal h-14 max-h-14 min-h-14 pl-1 resize-none"
          value={otherEntry?.description || ''}
          onChange={handleValueInputChange}
          placeholder="Descrição da Entrada (opcional)"
          rows={2}
        />
      </label>
      <label className="flex items-center bg-zinc-900 p-2 border-l-4 border-teal-500 rounded-sm w-4/12">
        <select
          required
          title="Selecione o mês da entrada"
          name="referenceMonth"
          value={otherEntry.referenceMonth}
          onChange={handleSelectChange}
          className="cursor-pointer bg-zinc-900 font-light block w-full leading-normal"
        >
          <option disabled value={0}>
            Selecione o mês
          </option>
          {Object.entries(months).map(([monthIndex, month]) => (
            <option
              title={month}
              key={`${monthIndex}-${month}`}
              value={monthIndex}
            >
              {month}
            </option>
          ))}
        </select>
      </label>
      <label className="flex items-center bg-zinc-900 p-2 border-l-4 border-teal-500 rounded-sm w-4/12">
        <select
          required
          title="Selecione o ano da entrada"
          name="referenceYear"
          value={otherEntry.referenceYear}
          onChange={handleSelectChange}
          className="cursor-pointer bg-zinc-900 font-light block w-full leading-normal"
        >
          <option disabled value={0}>
            Selecione o ano
          </option>
          {getYears().map((year) => (
            <option title={year.toString()} key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </label>
    </AddForm>
  );
}
