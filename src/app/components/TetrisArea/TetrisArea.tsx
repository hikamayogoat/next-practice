import tetrisArea from "./tetrisArea.module.css";
import { useState } from "react";
import { MinoCandidate } from "./MinoCandidate/MinoCandidate";
import { TetrisTable } from "./TetrisTable/TetrisTable";
import { BlockKind } from "../../config/config";

export default function Top() {
  const [tableState, setTableState] = useState(getTableStateInitArray());
  const [currentBlock, setCurrentBlock] = useState(BlockKind.O);

  const tetrisFieldProps = {
    tableState: tableState,
    setTableState: setTableState,
    currentBlock: currentBlock,
  };

  const minoCandidateProps = {
    currentMino: currentBlock,
    setCurrentMino: setCurrentBlock,
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
    backgroundColor: "white",
  };

  var initArray = new Array(10).fill(initStyle);
  for (let i = 0; i < 10; i++) {
    initArray[i] = new Array(20).fill(initStyle);
  }

  return initArray;
}
