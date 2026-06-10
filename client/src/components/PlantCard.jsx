const typeLabels = {
  vegetable: 'Vegetable',
  herb: 'Herb',
  flower: 'Flower',
  shrub: 'Shrub',
}

function Detail({ label, value }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-sage-600/70">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm text-sage-800">{value}</dd>
    </div>
  )
}

export default function PlantCard({ plant }) {
  const typeLabel = typeLabels[plant.type] ?? plant.type

  return (
    <article className="flex flex-col rounded-xl border border-tan-200 bg-white p-5 shadow-sm">
      <header className="mb-4 flex items-start justify-between gap-3">
        <h3 className="text-lg font-medium text-sage-800">{plant.name}</h3>
        <span className="shrink-0 rounded-full bg-sage-100 px-2.5 py-0.5 text-xs font-medium text-sage-700">
          {typeLabel}
        </span>
      </header>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
        <Detail label="Planting window" value={plant.plantingWindow} />
        <Detail label="Sun needs" value={plant.sunNeeds} />
        <Detail label="Water needs" value={plant.waterNeeds} />
      </dl>

      <p className="mt-4 border-t border-tan-100 pt-4 text-sm leading-relaxed text-sage-600">
        {plant.description}
      </p>
    </article>
  )
}
