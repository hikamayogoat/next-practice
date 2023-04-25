import { BlockKind, config } from "@/app/config/config";
import lodash from "lodash";
import { Dispatch, memo, SetStateAction, useEffect } from "react";
import { convertNumberToMinoName } from "util/converter";
import { generateEmptyTableStyleArray } from "util/generater";
import { initializeHistory, initializeUsedMinoHistory } from "util/history";
import { ControlMino as MinoStatus } from "../TetrisArea";
import controllerStyle from "./controller.module.css";
import { FaRedo, FaUndo } from "react-icons/fa";
import { FcUndo, FcRedo } from "react-icons/fc";
import { AiFillDelete } from "react-icons/ai";

export type ControllerProps = {
  setMasterTableState: Dispatch<SetStateAction<any[][]>>;
  currentMino: MinoStatus;
  setCurrentMino: (newCurrentControlMino: MinoStatus) => void;
  historyIndexState: number | undefined;
  setHistoryIndexState: Dispatch<SetStateAction<number | undefined>>;
  unavailableMinoList: number[];
};

export function Controller(props: ControllerProps) {
  // config.BlockKind と同じ順番にしないと不整合が起こるので注意
  const blockKindList = [
    BlockKind.O,
    BlockKind.Z,
    BlockKind.T,
    BlockKind.L,
    BlockKind.I,
    BlockKind.J,
    BlockKind.S,
    BlockKind.NONE,
    // BlockKind.GRAY,
    // BlockKind.ERASER,
  ];

  const onMinoClick = (mino: BlockKind) => () => {
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
      initializeUsedMinoHistory();
      props.setMasterTableState(generateEmptyTableStyleArray);
      props.setHistoryIndexState(0);
    } else {
      return;
    }
  };

  const onHistoryControlClick = (direction: number) => () => {
    if (props.historyIndexState != undefined) {
      const newIndex = props.historyIndexState + direction;
      const historyRaw = localStorage.getItem(config.historyStorageKey);
      const history = historyRaw ? JSON.parse(historyRaw) : [];
      if (newIndex >= 0 && newIndex < history.length) {
        props.setHistoryIndexState(newIndex);
      }
    }
  };

  return (
    <div className={controllerStyle.list}>
      <div className={controllerStyle.controlPanel}>
        <div>
          {blockKindList.map((mino) =>
            props.unavailableMinoList.includes(mino) ? (
              <div key={`${mino}`} className={controllerStyle.item}>
                <img
                  src={`/${convertNumberToMinoName(mino)}x.png`}
                  alt=""
                  className={controllerStyle.boxImage}
                />
              </div>
            ) : (
              <div key={`${mino}`} className={controllerStyle.item} onClick={onMinoClick(mino)}>
                <img
                  src={`/${convertNumberToMinoName(mino)}.png`}
                  alt=""
                  className={controllerStyle.boxImage}
                />
              </div>
            )
          )}
        </div>
        <div>
          <div className={controllerStyle.item} onClick={onRotateClick(-1)}>
            <FaUndo className={controllerStyle.boxIcon}></FaUndo>
          </div>
          <div className={controllerStyle.item} onClick={onRotateClick(1)}>
            <FaRedo className={controllerStyle.boxIcon}></FaRedo>
          </div>
          <div className={controllerStyle.item} onClick={onHistoryControlClick(-1)}>
            <FcUndo className={controllerStyle.boxIcon}></FcUndo>
          </div>
          <div className={controllerStyle.item} onClick={onHistoryControlClick(1)}>
            <FcRedo className={controllerStyle.boxIcon}></FcRedo>
          </div>
          <div className={controllerStyle.item} onClick={destroyHistory}>
            <AiFillDelete className={controllerStyle.boxIcon}></AiFillDelete>
          </div>
        </div>
      </div>
    </div>
  );
}

export const ControllerMemo = memo(Controller);
