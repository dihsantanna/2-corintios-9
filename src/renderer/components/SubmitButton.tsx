import { ImSpinner2 } from 'react-icons/im';

interface SubmitButtonProps {
  isLoading: boolean;
  text: string | React.ReactNode;
  className?: React.ButtonHTMLAttributes<HTMLButtonElement>['className'];
  title?: string;
}

export function SubmitButton({
  isLoading,
  text,
  className,
  title,
}: SubmitButtonProps) {
  return (
    <button
      title={isLoading ? 'Carregando...' : title}
      disabled={isLoading}
      type="submit"
      className={
        `bg-zinc-900 focus:outline-none focus:bg-teal-500 focus:text-zinc-900 hover:bg-teal-500 hover:text-zinc-900 cursor-pointer flex items-center justify-center rounded-md font-semibold ${className}` ||
        ''
      }
    >
      {isLoading ? (
        <ImSpinner2 className="w-5 h-5 m-auto animate-spin" />
      ) : (
        text
      )}
    </button>
  );
}
