import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import tetrisTableStyle from "./tetrisTable.module.css";

import { BlockKind, constVars } from "../../../config/config";

import lodash from "lodash";
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

  const onClickCell = (row: number, col: number) => () => {
    const relativePositions = getRelativeActivePosition(props.currentMino);
    if (checkBlockConflict(props.tableState, row, col, relativePositions)) {
      return;
    }
    // memo: cloneする元が同じだと何故か slice() としても参照が同じになってしまう
    const cloneTableState = props.tableState.slice();
    const cloneTmpTableStyle = tmpTableStyle.slice();
    relativePositions.forEach((position) => {
      const targetX = position[0] + row;
      const targetY = position[1] + col;
      const newCellStyle = {
        backgroundColor: convertNumberToMinoColorCode(props.currentMino.blockKind),
        opacity: 1,
      };
      cloneTableState[targetX][targetY] = newCellStyle;
      cloneTmpTableStyle[targetX][targetY] = newCellStyle;
    });
    setTmpTableStyle(cloneTmpTableStyle);
    props.setTableState(cloneTableState);
  };

  const onMouseMove = (row: number, col: number, action: HoverActionType) => () => {
    const relativePositions = getRelativeActivePosition(props.currentMino);
    if (checkBlockConflict(props.tableState, row, col, relativePositions)) {
      return;
    }
    const cloneTableStyle = tmpTableStyle.slice();
    relativePositions.forEach((position) => {
      const targetX = position[0] + row;
      const targetY = position[1] + col;
      if (action == HoverActionType.Enter) {
        cloneTableStyle[targetX][targetY] = {
          backgroundColor: convertNumberToMinoColorCode(props.currentMino.blockKind),
          opacity: 0.5,
        };
      } else if (action == HoverActionType.Leave) {
        cloneTableStyle[targetX][targetY] = {
          backgroundColor: constVars.defaultBackgroundColor,
          opacity: 1,
        };
      }
    });
    setTmpTableStyle(cloneTableStyle);
  };

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const cloneControlMino = lodash.cloneDeep(props.currentMino);
      if (event.key === "z" || event.key === "x") {
        // 操作中のミノについての state を書き換える
        const direction = event.key === "z" ? -1 : 1;
        cloneControlMino.rotation = (cloneControlMino.rotation + direction + 4) % 4;
        props.setCurrentMino(cloneControlMino);
        // テーブルを再描画するために state を読み込み直す
        setTmpTableStyle(lodash.cloneDeep(props.tableState));
      }
    },
    [props.currentMino]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown, false);
  }, [props.currentMino, handleKeyDown]);

  return (
    <div className={tetrisTableStyle.table}>
      {rowCells.map((_, row) => (
        <div key={`${row}`}>
          {columnCells.map((_, col) => (
            <div
              key={`${col}-${row}`}
              className={tetrisTableStyle.cell}
              onMouseEnter={onMouseMove(row, col, HoverActionType.Enter)}
              onMouseLeave={onMouseMove(row, col, HoverActionType.Leave)}
              onClick={onClickCell(row, col)}
              style={tmpTableStyle[row][col]}
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
}

enum HoverActionType {
  Enter,
  Leave,
}
