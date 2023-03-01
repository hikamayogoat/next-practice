import { useState } from "react";
import tetrisTableStyle from "./tetrisTable.module.css";

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

  let [tableState, setTableState] = useState(initArray);

  const handleClickCell = (row: number, col: number) => {
    var cloneTableState = tableState.slice();
    // 動作確認のためランダムにしているだけ
    cloneTableState[row][col] = {
      backgroundColor: minoColorList[Math.floor(Math.random() * minoColorList.length)],
    };
    setTableState(cloneTableState);
  };

  const minoColorList = [
    "white", // 初期状態
    "#87ceeb", // Iミノ
    "#ffa500", // Lミノ
    "#0000cd", // Jミノ
    "#ffff00", // Oミノ
    "#7cfc00", // Sミノ
    "#ff4500", // Zミノ
    // Tミノ
  ];

  return (
    <div className={tetrisTableStyle.table}>
      {columnCells.map((col, colIndex) => (
        <div key={`${colIndex}`}>
          {rowCells.map((row, rowIndex) => (
            <div
              key={`${colIndex}-${rowIndex}`}
              className={tetrisTableStyle.cell}
              onClick={() => handleClickCell(rowIndex, colIndex)}
              style={tableState[rowIndex][colIndex]}
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
}
