import tetrisArea from "./tetrisArea.module.css";
import { useEffect, useRef, useState } from "react";
import { ControllerMemo, Controller } from "./Controller/Controller";
import { TetrisTable as TetrisTable } from "./TetrisTable/TetrisTable";
import { BlockKind, config } from "../../config/config";
import { convertToHistoryFromTableStyle, convertToTableStyleFromHistory } from "util/converter";
import { isSameTable as isSameTable } from "util/checker";
import { initializeHistory, initializeUsedMinoHistory } from "util/history";
import { generateEmptyTableStyleArray } from "util/generater";
import { HistoryList } from "./Histories/HistoryList";

export default function Top() {
  const [masterTableState, setMasterTableState] = useState<any[][]>(generateEmptyTableStyleArray());
  const [historyIndexState, setHistoryIndexState] = useState<number | undefined>(undefined);
  const [currentMino, setCurrentMino] = useState({
    blockKind: BlockKind.NONE,
    rotation: 0,
  });

  // 現在最新の盤面が表示されているかどうかを保持しておく
  const isLatestTable = useRef(false);

  // 今表示されている盤面までに使ったミノを保持しておく
  const usedMinoList = useRef<BlockKind[]>([]);

  // どのタイミングでライン消去したのかの判定用（usedMinoListの整合性のため）
  const willLineClear = useRef(false);

  useEffect(() => {
    const historyRaw = localStorage.getItem(config.historyStorageKey);
    const usedMinoHistoryRaw = localStorage.getItem(config.usedMinoHistoryStorageKey);
    if (historyRaw != null && usedMinoHistoryRaw != null) {
      const history = JSON.parse(historyRaw);
      if (history.length - 1 == historyIndexState) {
        isLatestTable.current = true;
      } else {
        isLatestTable.current = false;
      }

      const usedMinoHistory = JSON.parse(usedMinoHistoryRaw);
      if (historyIndexState == 0) {
        usedMinoList.current = [];
      } else {
        usedMinoList.current = usedMinoHistory.slice(0, historyIndexState);
      }
    } else if (
      (historyRaw != null && usedMinoHistoryRaw == null) ||
      (historyRaw == null && usedMinoHistoryRaw != null)
    ) {
      alert("ブラウザに保存している履歴データが壊れているため、リセットします");
      initializeHistory();
      initializeUsedMinoHistory();
    }
  }, [historyIndexState]);

  const tetrisFieldProps = {
    masterTableState: masterTableState,
    setMasterTableState: setMasterTableState,
    currentMino: currentMino,
    setCurrentMino: setCurrentMino,
    isLatestTable: isLatestTable.current,
    willLineClear: willLineClear,
  };

  const controllerProps = {
    setMasterTableState: setMasterTableState,
    currentMino: currentMino,
    setCurrentMino: setCurrentMino,
    historyIndexState: historyIndexState,
    setHistoryIndexState: setHistoryIndexState,
    unavailableMinoList: generateFixedUsedMinoList(usedMinoList.current),
  };

  const historiesProps = {
    historyIndexState: historyIndexState,
    setHistoryIndexState: setHistoryIndexState,
  };

  // localStorage の初期化処理
  useEffect(() => {
    const history = localStorage.getItem(config.historyStorageKey);
    if (history != null) {
      return;
    } else {
      initializeHistory();
    }

    const usedMinoHistory = localStorage.getItem(config.usedMinoHistoryStorageKey);
    if (usedMinoHistory != null) {
      return;
    } else {
      initializeUsedMinoHistory();
    }
  }, []);

  // 盤面が変わったとき、ローカルストレージにその盤面を追加して、今履歴のどこにいるかを更新する
  // また、ページが開かれたときに履歴が残っていれば復元するかを確認する
  useEffect(() => {
    const historyRaw = localStorage.getItem(config.historyStorageKey);
    const usedMinoHistoryRaw = localStorage.getItem(config.usedMinoHistoryStorageKey);

    if (historyRaw != null && usedMinoHistoryRaw != null) {
      const history: string[][][] = JSON.parse(historyRaw);
      const usedMinoHistory: BlockKind[] = JSON.parse(usedMinoHistoryRaw);

      if (history.length > 1 && historyIndexState == undefined) {
        // 履歴がローカルストレージに残っていて、初回のレンダリングのとき
        if (confirm("過去のデータがあります。復元しますか？")) {
          setHistoryIndexState(history.length - 1);
        } else {
          initializeHistory();
          initializeUsedMinoHistory();
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
        const newUsedMinoHistory = [...usedMinoHistory, currentMino.blockKind];
        localStorage.setItem(config.historyStorageKey, JSON.stringify(newHistory));
        if (willLineClear.current) {
          willLineClear.current = false;
        } else {
          localStorage.setItem(
            config.usedMinoHistoryStorageKey,
            JSON.stringify(newUsedMinoHistory)
          );
        }
        setHistoryIndexState(historyIndexState + 1);
        setCurrentMino({
          blockKind: BlockKind.NONE,
          rotation: 0,
        });
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
      <HistoryList {...historiesProps} />
      <TetrisTable {...tetrisFieldProps} />
      <Controller {...controllerProps} />
    </div>
  );
}

export type ControlMino = {
  blockKind: BlockKind;
  rotation: number;
};

function generateFixedUsedMinoList(usedMinoList: BlockKind[]): BlockKind[] {
  const startIdx = ~~(usedMinoList.length / 7);
  return usedMinoList.slice(startIdx * 7, startIdx * 7 + 7);
}
