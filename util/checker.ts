import { BlockKind, config } from "@/app/config/config";
import { convertToHistoryFromTableStyle } from "./converter";

export function checkBlockConflict(
  table: any[][], // 比較される方の盤面。つまり、masterTableStyle などが渡されることを想定している
  row: number,
  col: number,
  relativePositions: number[][]
) {
  let isConflict = false;
  relativePositions.forEach((relativePosition) => {
    const targetX = relativePosition[0] + row;
    const targetY = relativePosition[1] + col;
    if (
      targetX < 0 ||
      targetX >= config.tetrisTableWidth ||
      targetY < 0 ||
      targetY >= config.tetrisTableHeight
    ) {
      // テーブルの外に座標が出ていたら描画できない
      isConflict = true;
    } else if (table[targetX][targetY].backgroundColor != config.defaultBackgroundColor) {
      // 既になにかあったら描画できない
      isConflict = true;
    }
  });
  return isConflict;
}

export function isSameTable(history: any[][], tableStyle: any[][]) {
  const target = convertToHistoryFromTableStyle(tableStyle);
  for (let x = 0; x < history.length; x++) {
    for (let y = 0; y < history[0].length; y++) {
      if (history[x][y] != target[x][y]) {
        return false;
      }
    }
  }
  return true;
}
