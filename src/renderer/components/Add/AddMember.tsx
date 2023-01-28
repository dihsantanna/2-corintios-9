import { useState } from 'react';
import { toast } from 'react-toastify';
import { AddForm } from './AddForm';

interface Member {
  name: string;
  congregated: boolean;
}

export function AddMember() {
  const [member, setMember] = useState<Member>({
    name: '',
    congregated: false,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = ({
    target: { type, checked, value, name },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setMember({
      ...member,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (member.name.length < 4) {
      toast.warn('Nome deve possuir pelo menos 4 caracteres', {
        progress: undefined,
      });
      return;
    }

    setLoading(true);

    try {
      await window.memberModel.create(member);
      toast.success(
        `Membro "${member.name.split(' ')[0]}" cadastrado com sucesso!`,
        {
          progress: undefined,
        }
      );
      setMember({
        name: '',
        congregated: false,
      });
    } catch (err) {
      toast.error(`Erro ao cadastrar membro: ${(err as Error).message}`, {
        progress: undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMember({
      name: '',
      congregated: false,
    });
  };

  return (
    <AddForm
      handleSubmit={handleSubmit}
      handleReset={handleReset}
      isLoading={loading}
      title="Cadastrar Membro"
    >
      <label className="flex items-center bg-zinc-900 p-2 border-l-4 border-teal-500 rounded-sm w-8/12">
        <input
          required
          title="Nome do membro"
          name="name"
          placeholder="Escreva o nome do membro aqui"
          onChange={handleChange}
          value={member.name}
          className="bg-zinc-900 placeholder:text-zinc-200 font-light block w-full appearance-none leading-normal"
        />
      </label>
      <label className="relative flex items-center w-max gap-2 text-zinc-900 cursor-pointer">
        {'É Congregado? '}
        <input
          type="checkbox"
          title="Marque a caixa caso não seja membro"
          checked={member.congregated}
          name="congregated"
          onChange={handleChange}
          className="focus:outline-2 focus:outline-teal-500 cursor-pointer"
        />
        <span className="absolute w-max -bottom-4 text-xs italic text-zinc-900 left-0">
          * marque a caixa caso não seja membro
        </span>
      </label>
    </AddForm>
  );
}
