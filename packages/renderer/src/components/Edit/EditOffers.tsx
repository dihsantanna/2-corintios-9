import { useEffect, useRef, useState } from 'react';
import { EditForm } from './EditForm';
import type { Screens } from '/@/@types/Screens.type';
import type { Member } from '#preload';
import { findAllMembers} from '#preload';
import { findAllOffersWithMemberName, updateOffer } from '#preload';
import { toast } from 'react-toastify';
import { FilterByMonthAndYear } from '../FilterByMonthAndYear';
import { ImSpinner2 } from 'react-icons/im';

interface EditOfferProps {
  screenSelected: Screens;
}

interface OfferWithMember {
  id: string;
  memberId: string | null;
  value: string | number;
  referenceMonth: number;
  referenceYear: number;
  member: {
    name: string;
  } | null;
}

type OfferType = 'special' | 'loose' | 'all';


export function EditOffers({ screenSelected }: EditOfferProps) {
  const [defaultOffers, setDefaultOffers] = useState<OfferWithMember[]>([]);
  const [offers, setOffers] = useState<OfferWithMember[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [editing, setEditing] = useState('');
  const [loading, setLoading] = useState(false);
  const [referenceMonth, setReferenceMonth] = useState(new Date().getMonth() + 1);
  const [referenceYear, setReferenceYear] = useState(new Date().getFullYear());
  const [offerType, setOfferType] = useState<OfferType>('all');
  const mounted = useRef(false);

  useEffect(() => {
    if (screenSelected !== 'editOffers' && mounted.current) {
      setEditing('');
      setReferenceMonth(new Date().getMonth() + 1);
      setReferenceYear(new Date().getFullYear());
      setOfferType('all');
      mounted.current = false;
    }

    if (screenSelected === 'editOffers') {
      findAllMembers().then((members) => {
        setMembers(members);
      });
      mounted.current = true;
    }
  }, [screenSelected]);

  const filterOfferByType = (offers: OfferWithMember[]): OfferWithMember[] => {
    if (offerType === 'special') {
      return offers.filter(({memberId}) => !!memberId);
    }
    if (offerType === 'loose') {
      return offers.filter(({memberId}) => !memberId);
    }
    return offers;
  };

  useEffect(() => {
    if (referenceMonth !== 0 && referenceYear !== 0) {
      setLoading(true);
      findAllOffersWithMemberName(referenceMonth, referenceYear).then((offers) => {
        const filteredOffers = filterOfferByType(offers).map((offer) => (
          {
            ...offer,
            value: (offer.value as number).toFixed(2),
          }
        ));
        setOffers(filteredOffers);
        setDefaultOffers(filteredOffers);
      }).finally(() => {
        setLoading(false);
      });
    }
  }, [referenceMonth, referenceYear, offerType]);

  const handleReset = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setOffers(defaultOffers);
    setEditing('');
  };

  const valueChangeReplace = (value: string, index: number) => {
    const validateValue = /^(\d+)(\.|,)?(\d{0,2}$)/.test(value) || value === '';
    if (!validateValue) return `${offers[index].value}`;

    return value.replace(',', '.');
  };

  const handleChange = (
    { target: { name, value } }: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index: number,
  ) => {
    const key = name as keyof OfferWithMember;
    const newOffer = {
      ...offers[index],
      [key]: name === 'value' ? valueChangeReplace(value, index) : value,
    } as OfferWithMember;

    const newOffers = [...offers];
    newOffers.splice(index, 1, newOffer);

    setOffers(newOffers);
  };

  const handleValueInputBlur = (
    { target: { value } }: React.FocusEvent<HTMLInputElement>, index: number,
  ) => {
    const newValue = (value ? parseFloat(value).toFixed(2) : '');
    const newOffer = {
      ...offers[index],
      value: newValue,
    };

    const newOffers = [...offers];
    newOffers.splice(index, 1, newOffer);

    setOffers(newOffers);
  };

  const handleSetEditing = (id: string) => {
    setEditing(id);
    setOffers(defaultOffers);
  };

  const handleEdit = (event: React.FormEvent<HTMLFormElement>, index: number) => {
    event.preventDefault();
    const editedOffer = offers[index];
    if (editedOffer === defaultOffers[index]) {
      toast.warn('Faça alguma modificação ou clique em fechar para cancelar', {
        progress: undefined,
      });
      return;
    }

    const floatValue = parseFloat(editedOffer.value as string);

    if (floatValue <= 0) {
      toast.warn('Valor deve ser maior que zero', {
        progress: undefined,
      });
      return;
    }

    setLoading(true);
    updateOffer({
      id: editedOffer.id,
      memberId: editedOffer.memberId,
      value: floatValue,
      referenceMonth: editedOffer.referenceMonth,
      referenceYear: editedOffer.referenceYear,
    }).then(() => {
      toast.success('Oferta alterada com sucesso!', {
        progress: undefined,
      });
      setDefaultOffers(offers);
    }).catch((err) => {
      toast.error(`Erro ao editar oferta: ${err.message}`, {
        progress: undefined,
      });
    }).finally(() => {
      setLoading(false);
      setEditing('');
    }) ;
  };

  const orderedOffers = (offers.sort((a, b) => (
    a.member?.name && b.member?.name
      ? (a.member?.name as string).localeCompare(b.member?.name as string)
      : 0
  )));

  return (
    <div
      style={{
      display: screenSelected === 'editOffers' ? 'flex' : 'none',
      }}
      className="flex-col items-center w-full h-full"
    >
      <h1
        className="flex items-center font-semibold text-2xl text-zinc-900 h-20"
      >
        Editar Ofertas
      </h1>
      <div>
        <FilterByMonthAndYear
          monthValue={referenceMonth}
          yearValue={referenceYear}
          setReferenceMonth={setReferenceMonth}
          setReferenceYear={setReferenceYear}
        />
        <div className="flex items-center justify-center gap-2 py-2">
          <select
            className="cursor-pointer text-center text-zinc-200 bg-zinc-900 p-2 font-light focus:outline-none block w-full leading-normal rounded-sm"
            value={offerType}
            onChange={({ target: { value } }) => setOfferType(value as OfferType)}
          >
            <option value="" disabled>Selecione um tipo de oferta</option>
            <option value="all">Todas as ofertas</option>
            <option value="special">Ofertas especiais</option>
            <option value="loose">Ofertas de gazofilácio</option>
          </select>
        </div>
      </div>
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
        : !orderedOffers.length
          ? <span className="m-auto text-zinc-500"
          >
            Não há ofertas cadastrados para o mês e ano selecionados!
          </span>
        : orderedOffers.map(({ id, memberId, value }, index) => (
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
              {
                memberId
                && (
                  <select
                    value={memberId}
                    name="memberId"
                    onChange={(event) => handleChange(event, index)}
                    className="cursor-default text-center text-zinc-900 bg-transparent font-normal focus:outline-none block w-full h-full appearance-none leading-normal rounded-sm"
                    disabled
                  >
                    <option disabled value="">Selecione um Membro</option>
                    {members.map(({ id, name }) => (
                      <option key={id} value={id}>{`${id} - ${name}`}</option>
                    ))}
                  </select>
                )
              }
          </label>
          <label className="w-1/12 flex items-center justify-center text-zinc-900">
              <input
                required
                name="value"
                value={value}
                onChange={(event) => handleChange(event, index)}
                onBlur={(event) => handleValueInputBlur(event, index)}
                className="text-center text-zinc-200 bg-zinc-900 p-2 disabled:p-0 disabled:text-zinc-900 disabled:bg-transparent font-light disabled:font-normal focus:outline-none block w-full h-full disabled:appearance-none leading-normal rounded-sm"
                disabled={editing !== id}
            />
          </label>
        </EditForm>
      ))}
    </div>
  );
}
