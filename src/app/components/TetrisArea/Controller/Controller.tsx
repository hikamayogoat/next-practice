import { BlockKind, config } from "@/app/config/config";
import lodash from "lodash";
import { Dispatch, memo, SetStateAction } from "react";
import { convertNumberToMinoName } from "util/converter";
import { generateEmptyTableStyleArray } from "util/generater";
import { initializeHistory } from "util/history";
import { ControlMino as MinoStatus } from "../TetrisArea";
import controllerStyle from "./controller.module.css";

export type ControllerProps = {
  setMasterTableState: Dispatch<SetStateAction<any[][]>>;
  currentMino: MinoStatus;
  setCurrentMino: (newCurrentControlMino: MinoStatus) => void;
  historyIndexState: number | undefined;
  setHistoryIndexState: Dispatch<SetStateAction<number | undefined>>;
};

export function Controller(props: ControllerProps) {
  const minoCandidateList = [
    BlockKind.NONE,
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

  const destroyHistory = () => {
    if (confirm("保存されている履歴を全て削除します。よろしいですか？")) {
      initializeHistory();
      props.setMasterTableState(generateEmptyTableStyleArray);
      props.setHistoryIndexState(0);
    } else {
      return;
    }
  };

  const onHistoryControlClick = (direction: number) => () => {
    if (props.historyIndexState != undefined) {
      props.setHistoryIndexState(props.historyIndexState + direction);
    }
  };

  return (
    <div className={controllerStyle.list}>
      <div className={controllerStyle.controlPanel}>
        <div>
          {minoCandidateList.map((mino) => (
            <div key={`${mino}`} className={controllerStyle.item} onClick={onCandidateClick(mino)}>
              {convertNumberToMinoName(mino)}
            </div>
          ))}
        </div>
        <div>
          <div className={controllerStyle.item} onClick={onRotateClick(-1)}>
            左回転
          </div>
          <div className={controllerStyle.item} onClick={onRotateClick(1)}>
            右回転
          </div>
          <div className={controllerStyle.item} onClick={onHistoryControlClick(-1)}>
            Undo
          </div>
          <div className={controllerStyle.item} onClick={onHistoryControlClick(1)}>
            Redo
          </div>
          <div className={controllerStyle.item} onClick={destroyHistory}>
            履歴全削除
          </div>
        </div>
      </div>
    </div>
  );
}

export const ControllerMemo = memo(Controller);
