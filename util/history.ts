import { config } from "@/app/config/config";

export function initializeHistory() {
  const emptyHistoryTable = new Array(10);
  for (let i = 0; i < 10; i++) {
    emptyHistoryTable[i] = new Array(20).fill(config.historyChars.EMPTY);
  }

  localStorage.setItem(config.historyStorageKey, JSON.stringify([emptyHistoryTable]));
}

export function initializeUsedMinoHistory() {
  localStorage.setItem(config.usedMinoHistoryStorageKey, JSON.stringify([]));
}
