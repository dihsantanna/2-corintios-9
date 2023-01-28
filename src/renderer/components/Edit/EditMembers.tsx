import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { IMemberState } from 'main/@types/Member';
import { EditForm } from './EditForm';

export function EditMembers() {
  const [defaultMembers, setDefaultMembers] = useState<IMemberState[]>([]);
  const [members, setMembers] = useState<IMemberState[]>([]);
  const [editing, setEditing] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getMembers = async () => {
      try {
        const newMembers = await window.member.findAll();
        setMembers(newMembers);
        setDefaultMembers(newMembers);
      } catch (err) {
        toast.error(`Erro ao carregar membros: ${(err as Error).message}`, {
          progress: undefined,
        });
      }
    };

    getMembers();
  }, []);

  const handleReset = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMembers(defaultMembers);
    setEditing('');
  };

  const handleChange = (
    {
      target: { name, value },
    }: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index: number
  ) => {
    const key = name as keyof IMemberState;
    const newMember = {
      ...members[index],
      [key]: key === 'congregated' ? value === 'true' : value,
    } as IMemberState;

    const newMembers = [...members];
    newMembers.splice(index, 1, newMember);

    setMembers(newMembers);
  };

  const handleSetEditing = (id: string) => {
    setEditing(id);
    setMembers(defaultMembers);
  };

  const handleEdit = async (
    event: React.FormEvent<HTMLFormElement>,
    index: number
  ) => {
    event.preventDefault();
    const editedMember = members[index];
    if (editedMember === defaultMembers[index]) {
      toast.warn('Faça alguma modificação ou clique em fechar para cancelar', {
        progress: undefined,
      });
      return;
    }

    if (editedMember.name.length < 4) {
      toast.warn('Nome deve possuir pelo menos 4 caracteres', {
        progress: undefined,
      });
      return;
    }

    setLoading(true);
    try {
      await window.member.update(editedMember);

      toast.success(
        `Membro "${editedMember.name.split(' ')[0]}" alterado com sucesso!`,
        {
          progress: undefined,
        }
      );
      setDefaultMembers(members);
    } catch (err) {
      toast.error(`Erro ao editar membro: ${(err as Error).message}`, {
        progress: undefined,
      });
    } finally {
      setLoading(false);
      setEditing('');
    }
  };

  const handleDelete = async (id: string, index: number) => {
    try {
      await window.member.delete(id);
      const newMembers = [...members];
      newMembers.splice(index, 1);
      setMembers(newMembers);
      setDefaultMembers(newMembers);

      toast.success('Membro excluído com sucesso!', {
        progress: undefined,
      });
    } catch (err) {
      toast.error(`Erro ao excluir membro: ${(err as Error).message}`, {
        progress: undefined,
      });
    }
  };

  return (
    <div className="flex flex-col items-center w-full h-full">
      <h1 className="flex items-center font-semibold text-2xl text-zinc-900 h-20">
        Editar Membros
      </h1>
      <div className="flex w-full h-10 items-center justify-between border-y border-zinc-300 text-zinc-900">
        <span className="w-6/12 flex items-center justify-center">Nome</span>
        <span className="w-1/12 flex items-center justify-center">
          Congregado
        </span>
        <span className="w-2/6 flex items-center justify-center">Editar</span>
      </div>
      <div className="w-full h-full overflow-auto scrollbar-thin scrollbar-thumb-zinc-900 scrollbar-track-zinc-300">
        {members.map(({ id, name, congregated }, index) => (
          <EditForm
            key={id}
            handleSubmit={(event: React.FormEvent<HTMLFormElement>) =>
              handleEdit(event, index)
            }
            handleReset={handleReset}
            isLoading={loading}
            editingId={id}
            isEditing={editing === id}
            setIsEditing={handleSetEditing}
            className={index % 2 === 0 ? 'bg-zinc-100' : ''}
            onDelete={() => handleDelete(id, index)}
            deleteMessage={`Tem certeza que deseja excluir o membro "${
              name.split(' ')[0]
            }"? Esta ação não poderá ser desfeita. Clique em "SIM" para confirmar.`}
            deleteTitle="Excluir Membro"
            editType="membro"
          >
            <label className="w-6/12 flex items-center justify-center text-zinc-900">
              <input
                title="Nome do membro"
                name="name"
                value={name}
                onChange={(event) => handleChange(event, index)}
                className="text-center text-zinc-200 bg-zinc-900 p-2 disabled:p-0 disabled:text-zinc-900 disabled:bg-transparent font-light disabled:font-normal block w-11/12 h-full appearance-none leading-normal rounded-sm"
                disabled={editing !== id}
              />
            </label>
            <label className="w-1/12 flex items-center justify-center text-zinc-900">
              <select
                title="É congregado?"
                value={congregated ? 'true' : 'false'}
                name="congregated"
                onChange={(event) => handleChange(event, index)}
                className="cursor-pointer disabled:cursor-default text-center text-zinc-200 bg-zinc-900 p-2 disabled:p-0 disabled:text-zinc-900 disabled:bg-transparent font-light disabled:font-normal block w-full h-full disabled:appearance-none leading-normal rounded-sm"
                disabled={editing !== id}
              >
                <option disabled value="">
                  É Congregado?
                </option>
                <option title="true" value="true">
                  Sim
                </option>
                <option title="false" value="false">
                  Não
                </option>
              </select>
            </label>
          </EditForm>
        ))}
      </div>
    </div>
  );
}
