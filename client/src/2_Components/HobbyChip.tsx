import { FiXCircle } from "react-icons/fi"

type HobbyChipProps = {
  label: string
  handleClick: () => void
}

export function HobbyChip({ label, handleClick }: HobbyChipProps) {

  const hobbyChipColors = ['#D4EA87', '#ACE081', '#8FD481', '#6BC188', '#49AD8F', '#2E969A', '#177FA3', '#196A95', '#1C5586']

  return (
    <div className='hobbies input-holder hobby-chip' style={{ backgroundColor: hobbyChipColors[0] }}>
      <p>{label}</p>
      <button className='hobbies chip-x' ><FiXCircle size={25}
        style={{ color: 'black' }} onClick={handleClick} /></button>
    </div>
  )
}
