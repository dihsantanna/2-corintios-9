import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { EditForm } from './EditForm';
import { FilterByMonthAndYear } from '../FilterByMonthAndYear';

interface WithdrawsToTheBankAccount {
  id: string;
  value: string;
  referenceMonth: number;
  referenceYear: number;
}

export function EditWithdrawsToTheBankAccount() {
  const [
    defaultWithdrawsToTheBankAccount,
    setDefaultWithdrawsToTheBankAccount,
  ] = useState<WithdrawsToTheBankAccount[]>([]);
  const [withdrawsToTheBankAccount, setWithdrawsToTheBankAccount] = useState<
    WithdrawsToTheBankAccount[]
  >([]);
  const [editing, setEditing] = useState('');
  const [loading, setLoading] = useState(false);
  const [referenceMonth, setReferenceMonth] = useState(
    new Date().getMonth() + 1
  );
  const [referenceYear, setReferenceYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const getWithdrawsToTheBankAccount = async () => {
      try {
        setLoading(true);
        const newWithdrawsToTheBankAccount =
          await window.withdrawToTheBankAccount.findAllByReferenceDate(
            referenceMonth,
            referenceYear
          );

        const toFixedWithdrawsToTheBankAccount =
          newWithdrawsToTheBankAccount.map((withdraw) => ({
            ...withdraw,
            value: withdraw.value.toFixed(2),
          }));

        setWithdrawsToTheBankAccount(toFixedWithdrawsToTheBankAccount);
        setDefaultWithdrawsToTheBankAccount(toFixedWithdrawsToTheBankAccount);
      } catch (err) {
        toast.error(`Erro ao buscar saques: ${(err as Error).message}`, {
          progress: undefined,
        });
      } finally {
        setLoading(false);
      }
    };

    if (referenceMonth !== 0 && referenceYear !== 0)
      getWithdrawsToTheBankAccount();
  }, [referenceMonth, referenceYear]);

  const handleReset = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setWithdrawsToTheBankAccount(defaultWithdrawsToTheBankAccount);
    setEditing('');
  };

  const valueChangeReplace = (value: string, index: number) => {
    const validateValue = /^(\d+)(\.|,)?(\d{0,2}$)/.test(value) || value === '';
    if (!validateValue) return `${withdrawsToTheBankAccount[index].value}`;

    return value.replace(',', '.');
  };

  const handleChange = (
    {
      target: { value },
    }: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index: number
  ) => {
    const newTithe = {
      ...withdrawsToTheBankAccount[index],
      value: valueChangeReplace(value, index),
    } as WithdrawsToTheBankAccount;

    const newWithdrawsToTheBankAccount = [...withdrawsToTheBankAccount];
    newWithdrawsToTheBankAccount.splice(index, 1, newTithe);

    setWithdrawsToTheBankAccount(newWithdrawsToTheBankAccount);
  };

  const handleValueInputBlur = (
    { target: { value } }: React.FocusEvent<HTMLInputElement>,
    index: number
  ) => {
    const newValue = value ? parseFloat(value).toFixed(2) : '';
    const newTithe = {
      ...withdrawsToTheBankAccount[index],
      value: newValue,
    };

    const newWithdrawsToTheBankAccount = [...withdrawsToTheBankAccount];
    newWithdrawsToTheBankAccount.splice(index, 1, newTithe);

    setWithdrawsToTheBankAccount(newWithdrawsToTheBankAccount);
  };

  const handleSetEditing = (id: string) => {
    setEditing(id);
    setWithdrawsToTheBankAccount(defaultWithdrawsToTheBankAccount);
  };

  const handleEdit = async (
    event: React.FormEvent<HTMLFormElement>,
    index: number
  ) => {
    event.preventDefault();
    const editedWithdraw = withdrawsToTheBankAccount[index];
    if (editedWithdraw === defaultWithdrawsToTheBankAccount[index]) {
      toast.warn('Faça alguma modificação ou clique em fechar para cancelar', {
        progress: undefined,
      });
      return;
    }

    const floatValue = parseFloat(editedWithdraw.value as string);

    if (floatValue <= 0) {
      toast.warn('Valor deve ser maior que zero', {
        progress: undefined,
      });
      return;
    }

    setLoading(true);
    try {
      await window.withdrawToTheBankAccount.update({
        id: editedWithdraw.id,
        value: floatValue,
        referenceMonth: editedWithdraw.referenceMonth,
        referenceYear: editedWithdraw.referenceYear,
      });
      toast.success('Saque alterado com sucesso!', {
        progress: undefined,
      });
      setDefaultWithdrawsToTheBankAccount(withdrawsToTheBankAccount);
    } catch (err) {
      toast.error(`Erro ao editar saque: ${(err as Error).message}`, {
        progress: undefined,
      });
    } finally {
      setLoading(false);
      setEditing('');
    }
  };

  const handleDelete = async (id: string, index: number) => {
    try {
      await window.withdrawToTheBankAccount.delete(id);

      const newWithdrawsToTheBankAccount = [...withdrawsToTheBankAccount];
      newWithdrawsToTheBankAccount.splice(index, 1);
      setWithdrawsToTheBankAccount(newWithdrawsToTheBankAccount);
      setDefaultWithdrawsToTheBankAccount(newWithdrawsToTheBankAccount);

      toast.success('Saque excluído com sucesso!', {
        progress: undefined,
      });
    } catch (err) {
      toast.error(`Erro ao excluir saque: ${(err as Error).message}`, {
        progress: undefined,
      });
    }
  };

  return (
    <div className="flex flex-col items-center w-full h-full">
      <h1 className="flex items-center font-semibold text-2xl text-zinc-900 h-20">
        Editar Saques em Conta Bancária
      </h1>
      <FilterByMonthAndYear
        monthValue={referenceMonth}
        yearValue={referenceYear}
        setReferenceMonth={setReferenceMonth}
        setReferenceYear={setReferenceYear}
      />
      <div className="flex w-full h-10 items-center justify-between border-y border-zinc-300 text-zinc-900">
        <span className="w-7/12 flex items-center justify-center">
          Valor (R$)
        </span>
        <span className="w-2/6 flex items-center justify-center">Editar</span>
      </div>
      <div className="w-full h-full flex flex-col overflow-auto scrollbar-thin scrollbar-thumb-zinc-900 scrollbar-track-zinc-300">
        {!withdrawsToTheBankAccount.length ? (
          <span className="m-auto text-zinc-500">
            Não há saques cadastrados para o mês e ano selecionados!
          </span>
        ) : (
          withdrawsToTheBankAccount.map(({ id, value }, index) => (
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
              deleteMessage={`Tem certeza que deseja excluir este saque, no valor de "R$ ${value}"? Esta ação não poderá ser desfeita. Clique em "SIM" para confirmar.`}
              deleteTitle="Excluir Saque em Conta Bancária"
              editType="saque em conta bancária"
            >
              <label className="w-7/12 flex items-center justify-center text-zinc-900">
                <input
                  required
                  title="Valor do saque"
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
  );
}
