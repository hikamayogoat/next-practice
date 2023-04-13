import tetrisArea from "./tetrisArea.module.css";
import { useEffect, useState } from "react";
import { ControllerMemo, Controller } from "./Controller/Controller";
import { TetrisTable as TetrisTable } from "./TetrisTable/TetrisTable";
import { BlockKind, config } from "../../config/config";
import { convertToHistoryFromTableStyle, convertToTableStyleFromHistory } from "util/converter";
import { isSameTable as isSameTable } from "util/checker";
import { initializeHistory } from "util/history";
import { generateEmptyTableStyleArray } from "util/generater";

export default function Top() {
  const [masterTableState, setMasterTableState] = useState<any[][]>(generateEmptyTableStyleArray());
  const [historyIndexState, setHistoryIndexState] = useState(0);
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
    historyIndexState: historyIndexState,
    setHistoryIndexState: setHistoryIndexState,
  };

  useEffect(() => {
    const history = localStorage.getItem(config.historyStorageKey);
    if (history != null) {
      return;
    } else {
      // 無限ループ回避用フラグ
      localStorage.setItem(config.recoveryFlagStorageKey, "false");
      initializeHistory();
    }
  }, []);

  // 盤面が変わったとき、ローカルストレージにその盤面を追加して、今履歴のどこにいるかを更新する
  // また、ページが開かれたときに履歴が残っていれば復元するかを確認する
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
          setHistoryIndexState(prevHistory.length - 1);
          localStorage.setItem(config.recoveryFlagStorageKey, "true");
        } else {
          localStorage.removeItem(config.historyStorageKey);
          initializeHistory();
        }
      } else if (!isSameTable(prevHistory[historyIndexState], masterTableState)) {
        localStorage.setItem(config.recoveryFlagStorageKey, "false");
        const newHistory = [
          ...prevHistory.slice(0, historyIndexState + 1),
          convertToHistoryFromTableStyle(masterTableState),
        ];
        localStorage.setItem(config.historyStorageKey, JSON.stringify(newHistory));
        setHistoryIndexState(historyIndexState + 1);
        console.log(`historyIndex updating: ${historyIndexState + 1}`);
      }
    } else {
      // ここに到達することはないと思うが、念の為初期化処理を入れておく
      localStorage.setItem(config.recoveryFlagStorageKey, "false");
      localStorage.setItem(
        config.historyStorageKey,
        JSON.stringify([convertToHistoryFromTableStyle(masterTableState)])
      );
    }
  }, [masterTableState]);

  // historyIndexState が変化したとき、盤面を更新する
  useEffect(() => {
    console.log(`historyIndex update: ${historyIndexState}`);
    const historyRaw = localStorage.getItem(config.historyStorageKey);
    if (historyRaw != null) {
      const history: string[][][] = JSON.parse(historyRaw);
      if (historyIndexState < 0) {
        setHistoryIndexState(0);
        return;
      } else if (historyIndexState > history.length - 1) {
        setHistoryIndexState(history.length - 1);
        return;
      } else {
        setMasterTableState(convertToTableStyleFromHistory(history[historyIndexState]));
      }
    }
  }, [historyIndexState]);

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
