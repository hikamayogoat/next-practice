"use client";

import { Inter } from "@next/font/google";
import { useCallback, useState } from "react";
import styles from "./page.module.css";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const rowCells = new Array<number>(10).fill(0);
  const columnCells = new Array<number>(10).fill(0);

  var initArray = new Array(10).fill(0);
  for (let i = 0; i < 10; i++) {
    initArray[i] = new Array(20).fill(0);
  }

  let [tableState, setTableState] = useState(initArray);

  const handleClickCell = (row: number, col: number) => {
    console.log(`${row}-${col}`);
    var cloneTableState = tableState.slice();
    cloneTableState[row][col] += 1;
    setTableState(cloneTableState);
  };

  return (
    <main className={styles.main}>
      <p> should shown a table below </p>
      <table border={1}>
        {columnCells.map((col, colIndex) => (
          <tr key={`${colIndex}`}>
            {rowCells.map((row, rowIndex) => (
              <td
                key={`${colIndex}-${rowIndex}`}
                onClick={() => handleClickCell(rowIndex, colIndex)}
              >
                {tableState[rowIndex][colIndex]}
              </td>
            ))}
          </tr>
        ))}
      </table>
    </main>
  );
}
