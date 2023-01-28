import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { EditForm } from './EditForm';
import { FilterByMonthAndYear } from '../FilterByMonthAndYear';

export interface OfferWithMemberName {
  id: string;
  memberId: string | null;
  memberName: string | null;
  value: string | number;
  referenceMonth: number;
  referenceYear: number;
}

type OfferType = 'special' | 'loose' | 'all';

export function EditOffers() {
  const [defaultOffers, setDefaultOffers] = useState<OfferWithMemberName[]>([]);
  const [offers, setOffers] = useState<OfferWithMemberName[]>([]);
  const [editing, setEditing] = useState('');
  const [loading, setLoading] = useState(false);
  const [referenceMonth, setReferenceMonth] = useState(
    new Date().getMonth() + 1
  );
  const [referenceYear, setReferenceYear] = useState(new Date().getFullYear());
  const [offerType, setOfferType] = useState<OfferType>('all');

  const filterOfferByType = (
    offersArr: OfferWithMemberName[]
  ): OfferWithMemberName[] => {
    if (offerType === 'special') {
      return offersArr.filter(({ memberId }) => !!memberId);
    }
    if (offerType === 'loose') {
      return offersArr.filter(({ memberId }) => !memberId);
    }
    return offersArr;
  };

  useEffect(() => {
    const getOffers = async () => {
      try {
        setLoading(true);
        const newOffers = await window.offer.findAllByReferencesWithMemberName(
          referenceMonth,
          referenceYear
        );
        const toFixedOffers = newOffers.map((offer) => ({
          ...offer,
          value: offer.value.toFixed(2),
        }));
        setOffers(toFixedOffers);
        setDefaultOffers(toFixedOffers);
      } catch (err) {
        toast.error(`Erro ao buscar ofertas: ${(err as Error).message}`, {
          progress: undefined,
        });
      } finally {
        setLoading(false);
      }
    };

    if (referenceMonth !== 0 && referenceYear !== 0) getOffers();
  }, [referenceMonth, referenceYear]);

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
    {
      target: { name, value },
    }: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index: number
  ) => {
    const key = name as keyof OfferWithMemberName;
    const newOffer = {
      ...offers[index],
      [key]: name === 'value' ? valueChangeReplace(value, index) : value,
    } as OfferWithMemberName;

    const newOffers = [...offers];
    newOffers.splice(index, 1, newOffer);

    setOffers(newOffers);
  };

  const handleValueInputBlur = (
    { target: { value } }: React.FocusEvent<HTMLInputElement>,
    index: number
  ) => {
    const newValue = value ? parseFloat(value).toFixed(2) : '';
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

  const handleEdit = async (
    event: React.FormEvent<HTMLFormElement>,
    index: number
  ) => {
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
    try {
      await window.offer.update({
        id: editedOffer.id,
        memberId: editedOffer.memberId,
        value: floatValue,
        referenceMonth: editedOffer.referenceMonth,
        referenceYear: editedOffer.referenceYear,
      });
      toast.success('Oferta alterada com sucesso!', {
        progress: undefined,
      });
      setDefaultOffers(offers);
    } catch (err) {
      toast.error(`Erro ao editar oferta: ${(err as Error).message}`, {
        progress: undefined,
      });
    } finally {
      setLoading(false);
      setEditing('');
    }
  };

  const handleDelete = async (id: string, index: number) => {
    try {
      await window.offer.delete(id);

      const newOffers = [...offers];
      newOffers.splice(index, 1);
      setOffers(newOffers);
      setDefaultOffers(newOffers);

      toast.success('Oferta excluída com sucesso!', {
        progress: undefined,
      });
    } catch (err) {
      toast.error(`Erro ao excluir oferta: ${(err as Error).message}`, {
        progress: undefined,
      });
    }
  };

  const filtered = filterOfferByType(offers);

  const orderedOffers = filtered.sort((a, b) =>
    a.memberName && b.memberName
      ? (a.memberName as string).localeCompare(b.memberName as string)
      : 0
  );

  return (
    <div className="flex flex-col items-center w-full h-full">
      <h1 className="flex items-center font-semibold text-2xl text-zinc-900 h-20">
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
            title="Selecione um tipo de oferta"
            className="cursor-pointer text-center text-zinc-200 bg-zinc-900 p-2 font-light block w-full leading-normal rounded-sm"
            value={offerType}
            onChange={({ target: { value } }) =>
              setOfferType(value as OfferType)
            }
          >
            <option value="" disabled>
              Selecione um tipo de oferta
            </option>
            <option title="Todas" value="all">
              Todas as ofertas
            </option>
            <option title="Especiais" value="special">
              Ofertas especiais
            </option>
            <option title="Gazofilácio" value="loose">
              Ofertas de gazofilácio
            </option>
          </select>
        </div>
      </div>
      <div className="flex w-full h-10 items-center justify-between border-y border-zinc-300 text-zinc-900">
        <span className="w-6/12 flex items-center justify-center">Membro</span>
        <span className="w-1/12 flex items-center justify-center">
          Valor (R$)
        </span>
        <span className="w-2/6 flex items-center justify-center">Editar</span>
      </div>
      <div className="w-full h-full flex flex-col overflow-auto scrollbar-thin scrollbar-thumb-zinc-900 scrollbar-track-zinc-300">
        {!orderedOffers.length ? (
          <span className="m-auto text-zinc-500">
            Não há ofertas cadastrados para o mês e ano selecionados!
          </span>
        ) : (
          orderedOffers.map(({ id, value, memberName }, index) => (
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
              deleteMessage={`Tem certeza que deseja excluir esta oferta, no valor de "R$ ${value}"? Esta ação não poderá ser desfeita. Clique em "SIM" para confirmar.`}
              deleteTitle="Excluir Oferta"
              editType="oferta"
            >
              <label className="w-6/12 flex items-center justify-center text-zinc-900">
                {memberName && (
                  <input
                    title="Nome do membro"
                    value={memberName}
                    readOnly
                    name="memberId"
                    className="cursor-default text-center p-0 text-zinc-900 bg-transparent font-normal block w-full h-full appearance-none leading-normal rounded-sm"
                  />
                )}
              </label>
              <label className="w-1/12 flex items-center justify-center text-zinc-900">
                <input
                  required
                  title="Valor da oferta"
                  name="value"
                  value={value}
                  onChange={(event) => handleChange(event, index)}
                  onBlur={(event) => handleValueInputBlur(event, index)}
                  className="text-center text-zinc-200 bg-zinc-900 disabled:p-0 disabled:text-zinc-900 disabled:bg-transparent font-light disabled:font-normal block w-11/12 h-full disabled:appearance-none leading-normal rounded-sm"
                  disabled={editing !== id}
                />
              </label>
            </EditForm>
          ))
        )}
      </div>
    </div>
  );
}
