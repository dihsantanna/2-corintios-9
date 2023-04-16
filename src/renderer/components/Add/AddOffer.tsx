import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { IMemberState } from 'main/@types/Member';
import { AddForm } from './AddForm';
import { months } from '../../utils/months';
import { getYears } from '../../utils/years';
import { useGlobalContext } from '../../context/GlobalContext/GlobalContextProvider';

interface Offer {
  memberId: string;
  value: string;
  referenceMonth: number;
  referenceYear: number;
}

const INITIAL_STATE: Offer = {
  memberId: '',
  value: '',
  referenceMonth: new Date().getMonth() + 1,
  referenceYear: new Date().getFullYear(),
};

export function AddOffer() {
  const [tithe, setOffer] = useState<Offer>({ ...INITIAL_STATE });
  const [members, setMembers] = useState<IMemberState[]>([]);
  const [loading, setLoading] = useState(false);

  const { setRefreshPartialBalance } = useGlobalContext();

  useEffect(() => {
    const getMembers = async () => {
      try {
        const newMembers = await window.member.findAll();
        setMembers(newMembers);
      } catch (err) {
        toast.error(`Erro ao carregar membros: ${(err as Error).message}`, {
          progress: undefined,
        });
      }
    };

    getMembers();
  }, []);

  const formValidate = (
    floatValue: number,
    referenceMonth: number,
    referenceYear: number
  ) => {
    if (floatValue <= 0) {
      toast.warn('Valor da oferta deve ser maior que 0', {
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

    return true;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { memberId, value, referenceMonth, referenceYear } = tithe;
    const floatValue = parseFloat(value);
    if (!formValidate(floatValue, referenceMonth, referenceYear)) return;

    setLoading(true);
    try {
      await window.offer.create({
        memberId: memberId || null,
        value: floatValue,
        referenceMonth,
        referenceYear,
      });
      toast.success('Oferta cadastrada com sucesso!', {
        progress: undefined,
      });
      setRefreshPartialBalance(true);
    } catch (err) {
      toast.error(`Erro ao cadastrar oferta: ${(err as Error).message}`, {
        progress: undefined,
      });
    } finally {
      setLoading(false);
      setOffer({ ...INITIAL_STATE });
    }
  };

  const handleSelectChange = ({
    target: { value, name },
  }: React.ChangeEvent<HTMLSelectElement>) => {
    setOffer({
      ...tithe,
      [name]: name === 'memberId' ? value : +value,
    });
  };

  const handleValueInputChange = ({
    target: { value, name },
  }: React.ChangeEvent<HTMLInputElement>) => {
    const validateValue = /^(\d+)(\.|,)?(\d{0,2}$)/.test(value) || value === '';
    if (!validateValue) return;

    const valueEdit = value.match(/\d|\.|,/g) || '';
    const newValue = valueEdit.length ? [...valueEdit].join('') : '';

    setOffer({
      ...tithe,
      [name]: newValue.replace(',', '.'),
    });
  };

  const handleValueInputBlur = ({
    target: { value, name },
  }: React.FocusEvent<HTMLInputElement>) => {
    const newValue = value ? parseFloat(value).toFixed(2) : '';

    setOffer({
      ...tithe,
      [name]: newValue,
    });
  };

  const handleReset = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setOffer({ ...INITIAL_STATE });
  };

  return (
    <AddForm
      handleSubmit={handleSubmit}
      handleReset={handleReset}
      isLoading={loading}
      title="Cadastrar Oferta"
    >
      <label className="relative flex items-center bg-zinc-900 p-2 border-l-4 border-teal-500 rounded-sm w-8/12">
        <select
          name="memberId"
          title="Selecione o membro caso a oferta seja especial"
          value={tithe.memberId}
          onChange={handleSelectChange}
          className="cursor-pointer bg-zinc-900 font-light block w-full leading-normal"
        >
          <option disabled value="">
            Selecione o membro
          </option>
          {members.map(({ id, name }) => (
            <option title={name} key={id} value={id}>
              {name}
            </option>
          ))}
        </select>
        <span className="absolute w-max -bottom-4 text-xs italic text-zinc-900 right-0">
          * selecione o membro em caso de oferta especial
        </span>
      </label>
      <label className="flex gap-2 items-center bg-zinc-900 p-2 border-l-4 border-teal-500 rounded-sm w-4/12">
        <span>R$</span>
        <input
          required
          title="Valor da Oferta"
          className="bg-zinc-900 placeholder:text-zinc-200 font-light block w-full appearance-none leading-normal"
          name="value"
          onChange={handleValueInputChange}
          onBlur={handleValueInputBlur}
          value={tithe.value}
          placeholder="Valor da Oferta"
        />
      </label>
      <label className="flex items-center bg-zinc-900 p-2 border-l-4 border-teal-500 rounded-sm w-4/12">
        <select
          required
          title="Selecione o mês da oferta"
          name="referenceMonth"
          value={tithe.referenceMonth}
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
          title="Selecione o ano da oferta"
          name="referenceYear"
          value={tithe.referenceYear}
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
