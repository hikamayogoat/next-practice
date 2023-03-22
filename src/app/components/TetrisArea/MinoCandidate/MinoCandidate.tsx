import { Mino } from "@/app/config/config";
import { convertNumberToMinoName } from "util/converter";
import minoCandidateStyle from "./minoCandidate.module.css";

export type MinoCandidateProps = {
  currentMino: Mino;
  setCurrentMino: (mino: number) => void;
};

export function MinoCandidate(props: MinoCandidateProps) {
  const minoCandidateList = [Mino.O, Mino.Z, Mino.T, Mino.L, Mino.I, Mino.J, Mino.S];

  const onCandidateClick = (mino: number) => () => {
    props.setCurrentMino(mino);
  };

  return (
    <div className={minoCandidateStyle.list}>
      {minoCandidateList.map((mino) => (
        <div key={`${mino}`} className={minoCandidateStyle.item} onClick={onCandidateClick(mino)}>
          {convertNumberToMinoName(mino)}
        </div>
      ))}
    </div>
  );
}
