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
  const [historyIndexState, setHistoryIndexState] = useState<number | undefined>(undefined);
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
      initializeHistory();
    }
  }, []);

  // 盤面が変わったとき、ローカルストレージにその盤面を追加して、今履歴のどこにいるかを更新する
  // また、ページが開かれたときに履歴が残っていれば復元するかを確認する
  useEffect(() => {
    const historyRaw = localStorage.getItem(config.historyStorageKey);

    if (historyRaw != null) {
      const history: string[][][] = JSON.parse(historyRaw);
      const emptyTable: string[][] = generateEmptyTableStyleArray();

      if (history.length > 1 && historyIndexState == undefined) {
        // 履歴がローカルストレージに残っていて、初回のレンダリングのとき
        if (confirm("過去のデータがあります。復元しますか？")) {
          setHistoryIndexState(history.length - 1);
        } else {
          initializeHistory();
          setHistoryIndexState(0);
        }
      } else if (
        historyIndexState != undefined &&
        !isSameTable(history[historyIndexState], masterTableState)
      ) {
        // 初回レンダリングでなく盤面に変更があったとき、履歴に新しい盤面を追加する
        const newHistory = [
          ...history.slice(0, historyIndexState + 1),
          convertToHistoryFromTableStyle(masterTableState),
        ];
        localStorage.setItem(config.historyStorageKey, JSON.stringify(newHistory));
        setHistoryIndexState(historyIndexState + 1);
      } else if (historyIndexState == undefined) {
        // 履歴がない状態での初回レンダリング時は、インデックスを初期化する
        setHistoryIndexState(0);
      }
    }
  }, [masterTableState]);

  // historyIndexState が変化したとき、盤面を更新する
  useEffect(() => {
    // 初回起動時は何もしない
    if (historyIndexState == undefined) {
      return;
    }

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
