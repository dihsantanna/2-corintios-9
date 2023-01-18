import { ImSpinner2 } from 'react-icons/im';

interface SubmitButtonProps {
  isLoading: boolean
  text: string
}

export function SubmitButton({isLoading}: SubmitButtonProps) {
  return (
      <button
        disabled={isLoading}
        type="submit"
        className="bg-zinc-900 hover:bg-teal-500 hover:text-zinc-900 cursor-pointer w-32 h-14 rounded-md font-semibold"
      >
        {isLoading ? <ImSpinner2 className="w-5 h-5 m-auto animate-spin" /> : 'Cadastrar'}
      </button>
  );
}
