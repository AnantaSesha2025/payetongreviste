type Fund = { url: string; title: string }

export function BioWithFund({ bio, fund }: { bio: string; fund: Fund }) {
  const trimmed = (bio || '').trim()
  if (!trimmed) {
    return (
      <span>
        <a href={fund.url} target="_blank" rel="noreferrer" className="link-blue">{fund.title}</a>
      </span>
    )
  }
  const parts = trimmed.split(/\s+/)
  const last = parts.pop() as string
  const before = parts.join(' ')
  return (
    <span>
      {before && <span>{before} </span>}
      <a href={fund.url} target="_blank" rel="noreferrer" className="link-blue">{last}</a>
    </span>
  )
}


