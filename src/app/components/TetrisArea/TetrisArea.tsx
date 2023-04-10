import tetrisArea from "./tetrisArea.module.css";
import { useCallback, useState } from "react";
import { MinoCandidateMemo } from "./MinoCandidate/MinoCandidate";
import { TetrisTable as TetrisTable } from "./TetrisTable/TetrisTable";
import { BlockKind, config } from "../../config/config";

export default function Top() {
  const [tableHistoryState, setTableHistoryState] = useState<any[][][]>(getTableStateInitArray());
  const [currentMino, setCurrentMino] = useState({
    // TODO: 何も選択されていない状態を用意する
    blockKind: BlockKind.O,
    rotation: 0,
  });

  const tetrisFieldProps = {
    tableHistoryState: tableHistoryState,
    setTableHistoryState: setTableHistoryState,
    currentMino: currentMino,
    setCurrentMino: setCurrentMino,
  };

  const minoCandidateProps = {
    currentMino: currentMino,
    setCurrentMino: useCallback(setCurrentMino, []),
  };

  return (
    <div className={tetrisArea.top}>
      <TetrisTable {...tetrisFieldProps} />
      <MinoCandidateMemo {...minoCandidateProps} />
    </div>
  );
}

function getTableStateInitArray() {
  const initArray = new Array(config.historyLength);
  for (let n = 0; n < config.historyLength; n++) {
    initArray[n] = new Array(10);
  }
  for (let n = 0; n < config.historyLength; n++) {
    for (let x = 0; x < 10; x++) {
      initArray[n][x] = new Array(20).fill({
        backgroundColor: config.defaultBackgroundColor,
      });
    }
  }
  return initArray;
}

export type ControlMino = {
  blockKind: BlockKind;
  rotation: number;
};
