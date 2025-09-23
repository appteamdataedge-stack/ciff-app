import { useAlerts } from './AlertContext'

function AlertToaster() {
  const { alerts, remove } = useAlerts()
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {alerts.map((a) => (
        <div key={a.id} className={`rounded-md border px-4 py-3 shadow-sm bg-white ${a.kind === 'success' ? 'border-green-300' : a.kind === 'error' ? 'border-red-300' : 'border-gray-300'}`}>
          <div className="flex items-start gap-3">
            <div className={`h-2 w-2 rounded-full mt-2 ${a.kind === 'success' ? 'bg-green-500' : a.kind === 'error' ? 'bg-red-500' : 'bg-gray-500'}`} />
            <div className="text-sm text-gray-800">{a.message}</div>
            <button onClick={() => remove(a.id)} className="ml-auto text-xs text-gray-500 hover:text-gray-700">Dismiss</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AlertToaster


