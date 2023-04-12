import tetrisArea from "./tetrisArea.module.css";
import { useEffect, useState } from "react";
import { ControllerMemo } from "./Controller/Controller";
import { TetrisTable as TetrisTable } from "./TetrisTable/TetrisTable";
import { BlockKind, config } from "../../config/config";
import { convertToHistoryFromTableStyle, convertToTableStyleFromHistory } from "util/converter";
import { isSameTable as isSameTable } from "util/checker";
import { initializeHistory } from "util/history";
import { generateEmptyTableStyleArray } from "util/generater";

export default function Top() {
  const [masterTableState, setMasterTableState] = useState<any[][]>(generateEmptyTableStyleArray());
  const [currentMino, setCurrentMino] = useState({
    blockKind: BlockKind.NONE,
    rotation: 0,
  });

  const tetrisFieldProps = {
    masterTableState: masterTableState,
    setMasterTableState: setMasterTableState,
    currentMino: currentMino,
    setCurrentMino: setCurrentMino,
  };

  const minoCandidateProps = {
    setMasterTableState: setMasterTableState,
    currentMino: currentMino,
    setCurrentMino: setCurrentMino,
  };

  useEffect(() => {
    const history = localStorage.getItem(config.historyStorageKey);
    if (history != null) {
      return;
    } else {
      initializeHistory();
      // 無限ループ回避用フラグ
      localStorage.setItem(config.recoveryFlagStorageKey, "false");
    }
  }, []);

  useEffect(() => {
    const historyRaw = localStorage.getItem(config.historyStorageKey);
    const justRecoveredRaw = localStorage.getItem(config.recoveryFlagStorageKey);
    if (historyRaw != null && justRecoveredRaw != null) {
      const justRecovered = justRecoveredRaw == "true" ? true : false;
      const prevHistory: string[][][] = JSON.parse(historyRaw);
      const emptyTable: string[][] = generateEmptyTableStyleArray();

      if (
        !justRecovered &&
        !isSameTable(prevHistory[prevHistory.length - 1], emptyTable) &&
        currentMino.blockKind == BlockKind.NONE
      ) {
        if (confirm("過去のデータがあります。復元しますか？")) {
          setMasterTableState(convertToTableStyleFromHistory(prevHistory[prevHistory.length - 1]));
          localStorage.setItem(config.recoveryFlagStorageKey, "true");
        } else {
          localStorage.removeItem(config.historyStorageKey);
          initializeHistory();
        }
      } else if (!isSameTable(prevHistory[prevHistory.length - 1], masterTableState)) {
        localStorage.setItem(config.recoveryFlagStorageKey, "false");
        const newHistory = [...prevHistory, convertToHistoryFromTableStyle(masterTableState)];
        localStorage.setItem(config.historyStorageKey, JSON.stringify(newHistory));
      }
    } else {
      localStorage.setItem(
        config.historyStorageKey,
        JSON.stringify([convertToHistoryFromTableStyle(masterTableState)])
      );
    }
  }, [masterTableState]);

  return (
    <div className={tetrisArea.top}>
      <TetrisTable {...tetrisFieldProps} />
      <ControllerMemo {...minoCandidateProps} />
    </div>
  );
}

export type ControlMino = {
  blockKind: BlockKind;
  rotation: number;
};
