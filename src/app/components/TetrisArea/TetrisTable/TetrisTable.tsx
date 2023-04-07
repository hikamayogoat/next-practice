import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import tetrisTableStyle from "./tetrisTable.module.css";

import { BlockKind, constVars } from "../../../config/config";

import lodash, { clone } from "lodash";
import { convertNumberToMinoColorCode, getRelativeActivePosition } from "util/converter";
import { checkBlockConflict } from "util/checker";
import { ControlMino } from "../TetrisArea";

export type TetrisTableProps = {
  tableState: any[];
  setTableState: Dispatch<SetStateAction<any[]>>;
  currentMino: ControlMino;
  setCurrentMino: (newCurrentControlMino: ControlMino) => void;
};

export function TetrisTable(props: TetrisTableProps) {
  const rowCells = new Array<number>(10).fill(0);
  const columnCells = new Array<number>(20).fill(0);

  const [tmpTableStyle, setTmpTableStyle] = useState(lodash.cloneDeep(props.tableState));

  const initActivePosition: Array<number | undefined> = [undefined, undefined];
  const [activePositionState, setActivePositionState] = useState(initActivePosition);

  const onClickCell = (row: number, col: number) => () => {
    const relativePositions = getRelativeActivePosition(props.currentMino);
    if (checkBlockConflict(props.tableState, row, col, relativePositions)) {
      return;
    }
    const cloneTableState = props.tableState.slice();
    relativePositions.forEach((position) => {
      const targetX = position[0] + row;
      const targetY = position[1] + col;
      const newCellStyle = {
        backgroundColor: convertNumberToMinoColorCode(props.currentMino.blockKind),
        opacity: 1,
      };
      cloneTableState[targetX][targetY] = newCellStyle;
    });
    props.setTableState(lodash.cloneDeep(cloneTableState));
    setTmpTableStyle(lodash.cloneDeep(cloneTableState));
  };

  const onMouseEnter = (row: number, col: number) => () => {
    updateTmpTableStyle(
      row,
      col,
      props.currentMino,
      convertNumberToMinoColorCode(props.currentMino.blockKind),
      0.6
    );
    setActivePositionState([row, col]);
  };
  const onMouseLeave = (row: number, col: number) => () => {
    updateTmpTableStyle(row, col, props.currentMino, constVars.defaultBackgroundColor, 1);
    setActivePositionState(lodash.cloneDeep(initActivePosition));
  };
  const updateTmpTableStyle = (
    row: number,
    col: number,
    currentMino: ControlMino,
    color: string,
    opacity: number
  ) => {
    const cloneTmpTableStyle = tmpTableStyle.slice();
    const relativePositions = getRelativeActivePosition(currentMino);
    if (checkBlockConflict(props.tableState, row, col, relativePositions)) {
      return;
    }
    relativePositions.forEach((position) => {
      const targetX = position[0] + row;
      const targetY = position[1] + col;
      cloneTmpTableStyle[targetX][targetY] = {
        backgroundColor: color,
        opacity: opacity,
      };
    });
    setTmpTableStyle(cloneTmpTableStyle);
  };

  // キーが押された時のコールバック
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "z" || event.key === "x") {
        const [row, col] = [...activePositionState];
        // テーブルを掃除する
        if (row != undefined && col != undefined) {
          updateTmpTableStyle(row, col, props.currentMino, constVars.defaultBackgroundColor, 1);
        }
        // 操作中のミノについての state を書き換える
        const cloneControlMino = lodash.cloneDeep(props.currentMino);
        const direction = event.key === "z" ? -1 : 1;
        cloneControlMino.rotation = (cloneControlMino.rotation + direction + 4) % 4;
        props.setCurrentMino(cloneControlMino);
        // テーブルに追記する
        if (row != undefined && col != undefined) {
          updateTmpTableStyle(
            row,
            col,
            cloneControlMino,
            convertNumberToMinoColorCode(cloneControlMino.blockKind),
            0.6
          );
        }
      }
    },
    [props.currentMino, activePositionState]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown, false);
    return () => {
      document.removeEventListener("keydown", handleKeyDown, false);
    };
  }, [props.currentMino, handleKeyDown]);

  return (
    <div>
      <div className={tetrisTableStyle.table}>
        {rowCells.map((_, row) => (
          <div key={`${row}`}>
            {columnCells.map((_, col) => (
              <div
                key={`${col}-${row}`}
                className={tetrisTableStyle.cell}
                onMouseEnter={onMouseEnter(row, col)}
                onMouseLeave={onMouseLeave(row, col)}
                onClick={onClickCell(row, col)}
                style={tmpTableStyle[row][col]}
              ></div>
            ))}
          </div>
        ))}
      </div>
      <p>Z: 左回転, X: 右回転</p>
    </div>
  );
}

enum HoverActionType {
  Enter,
  Leave,
}
