/**
 * Fund information type
 */
type Fund = { 
  /** URL to the strike fund */
  url: string; 
  /** Display title for the strike fund */
  title: string 
}

/**
 * Component that renders a bio with the last word as a clickable strike fund link.
 * If the bio is empty, it displays only the fund title as a link.
 * Otherwise, it splits the bio by spaces and makes the last word a clickable link.
 * 
 * @param props - Component props
 * @param props.bio - The bio text to display
 * @param props.fund - Fund information containing URL and title
 * @returns JSX element with bio text and clickable fund link
 */
export function BioWithFund({ bio, fund }: { bio: string; fund: Fund }) {
  const trimmed = (bio || '').trim()
  
  // If bio is empty, show only the fund link
  if (!trimmed) {
    return (
      <span>
        <a href={fund.url} target="_blank" rel="noreferrer" className="link-blue">{fund.title}</a>
      </span>
    )
  }
  
  // Split bio into words and make the last word a clickable link
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


