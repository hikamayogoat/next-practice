import { useState } from "react";
import tetrisTableStyle from "./tetrisTable.module.css";

import { constVars } from "../../../config/config";

// TetrisFieldコンポーネントについて要約
// 1. 10x20のテトリスフィールドを作成
// 2. テトリスフィールドのセルをクリックすると、そのセルの色が変わる
// 3. テトリスフィールドのセルにマウスカーソルを乗せると、そのセルの色が変わる
// 4. テトリスフィールドのセルからマウスカーソルを外すと、そのセルの色が変わる

export default function TetrisField() {
  const rowCells = new Array<number>(10).fill(0);
  const columnCells = new Array<number>(20).fill(0);

  const initStyle = {
    backgroundColor: "white",
  };

  var initArray = new Array(10).fill(initStyle);
  for (let i = 0; i < 10; i++) {
    initArray[i] = new Array(20).fill(initStyle);
  }

  const [tableState, setTableState] = useState(initArray);

  const handleClickCell = (row: number, col: number) => {
    let cloneTableState = tableState.slice();
    cloneTableState[row][col] = {
      backgroundColor: `${constVars.minoColorCodes.I}`,
    };
    setTableState(cloneTableState);
  };

  const handleMouseHover = (row: number, col: number) => {
    let cloneTableState = tableState.slice();
    cloneTableState[row][col] = {
      backgroundColor: `${constVars.minoCandidateColorCodes.I}`,
    };
    setTableState(cloneTableState);
  };

  const handleMouseLeave = (row: number, col: number) => {
    let cloneTableState = tableState.slice();
    cloneTableState[row][col] = {
      backgroundColor: constVars.minoColorCodes.WHITE,
    };
    setTableState(cloneTableState);
  };

  return (
    <div className={tetrisTableStyle.table}>
      {columnCells.map((_, col) => (
        <div key={`${col}`}>
          {rowCells.map((_, row) => (
            <div
              key={`${col}-${row}`}
              className={tetrisTableStyle.cell}
              onMouseEnter={() => handleMouseHover(row, col)}
              onMouseLeave={() => handleMouseLeave(row, col)}
              onClick={() => handleClickCell(row, col)}
              style={tableState[row][col]}
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
}
