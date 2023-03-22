import { Dispatch, SetStateAction, useState } from "react";
import tetrisTableStyle from "./tetrisTable.module.css";

import { BlockKind } from "../../../config/config";

import lodash from "lodash";
import { convertNumberToMinoColorCode, getRelativeActivePosition } from "util/converter";
import { checkBlockConflict } from "util/checker";

export type TetrisTableProps = {
  tableState: any[];
  setTableState: Dispatch<SetStateAction<any[]>>;
  currentBlock: BlockKind;
};

export function TetrisTable(props: TetrisTableProps) {
  const rowCells = new Array<number>(10).fill(0);
  const columnCells = new Array<number>(20).fill(0);

  const [tmpTableStyle, setTmpTableStyle] = useState(lodash.cloneDeep(props.tableState));

  const onClickCell = (row: number, col: number) => () => {
    let cloneTableState = props.tableState;
    const relativePositions = getRelativeActivePosition(props.currentBlock);
    relativePositions.forEach((position) => {
      const targetX = position[0] + row;
      const targetY = position[1] + col;
      cloneTableState[targetX][targetY] = {
        backgroundColor: `${convertNumberToMinoColorCode(props.currentBlock)}`,
      };
    });
    props.setTableState(cloneTableState);
  };

  const onMouseHover = (row: number, col: number) => () => {
    let cloneTableStyle = tmpTableStyle.slice();
    const relativePositions = getRelativeActivePosition(props.currentBlock);
    if (checkBlockConflict(props.tableState, row, col, relativePositions)) {
      return;
    }
    relativePositions.forEach((position) => {
      const targetX = position[0] + row;
      const targetY = position[1] + col;
      cloneTableStyle[targetX][targetY] = {
        backgroundColor: `${convertNumberToMinoColorCode(props.currentBlock)}`,
        opacity: 0.5,
      };
    });
    setTmpTableStyle(cloneTableStyle);
  };

  const onMouseLeave = (row: number, col: number) => () => {
    let cloneTableStyle = tmpTableStyle.slice();
    const relativePositions = getRelativeActivePosition(props.currentBlock);
    if (checkBlockConflict(props.tableState, row, col, relativePositions)) {
      return;
    }
    relativePositions.forEach((position) => {
      const targetX = position[0] + row;
      const targetY = position[1] + col;
      cloneTableStyle[targetX][targetY] = props.tableState[targetX][targetY];
    });
    setTmpTableStyle(cloneTableStyle);
  };

  return (
    <div className={tetrisTableStyle.table}>
      {rowCells.map((_, row) => (
        <div key={`${row}`}>
          {columnCells.map((_, col) => (
            <div
              key={`${col}-${row}`}
              className={tetrisTableStyle.cell}
              onMouseEnter={onMouseHover(row, col)}
              onMouseLeave={onMouseLeave(row, col)}
              onClick={onClickCell(row, col)}
              style={tmpTableStyle[row][col]}
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
}
