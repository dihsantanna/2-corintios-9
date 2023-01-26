interface ResetButtonProps {
  text?: string | React.ReactNode
  className?: React.ButtonHTMLAttributes<HTMLButtonElement>['className']
  title?: string
}

export function ResetButton({text, className ,title}: ResetButtonProps) {
  return (
    <button
      title={title}
      type="reset"
      className={
        'bg-red-500 focus:outline-none focus:bg-yellow-500 focus:text-zinc-900 hover:bg-yellow-500 hover:text-zinc-900 cursor-pointer flex items-center justify-center rounded-md font-semibold '
        + className || ''
      }
    >
      {text || 'LIMPAR'}
    </button>
  );
}
