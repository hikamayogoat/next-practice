import headerStyle from "./header.module.css";
import { config } from "@/app/config/config";
import { deflateString } from "util/compress";

export function Header() {
  // 共有用のURLを生成する
  const generateShareURL = () => {
    const historyRaw = localStorage.getItem(config.historyStorageKey);
    const usedMinoHistoryRaw = localStorage.getItem(config.usedMinoHistoryStorageKey);
    if (historyRaw == null && usedMinoHistoryRaw == null) {
      alert("操作履歴がないため、URLを生成できません");
      return;
    } else if (historyRaw == null || usedMinoHistoryRaw == null) {
      alert("操作履歴に不整合があるため、URLを生成できません");
      return;
    } else {
      const history: string[][][] = JSON.parse(historyRaw);
      let historyQueryParam = "";
      for (let i = 0; i < history.length; i++) {
        if (i != 0) {
          historyQueryParam += "&";
        }
        historyQueryParam += `history=${deflateString(JSON.stringify(history[i]))}`;
      }

      const compressedUsedMinoHistory = deflateString(usedMinoHistoryRaw);
      const urlBase = window.location.origin;
      const url = `${urlBase}/?${historyQueryParam}&usedMinoHistory=${compressedUsedMinoHistory}`;
      window.prompt(
        "URLをコピーしてください。\n（この機能は試験的なものです。非常に長いURLが生成されます。）",
        url
      );
    }
  };

  return (
    <>
      <div className={headerStyle.right}>
        <button onClick={generateShareURL}>share</button>
      </div>
    </>
  );
}
