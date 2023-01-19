import { SubmitButton } from '../SubmitButton';
import { ResetButton } from '../ResetButton';

interface EditFormProps {
  children?: React.ReactNode
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  handleReset: (event: React.FormEvent<HTMLFormElement>) => void
  isLoading: boolean
  isEditing: boolean
  editingId: string
  setIsEditing: (id: string) => void
  className?: React.FormHTMLAttributes<HTMLFormElement>['className']
}

export function EditForm({
  children, handleSubmit, handleReset, isLoading, isEditing, editingId, setIsEditing, className,
}: EditFormProps) {
  return (
    <form
      onSubmit={handleSubmit}
      onReset={handleReset}
      className={
        'flex w-full h-20 items-center justify-between '
        + className || ''
      }
    >
      {children}
      <div className="flex items-center justify-center w-2/6 gap-2">
        {
          isEditing
            ? <>
              <SubmitButton text="SALVAR" isLoading={isLoading} className="w-1/5 h-7" />
              <ResetButton text="FECHAR" className="w-1/5 h-7" />
            </>
            : <button
              onClick={() => setIsEditing(editingId)}
              className="bg-zinc-900 hover:bg-teal-500 hover:text-zinc-900 cursor-pointer w-20 h-11 rounded-md font-semibold"
            >
              EDITAR
            </button>
        }
      </div>
    </form>
  );
}
