import { useState } from 'react';
import { SubmitButton } from '../SubmitButton';
import { ResetButton } from '../ResetButton';
import { DeleteModal } from '../DeleteModal';

interface EditFormProps {
  children?: React.ReactNode;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  handleReset: (event: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  isEditing: boolean;
  editingId: string;
  setIsEditing: (id: string) => void;
  className?: React.FormHTMLAttributes<HTMLFormElement>['className'];
  onDelete: () => void;
  deleteMessage: string;
  deleteTitle: string;
  editType?: string;
}

export function EditForm({
  children,
  handleSubmit,
  handleReset,
  isLoading,
  isEditing,
  editingId,
  setIsEditing,
  className,
  onDelete,
  deleteMessage,
  deleteTitle,
  editType,
}: EditFormProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <form
      onSubmit={handleSubmit}
      onReset={handleReset}
      className={`flex w-full h-16 min-h-[64px] items-center justify-between ${
        className || ''
      }`}
    >
      {children}
      <div className="flex items-center justify-center w-2/6 gap-2">
        {isEditing ? (
          <>
            <SubmitButton
              title={`Salvar ${editType}`}
              text="SALVAR"
              isLoading={isLoading}
              className="w-1/3 h-10 max-w-[100px] max-h-8"
            />
            <ResetButton
              title="Cancelar Edição"
              text="FECHAR"
              className="w-1/3 h-10 max-w-[100px] max-h-8"
            />
          </>
        ) : (
          <>
            <button
              title={`Editar ${editType || 'item'}`}
              onClick={() => setIsEditing(editingId)}
              className="focus:outline-none focus:bg-teal-500 focus:text-zinc-900 bg-zinc-900 hover:bg-teal-500 hover:text-zinc-900 cursor-pointer w-1/3 h-11 max-w-[100px] max-h-8 rounded-md font-semibold"
              type="button"
            >
              EDITAR
            </button>
            <button
              title={`Excluir ${editType || 'item'}`}
              onClick={() => setShowDeleteModal(true)}
              className="focus:outline-none focus:bg-yellow-500 focus:text-zinc-900 bg-red-600 hover:bg-yellow-500 hover:text-zinc-900 cursor-pointer w-1/3 h-11 max-w-[100px] max-h-8 rounded-md font-semibold"
              type="button"
            >
              EXCLUIR
            </button>
          </>
        )}
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
