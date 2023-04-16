import { config } from "@/app/config/config";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { convertToTableStyleFromHistory } from "util/converter";
import { generateEmptyTableStyleArray } from "util/generater";
import historyListStyle from "./historyList.module.css";

export type HistoriesProps = {
  historyIndexState: number | undefined;
  setHistoryIndexState: Dispatch<SetStateAction<number | undefined>>;
};

export function HistoryList(props: HistoriesProps) {
  const emptyStyle = generateEmptyTableStyleArray();
  const [historyListState, setHistoryListState] = useState<any[][][]>([emptyStyle]);

  useEffect(() => {
    const historyRaw = localStorage.getItem(config.historyStorageKey);
    if (historyRaw == null) {
      // TODO: 多分到達することはないが、何らかのエラー処理
      console.log("history is null");
    } else {
      const history: string[][][] = JSON.parse(historyRaw);
      const newHistoryList = new Array<any[][]>(history.length);
      // forEach か map で書いてもいいか
      for (let i = 0; i < history.length; i++) {
        // 最新を上に持ってきたいので逆順にする
        newHistoryList[history.length - 1 - i] = convertToTableStyleFromHistory(history[i]);
      }
      setHistoryListState(newHistoryList);
    }
  }, [props.historyIndexState]);

  return (
    <div className={historyListStyle.histories}>
      盤面履歴
      <ul>
        {historyListState.map((history, idx) => (
          <div key={idx} className={historyListStyle.table}>
            {history.map((row, rowIdx) => (
              <div key={`${idx}-${rowIdx}`}>
                {row.map((cell, cellIdx) => (
                  <div
                    key={`${idx}-${rowIdx}-${cellIdx}`}
                    className={historyListStyle.cell}
                    style={cell}
                  ></div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </ul>
    </div>
  );
}
