import MinoCandidate from "./MinoCandidate/MinoCandidate";
import TetrisField from "./TetrisTable/TetrisTable";

export default function Top() {
  return (
    <div>
      <TetrisField />
      <MinoCandidate />
    </div>
  );
}
