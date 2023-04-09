import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import tetrisTableStyle from "./tetrisTable.module.css";

import { BlockKind, constVars } from "../../../config/config";

import lodash, { clone, update } from "lodash";
import { convertNumberToMinoColorCode, getRelativeActivePosition } from "util/converter";
import { checkBlockConflict } from "util/checker";
import { ControlMino } from "../TetrisArea";

export type TetrisTableProps = {
  tableState: any[][];
  setTableState: Dispatch<SetStateAction<any[]>>;
  currentMino: ControlMino;
  setCurrentMino: (newCurrentControlMino: ControlMino) => void;
};

export function TetrisTable(props: TetrisTableProps) {
  const rowCells = new Array<number>(10).fill(0);
  const columnCells = new Array<number>(20).fill(0);

  const [tmpTableStyle, setTmpTableStyle] = useState(lodash.cloneDeep(props.tableState));

  type Activity = {
    row: number | undefined;
    col: number | undefined;
    actionType: ActionType;
  };
  enum ActionType {
    PUT,
    REMOVE,
  }
  const initActivity: Activity = {
    row: undefined,
    col: undefined,
    actionType: ActionType.REMOVE,
  };
  const [activityState, setActivityState] = useState(initActivity);

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
    props.setTableState(cloneTableState);
    setTmpTableStyle(lodash.cloneDeep(cloneTableState));
  };

  // マウスホバーに関するハンドラ
  const onMouseEnter = (row: number, col: number) => () => {
    setActivityState({
      row: row,
      col: col,
      actionType: ActionType.PUT,
    });
  };
  const onMouseLeave = (row: number, col: number) => () => {
    setActivityState({
      row: row,
      col: col,
      actionType: ActionType.REMOVE,
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
    [props.currentMino, activityState]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown, false);
    return () => {
      document.removeEventListener("keydown", handleKeyDown, false);
    };
  }, [props.currentMino, handleKeyDown]);

  // 再描画処理
  function updateTmpTableStyle({ row, col, actionType }: Activity) {
    const cloneTmpTableStyle = lodash.cloneDeep(tmpTableStyle);
    const relativePositions = getRelativeActivePosition(props.currentMino);
    if (
      row == undefined ||
      col == undefined ||
      checkBlockConflict(props.tableState, row, col, relativePositions)
    ) {
      return;
    }
    const opacity = actionType == ActionType.PUT ? 0.5 : 1;
    const color =
      actionType == ActionType.PUT
        ? convertNumberToMinoColorCode(props.currentMino.blockKind)
        : constVars.defaultBackgroundColor;
    relativePositions.forEach((position) => {
      const targetX = position[0] + row;
      const targetY = position[1] + col;
      cloneTmpTableStyle[targetX][targetY] = {
        backgroundColor: color,
        opacity: opacity,
      };
    }),
      setTmpTableStyle(cloneTmpTableStyle);
  }

  useEffect(() => {
    updateTmpTableStyle(activityState);
  }, [activityState, props.currentMino]);

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
