import { SubmitButton } from '../SubmitButton';
import { ResetButton } from '../ResetButton';
import { DeleteModal } from '../DeleteModal';
import { useState } from 'react';

interface EditFormProps {
  children?: React.ReactNode
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  handleReset: (event: React.FormEvent<HTMLFormElement>) => void
  isLoading: boolean
  isEditing: boolean
  editingId: string
  setIsEditing: (id: string) => void
  className?: React.FormHTMLAttributes<HTMLFormElement>['className']
  onDelete: () => void
  deleteMessage: string
  deleteTitle: string
}

export function EditForm({
  children, handleSubmit, handleReset, isLoading, isEditing, editingId, setIsEditing, className, onDelete, deleteMessage, deleteTitle,
}: EditFormProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
              <SubmitButton text="SALVAR" isLoading={isLoading} className="w-1/3 h-11" />
              <ResetButton text="FECHAR" className="w-1/3 h-11" />
            </>
            : (
              <>
                <button
                  onClick={() => setIsEditing(editingId)}
                  className="bg-zinc-900 hover:bg-teal-500 hover:text-zinc-900 cursor-pointer w-1/3 h-11 rounded-md font-semibold"
                  type="button"
                >
                  EDITAR
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="bg-red-600 hover:bg-yellow-500 hover:text-zinc-900 cursor-pointer w-1/3 h-11 rounded-md font-semibold"
                  type="button"
                >
                  EXCLUIR
                </button>
              </>
            )
        }
        <DeleteModal
          message={deleteMessage}
          title={deleteTitle}
          onDelete={onDelete}
          onHide={setShowDeleteModal}
          show={showDeleteModal}
        />
      </div>
    </form>
  );
}
