interface ResetButtonProps {
  text?: string | React.ReactNode
  className?: React.ButtonHTMLAttributes<HTMLButtonElement>['className']
}

export function ResetButton({text, className}: ResetButtonProps) {
  return (
    <button
      type="reset"
      className={
        'bg-red-500 hover:bg-yellow-500 hover:text-zinc-900 cursor-pointer w-32 h-14  flex items-center justify-center rounded-md font-semibold '
        + className || ''
      }
    >
      {text || 'LIMPAR'}
    </button>
  );
}
