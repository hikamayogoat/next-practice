import tetrisArea from "./tetrisArea.module.css";
import { memo, useCallback, useState } from "react";
import { MinoCandidate } from "./MinoCandidate/MinoCandidate";
import { TetrisTable } from "./TetrisTable/TetrisTable";
import { BlockKind, constVars } from "../../config/config";

export default function Top() {
  const [tableState, setTableState] = useState(getTableStateInitArray());
  const [currentMino, setCurrentMino] = useState({
    // TODO: 何も選択されていない状態を用意する
    blockKind: BlockKind.O,
    rotation: 0,
  });

  const tetrisFieldProps = {
    tableState: tableState,
    setTableState: setTableState,
    currentMino: currentMino,
    setCurrentMino: setCurrentMino,
  };

  const minoCandidateProps = {
    currentMino: currentMino,
    setCurrentMino: setCurrentMino,
  };

  return (
    <div className={tetrisArea.top}>
      <TetrisTable {...tetrisFieldProps} />
      <MinoCandidate {...minoCandidateProps} />
    </div>
  );
}

function getTableStateInitArray() {
  const initStyle = {
    backgroundColor: constVars.defaultBackgroundColor,
  };

  var initArray = new Array(10).fill(initStyle);
  for (let i = 0; i < 10; i++) {
    initArray[i] = new Array(20).fill(initStyle);
  }

  return initArray;
}

export type ControlMino = {
  blockKind: BlockKind;
  rotation: number;
};
