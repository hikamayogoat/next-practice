import { Dispatch, SetStateAction, useState } from "react";
import tetrisTableStyle from "./tetrisTable.module.css";

import { constVars } from "../../../config/config";

import lodash from "lodash";

export type TetrisTableProps = {
  tableState: any[];
  setTableState: Dispatch<SetStateAction<any[]>>;
};

export function TetrisTable(props: TetrisTableProps) {
  const rowCells = new Array<number>(10).fill(0);
  const columnCells = new Array<number>(20).fill(0);

  const [tmpTableStyle, setTmpTableStyle] = useState(lodash.cloneDeep(props.tableState));

  const onClickCell = (row: number, col: number) => {
    let cloneTableState = props.tableState;
    cloneTableState[row][col] = {
      backgroundColor: `${constVars.minoColorCodes.S}`,
    };
    props.setTableState(cloneTableState);
  };

  const onMouseHover = (row: number, col: number) => {
    let cloneTableStyle = tmpTableStyle.slice();
    cloneTableStyle[row][col] = {
      backgroundColor: `${constVars.minoColorCodes.I}`,
    };
    setTmpTableStyle(cloneTableStyle);
  };

  const onMouseLeave = (row: number, col: number) => {
    let cloneTableStyle = tmpTableStyle.slice();
    cloneTableStyle[row][col] = props.tableState[row][col];
    setTmpTableStyle(cloneTableStyle);
  };

  return (
    <div className={tetrisTableStyle.table}>
      {columnCells.map((_, col) => (
        <div key={`${col}`}>
          {rowCells.map((_, row) => (
            <div
              key={`${col}-${row}`}
              className={tetrisTableStyle.cell}
              onMouseEnter={() => onMouseHover(row, col)}
              onMouseLeave={() => onMouseLeave(row, col)}
              onClick={() => onClickCell(row, col)}
              style={tmpTableStyle[row][col]}
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
}
