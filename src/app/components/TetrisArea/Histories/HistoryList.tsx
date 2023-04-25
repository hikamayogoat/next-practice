import { config } from "@/app/config/config";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { convertToTableStyleFromHistory } from "util/converter";
import { generateEmptyTableStyleArray } from "util/generater";
import historyListStyle from "./historyList.module.css";
import { VscChevronLeft, VscChevronRight } from "react-icons/vsc";

export type HistoriesProps = {
  historyIndexState: number | undefined;
  setHistoryIndexState: Dispatch<SetStateAction<number | undefined>>;
};

export function HistoryList(props: HistoriesProps) {
  const emptyStyle = generateEmptyTableStyleArray();
  const [historyListState, setHistoryListState] = useState<any[][][]>([emptyStyle]);
  const focusedHistoryStyle = {
    border: "solid 3px",
    borderColor: "red",
  };

  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const historyRaw = localStorage.getItem(config.historyStorageKey);
    if (historyRaw == null) {
      // TODO: 多分到達することはないが、何らかのエラー処理
      console.log("history is null");
    } else {
      const history: string[][][] = JSON.parse(historyRaw);
      const newHistoryList = new Array<any[][]>(history.length);
      for (let i = 0; i < history.length; i++) {
        // 最新を上に持ってきたいので逆順にする
        newHistoryList[history.length - 1 - i] = convertToTableStyleFromHistory(history[i]);
      }
      setHistoryListState(newHistoryList);
    }
  }, [props.historyIndexState]);

  const onClickHistory = (nextIdx: number) => () => {
    props.setHistoryIndexState(nextIdx);
  };

  const toggleHistory = () => {
    setIsOpen(!isOpen);
  };

  if (isOpen) {
    return (
      <div className={historyListStyle.sidebar}>
        <div className={historyListStyle.header}>
          <div className={historyListStyle.header_left}>盤面履歴</div>
          {isOpen ? (
            <VscChevronLeft
              className={historyListStyle.header_right}
              onClick={toggleHistory}
            ></VscChevronLeft>
          ) : (
            <VscChevronRight
              className={historyListStyle.header_right}
              onClick={toggleHistory}
            ></VscChevronRight>
          )}
        </div>
        <ul>
          {historyListState.map((history, idx) =>
            props.historyIndexState != undefined &&
            props.historyIndexState === historyListState.length - idx - 1 ? ( // 逆順にしているため
              <div key={idx} className={historyListStyle.table} style={focusedHistoryStyle}>
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
            ) : (
              <div key={idx} className={historyListStyle.table}>
                {history.map((row, rowIdx) => (
                  <div
                    key={`${idx}-${rowIdx}`}
                    onClick={onClickHistory(historyListState.length - idx - 1)} // 逆順にしているため
                  >
                    {" "}
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
            )
          )}
        </ul>
      </div>
    );
  } else {
    return (
      <div className={historyListStyle.sidebar_open_button}>
        <VscChevronRight onClick={toggleHistory}></VscChevronRight>
      </div>
    );
  }
}
