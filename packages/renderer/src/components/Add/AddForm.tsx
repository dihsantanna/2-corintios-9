import { SubmitButton } from '../SubmitButton';
import type { Screens } from '/@/@types/Screens.type';

interface AddFormProps {
  screenSelected: Screens;
  children: React.ReactNode;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  screenName: Screens;
  isLoading: boolean;
  title: string;
}

export function AddForm({ children, handleSubmit, isLoading, screenName, screenSelected, title }: AddFormProps) {
  return (
    <form
      onSubmit={handleSubmit}
      style={{
      display: screenSelected === screenName ? 'flex' : 'none',
      }}
      className="flex-col justify-center items-center gap-8 w-11/12 h-5/6"
    >
      <fieldset className="border-2 border-zinc-900 rounded-md w-full h-full p-12 flex flex-col justify-evenly">
        <legend className="text-2xl text-zinc-900 font-semibold">{title}</legend>
        {children}
      </fieldset>
      <SubmitButton isLoading={isLoading} text="Cadastrar" />
    </form>
  );
}
