import { BlockKind } from "@/app/config/config";
import { relative } from "path";

export function checkBlockConflict(
  table: any[],
  row: number,
  col: number,
  relativePositions: number[][]
) {
  let isConflict = false;
  // テーブルの外に座標が出ていたら描画できない
  relativePositions.forEach((relativePosition) => {
    const targetX = relativePosition[0] + row;
    const targetY = relativePosition[1] + col;
    if (targetX < 0 || targetX >= 10 || targetY < 0 || targetY >= 20) {
      isConflict = true;
    }
  });
  return isConflict;
}
