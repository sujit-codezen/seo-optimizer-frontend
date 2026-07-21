import { IconLightbulb } from './Icons'

export default function Suggestions({ suggestions }) {
  if (!suggestions || suggestions.length === 0) return null

  return (
    <div className="glass-card p-6">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <IconLightbulb size={20} className="text-amber-500" /> Suggestions
      </h3>
      <div className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg"
          >
            <span className="text-indigo-400 mt-0.5">•</span>
            <p className="text-sm text-gray-300">{suggestion}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
