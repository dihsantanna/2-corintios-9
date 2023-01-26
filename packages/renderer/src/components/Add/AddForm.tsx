import { ResetButton } from '../ResetButton';
import { SubmitButton } from '../SubmitButton';

interface AddFormProps {
  children: React.ReactNode;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  handleReset: (event: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  title: string;
}

export function AddForm({ children, handleSubmit, handleReset, isLoading, title }: AddFormProps) {
  return (
    <form
      onSubmit={handleSubmit}
      onReset={handleReset}
      className="flex flex-col justify-center items-center gap-8 w-11/12 h-5/6"
    >
      <fieldset className="border-2 border-zinc-900 rounded-md w-full h-full p-12 flex flex-col justify-evenly">
        <legend className="text-2xl text-zinc-900 font-semibold">{title}</legend>
        {children}
      </fieldset>
      <div className="flex w-max h-max gap-4">
        <SubmitButton title={title} isLoading={isLoading} text="CADASTRAR" className="w-32 h-14" />
        <ResetButton title="Limpar Formulário" className="w-32 h-14" />
      </div>
    </form>
  );
}
