import type { Expense, ExpenseCategory } from '#preload';

interface ExpenseTableProps {
  expenseCategories: ExpenseCategory[];
  expenses: Expense[];
}

export function ExpensesTable({ expenseCategories, expenses }: ExpenseTableProps) {
  return (
    <>
      {
        expenseCategories.map(({ id: categoryId, name }) => (
          <div className="w-full" key={categoryId}>
            <div className="w-full py-2 bg-blue-600 text-zinc-100 font-semibold text-lg text-center border">
              {name}
            </div>
            <div className="w-full flex items-center justify-center bg-zinc-900 text-zinc-100 font-semibold">
              <span className="w-1/2 border p-2">Título</span>
              <span className="w-1/2 text-right border p-2">Valor</span>
            </div>
            {
              expenses.find(({ expenseCategoryId }) => expenseCategoryId === categoryId)
                ? expenses.filter(({ expenseCategoryId }) => expenseCategoryId === categoryId)
                  .map(({ id, title, value }) => (
                    <div className="w-full  flex items-center justify-center" key={id}>
                      <span
                        className="w-1/2 border p-2"
                      >
                        {title}
                      </span>
                      <span
                        className="w-1/2 text-right p-2 border"
                      >
                        {
                          value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                        }
                      </span>
                    </div>
              ))
                : (
                    <div className="w-full  flex items-center justify-center">
                      <span
                        className="w-1/2 border p-2"
                      >
                        &nbsp;
                      </span>
                      <span
                        className="w-1/2 text-right p-2 border"
                      >
                        {
                          0.0.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                        }
                      </span>
                    </div>
                )
            }
            <div className="w-full flex flex-col">
              <span
                className="w-1/2 bg-zinc-900 text-zinc-100 flex items-center justify-end p-2 self-end border">
                {
                  `Total: ${expenses.reduce((total, { expenseCategoryId, value }) => (
                  expenseCategoryId === categoryId ? total + value : total
                  ), 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`
                }
              </span>
            </div>
          </div>
        ))
      }
    </>
  );
}
