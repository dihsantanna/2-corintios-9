import { useEffect, useState } from 'react';
import { EditForm } from './EditForm';
import type { Screens } from '/@/@types/Screens.type';
import type { Member} from '#preload';
import { updateMember } from '#preload';
import { findAllMembers } from '#preload';
import { toast } from 'react-toastify';

interface EditMemberProps {
  screenSelected: Screens;
}

export function EditMembers({ screenSelected }: EditMemberProps) {
  const [defaultMembers, setDefaultMembers] = useState<Member[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [editing, setEditing] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    findAllMembers().then((members) => {
      setMembers(members);
      setDefaultMembers(members);
    });
  }, []);

  const handleReset = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMembers(defaultMembers);
    setEditing('');
  };

  const handleChange = (
    { target: { name, value } }: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index: number,
  ) => {
    const key = name as keyof typeof newMember;
    const newMember = {
      ...members[index],
      [key]: key === 'congregated' ? value === 'true' : value,
    } as Member;

    const newMembers = [...members];
    newMembers.splice(index, 1, newMember);

    setMembers(newMembers);
  };

  const handleSetEditing = (id: string) => {
    setEditing(id);
    setMembers(defaultMembers);
  };

  const handleEdit = (event: React.FormEvent<HTMLFormElement>, index: number) => {
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
    updateMember(editedMember).then(() => {
      toast.success(`Membro "${editedMember.name.split(' ')[0]}" alterado com sucesso!`, {
        progress: undefined,
      });
      setDefaultMembers(members);
    }).catch((err) => {
      toast.error(`Erro ao editar membro: ${err.message}`, {
        progress: undefined,
      });
    }).finally(() => {
      setLoading(false);
      setEditing('');
    }) ;
  };

  return (
    <div
      style={{
      display: screenSelected === 'editMembers' ? 'flex' : 'none',
      }}
      className="flex-col items-center w-full h-full"
    >
      <h1 className="flex items-center font-semibold text-2xl text-zinc-900 h-20">Editar Membros</h1>
      <div
        className="flex w-full h-10 items-center justify-between border-y border-zinc-300 text-zinc-900"
      >
        <span className="w-1/6 flex items-center justify-center">id</span>
        <span className="w-4/12 flex items-center justify-center">Nome</span>
        <span className="w-1/12 flex items-center justify-center">Congregado</span>
        <span className="w-2/6 flex items-center justify-center">Editar</span>
      </div>
      {members.map(({id, name, congregated}, index) => (
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
            <input
              name="name"
              value={name}
              onChange={(event) => handleChange(event, index)}
              className="text-center text-zinc-200 bg-zinc-900 p-2 disabled:p-0 disabled:text-zinc-900 disabled:bg-transparent font-light focus:outline-none block w-full h-full appearance-none leading-normal rounded-sm"
              disabled={editing !== id}
            />
          </label>
          <label className="w-1/12 flex items-center justify-center text-zinc-900">
            <select
              value={congregated ? 'true' : 'false'}
              name="congregated"
              onChange={(event) => handleChange(event, index)}
              className="cursor-pointer disabled:cursor-default text-center text-zinc-200 bg-zinc-900 p-2 disabled:p-0 disabled:text-zinc-900 disabled:bg-transparent font-light focus:outline-none block w-full h-full disabled:appearance-none leading-normal rounded-sm"
              disabled={editing !== id}
            >
              <option disabled value="">É Congregado?</option>
              <option value="true">Sim</option>
              <option value="false">Não</option>
            </select>
          </label>
        </EditForm>
      ))}
    </div>
  );
}
