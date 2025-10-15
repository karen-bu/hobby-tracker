import { FiXCircle } from 'react-icons/fi';

type HobbyChipProps = {
  label: string;
  handleClick: () => void;
  index: number;
};

export function HobbyChip({ label, handleClick, index }: HobbyChipProps) {
  const hobbyChipColors = [
    '#D4EA87',
    '#ACE081',
    '#8FD481',
    '#6BC188',
    '#49AD8F',
    '#2E969A',
    '#177FA3',
    '#196A95',
    '#1C5586',
    '#17456C',
  ];
  const hobbyChipColorsReverse = [
    '#17456C',
    '#1C5586',
    '#196A95',
    '#177FA3',
    '#2E969A',
    '#49AD8F',
    '#6BC188',
    '#8FD481',
    '#ACE081',
    '#D4EA87',
  ];

  function findChipColor() {
    if (index > 9 && index <= 18) {
      const reversed = Math.abs(hobbyChipColors.length - index);
      return hobbyChipColorsReverse[reversed];
    }
    if (index > 18 && index <= 27) {
      return hobbyChipColors[index - 18];
    }
    if (index > 27) {
      return '#17456C';
    } else return hobbyChipColors[index];
  }

  function findChipFontColor() {
    const chipColor = findChipColor();
    if (
      chipColor === '#17456C' ||
      chipColor === '#1C5586' ||
      chipColor === '#196A95' ||
      chipColor === '#177FA3'
    ) {
      return '#FFFFFF';
    } else return '#000000';
  }

  const chipColor = findChipColor();
  const chipFontColor = findChipFontColor();

  return (
    <div
      className="hobbies input-wrapper hobby-chip"
      style={{
        backgroundColor: chipColor,
        borderColor: chipColor,
      }}>
      <p className="hobbies hobby-chip" style={{ color: chipFontColor }}>
        {label}
      </p>
      <button className="hobbies chip-x">
        <FiXCircle
          size={25}
          style={{ color: chipFontColor }}
          onClick={handleClick}
        />
      </button>
    </div>
  );
}
