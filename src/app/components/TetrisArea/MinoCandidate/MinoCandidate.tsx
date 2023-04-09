import { BlockKind } from "@/app/config/config";
import lodash from "lodash";
import { memo, useCallback } from "react";
import { convertNumberToMinoName } from "util/converter";
import { ControlMino as MinoStatus } from "../TetrisArea";
import minoCandidateStyle from "./minoCandidate.module.css";

export type ControllerProps = {
  currentMino: MinoStatus;
  setCurrentMino: (newCurrentControlMino: MinoStatus) => void;
};

function Controller(props: ControllerProps) {
  const minoCandidateList = [
    BlockKind.O,
    BlockKind.Z,
    BlockKind.T,
    BlockKind.L,
    BlockKind.I,
    BlockKind.J,
    BlockKind.S,
    BlockKind.GRAY,
    BlockKind.ERASER,
  ];

  const onCandidateClick = (mino: BlockKind) => () => {
    const newCurrentControlMino: MinoStatus = {
      blockKind: mino,
      rotation: 0,
    };
    props.setCurrentMino(newCurrentControlMino);
  };

  const onRotateClick = (direction: number) => () => {
    const cloneControlMino = lodash.cloneDeep(props.currentMino);
    const newCurrentControlMino: MinoStatus = {
      blockKind: cloneControlMino.blockKind,
      rotation: (cloneControlMino.rotation + direction + 4) % 4,
    };
    props.setCurrentMino(newCurrentControlMino);
  };

  return (
    <div className={minoCandidateStyle.list}>
      <div className={minoCandidateStyle.controlPanel}>
        <div>
          {minoCandidateList.map((mino) => (
            <div
              key={`${mino}`}
              className={minoCandidateStyle.item}
              onClick={onCandidateClick(mino)}
            >
              {convertNumberToMinoName(mino)}
            </div>
          ))}
        </div>
        <div>
          <div className={minoCandidateStyle.item} onClick={onRotateClick(-1)}>
            左回転
          </div>
          <div className={minoCandidateStyle.item} onClick={onRotateClick(1)}>
            右回転
          </div>
          <div className={minoCandidateStyle.item}>Undo（未）</div>
          <div className={minoCandidateStyle.item}>Redo（未）</div>
        </div>
      </div>
    </div>
  );
}

export const MinoCandidateMemo = memo(Controller);
