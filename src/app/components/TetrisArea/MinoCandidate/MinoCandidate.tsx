import { BlockKind } from "@/app/config/config";
import { convertNumberToMinoName } from "util/converter";
import minoCandidateStyle from "./minoCandidate.module.css";

export type MinoCandidateProps = {
  currentMino: BlockKind;
  setCurrentMino: (mino: number) => void;
};

export function MinoCandidate(props: MinoCandidateProps) {
  const minoCandidateList = [
    BlockKind.O,
    BlockKind.Z,
    BlockKind.T,
    BlockKind.L,
    BlockKind.I,
    BlockKind.J,
    BlockKind.S,
    BlockKind.WHITE,
    BlockKind.GRAY,
  ];

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
