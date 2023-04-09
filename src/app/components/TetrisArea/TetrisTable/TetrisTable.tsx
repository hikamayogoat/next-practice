import { Dispatch, SetStateAction, useCallback, useEffect, useLayoutEffect, useState } from "react";
import tetrisTableStyle from "./tetrisTable.module.css";

import { BlockKind, constVars } from "../../../config/config";

import lodash, { clone, update } from "lodash";
import { convertNumberToMinoColorCode, getRelativeActivePosition } from "util/converter";
import { checkBlockConflict } from "util/checker";
import { ControlMino } from "../TetrisArea";

export type TetrisTableProps = {
  masterTableState: any[][];
  setMasterTableState: Dispatch<SetStateAction<any[]>>;
  currentMino: ControlMino;
  setCurrentMino: (newCurrentControlMino: ControlMino) => void;
};

enum UpdateCellType {
  PUT,
  REMOVE,
}

export function TetrisTable(props: TetrisTableProps) {
  console.log("TetrisTable loaded");
  const rowCells = new Array<number>(10).fill(0);
  const columnCells = new Array<number>(20).fill(0);

  const [tableStyle, setTableStyle] = useState(lodash.cloneDeep(props.masterTableState));

  type Position = {
    row: number | undefined;
    col: number | undefined;
  };
  const initPosition: Position = {
    row: undefined,
    col: undefined,
  };
  const [enterPositionState, setEnterPositionState] = useState(initPosition);
  const [leavePositionState, setLeavePositionState] = useState(initPosition);

  const onClickCell = (row: number, col: number) => () => {
    const relativePositions = getRelativeActivePosition(props.currentMino);
    if (checkBlockConflict(props.masterTableState, row, col, relativePositions)) {
      return;
    }
    const cloneTableState = props.masterTableState.slice();
    relativePositions.forEach((position) => {
      const targetX = position[0] + row;
      const targetY = position[1] + col;
      const newCellStyle = {
        backgroundColor: convertNumberToMinoColorCode(props.currentMino.blockKind),
        opacity: 1,
      };
      cloneTableState[targetX][targetY] = newCellStyle;
    });
    props.setMasterTableState(cloneTableState);
    setTableStyle(lodash.cloneDeep(cloneTableState));
  };

  // マウスホバーに関するハンドラ
  const onMouseEnter = (row: number, col: number) => () => {
    console.log("enter");
    // setLeaveState({
    //   row: row,
    //   col: col,
    //   actionType: ActionType.REMOVE,
    // });
    setEnterPositionState({
      row: row,
      col: col,
    });
  };
  const onMouseLeave = (row: number, col: number) => () => {
    console.log("leave");
    setLeavePositionState({
      row: row,
      col: col,
    });
  };

  // キーが押された時のコールバック
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "z" || event.key === "x") {
        // 操作中のミノについての state を書き換える
        const cloneControlMino = lodash.cloneDeep(props.currentMino);
        const direction = event.key === "z" ? -1 : 1;
        cloneControlMino.rotation = (cloneControlMino.rotation + direction + 4) % 4;
        props.setCurrentMino(cloneControlMino);
      }
    },
    [props.currentMino]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown, false);
    return () => {
      document.removeEventListener("keydown", handleKeyDown, false);
    };
  }, [props.currentMino, handleKeyDown]);

  // 再描画処理
  function updateTmpTable(row: number, col: number, action: UpdateCellType) {
    setTableStyle((prev) => {
      const relativePositions = getRelativeActivePosition(props.currentMino);
      const cloneTmpTableStyle = lodash.cloneDeep(prev);
      if (!checkBlockConflict(props.masterTableState, row, col, relativePositions)) {
        const opacity = action == UpdateCellType.PUT ? 0.5 : 1;
        const color =
          action == UpdateCellType.PUT
            ? convertNumberToMinoColorCode(props.currentMino.blockKind)
            : constVars.defaultBackgroundColor;
        relativePositions.forEach((position) => {
          const targetX = position[0] + row;
          const targetY = position[1] + col;
          cloneTmpTableStyle[targetX][targetY] = {
            backgroundColor: color,
            opacity: opacity,
          };
        });
      }
      return cloneTmpTableStyle;
    });
  }

  useEffect(() => {
    console.log(`enter useeffect: ${enterPositionState.row}, ${enterPositionState.col}`);
    if (enterPositionState.row != undefined && enterPositionState.col != undefined) {
      updateTmpTable(enterPositionState.row, enterPositionState.col, UpdateCellType.PUT);
    }
  }, [enterPositionState]);

  useEffect(() => {
    console.log(`leave useeffect: ${leavePositionState.row}, ${leavePositionState.col}`);
    if (leavePositionState.row != undefined && leavePositionState.col != undefined) {
      updateTmpTable(leavePositionState.row, leavePositionState.col, UpdateCellType.REMOVE);
    }
  }, [leavePositionState]);

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
                style={tableStyle[row][col]}
              ></div>
            ))}
          </div>
        ))}
      </div>
      <p>Z: 左回転, X: 右回転</p>
    </div>
  );
}
