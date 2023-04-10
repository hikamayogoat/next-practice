import tetrisArea from "./tetrisArea.module.css";
import { useEffect, useState } from "react";
import { ControllerMemo } from "./Controller/Controller";
import { TetrisTable as TetrisTable } from "./TetrisTable/TetrisTable";
import { BlockKind, config } from "../../config/config";
import { convertHistoryFromTableStyle } from "util/converter";
import { loggingHistoryTable } from "util/debug";

export default function Top() {
  const [masterTableState, setMasterTableState] = useState<any[][]>(getTableStateInitArray());
  const [currentMino, setCurrentMino] = useState({
    blockKind: BlockKind.O,
    rotation: 0,
  });

  const tetrisFieldProps = {
    masterTableState: masterTableState,
    setMasterTableState: setMasterTableState,
    currentMino: currentMino,
    setCurrentMino: setCurrentMino,
  };

  const minoCandidateProps = {
    currentMino: currentMino,
    setCurrentMino: setCurrentMino,
  };

  useEffect(() => {
    const historyJSON = localStorage.getItem(config.historyKey);
    if (historyJSON == null) {
      // 初回起動時
      const emptyTable = convertHistoryFromTableStyle(masterTableState);
      localStorage.setItem(config.historyKey, JSON.stringify(emptyTable));
    } else {
      const prevHistory: string[][][] = JSON.parse(historyJSON);
      const newElement: any[][] = convertHistoryFromTableStyle(masterTableState);
      const nextHistory = [...prevHistory, newElement];
      localStorage.setItem(config.historyKey, JSON.stringify(nextHistory));
      for (let i = 0; i < prevHistory.length; i++) {
        loggingHistoryTable(prevHistory[i]);
      }
    }
  }, [masterTableState]);

  return (
    <div className={tetrisArea.top}>
      <TetrisTable {...tetrisFieldProps} />
      <ControllerMemo {...minoCandidateProps} />
    </div>
  );
}

function getTableStateInitArray() {
  const initArray = new Array(10);
  for (let x = 0; x < 10; x++) {
    initArray[x] = new Array(20).fill({
      backgroundColor: config.defaultBackgroundColor,
    });
  }
  return initArray;
}

export type ControlMino = {
  blockKind: BlockKind;
  rotation: number;
};
