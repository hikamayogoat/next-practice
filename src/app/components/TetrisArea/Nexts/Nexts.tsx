export type NextsProps = {
  nexts: number[];
};

export function Nexts(props: NextsProps) {
  return (
    <div>
      {props.nexts.map((minoNumber, index) => (
        <div key={`${index}`}>
          <div>{convertNumberToMinoName(minoNumber)}</div>
        </div>
      ))}
    </div>
  );
}

function convertNumberToMinoName(minoNumber: number) {
  switch (minoNumber) {
    case 0:
      return "O";
    case 1:
      return "Z";
    case 2:
      return "T";
    case 3:
      return "L";
    case 4:
      return "I";
    case 5:
      return "J";
    case 6:
      return "S";
  }
}
