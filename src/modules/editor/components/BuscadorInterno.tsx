import { type ChangeEvent } from 'react'

export interface BuscadorInternoProps {
  query: string
  onSearch: (query: string) => void
}

export function BuscadorInterno({ query, onSearch }: BuscadorInternoProps) {
  return (
    <div className="editor-search fixed bottom-4 right-4 rounded-2xl border border-slate-300 bg-white p-4 shadow-lg dark:border-slate-700 dark:bg-slate-950">
      <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Buscar</label>
      <input
        className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        type="text"
        value={query}
        onChange={(event: ChangeEvent<HTMLInputElement>) => onSearch(event.target.value)}
        placeholder="Buscar texto..."
      />
    </div>
  )
}
