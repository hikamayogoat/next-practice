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
    // マスター情報と同じもので表示される盤面を更新する
    setTableStyle(lodash.cloneDeep(cloneTableState));
  };

  // マウスがセルの上に乗ったときの処理
  const onMouseEnter = (row: number, col: number) => () => {
    setEnterPositionState({
      row: row,
      col: col,
    });
  };
  useEffect(() => {
    if (enterPositionState.row != undefined && enterPositionState.col != undefined) {
      updateTableStyle(enterPositionState.row, enterPositionState.col, UpdateCellType.PUT);
    }
    return () => {
      // 次の描画を始める前に、前の描画で変更したセルのスタイルを元に戻す
      if (enterPositionState.row != undefined && enterPositionState.col != undefined) {
        updateTableStyle(enterPositionState.row, enterPositionState.col, UpdateCellType.REMOVE);
      }
    };
  }, [enterPositionState, props.currentMino]);

  // マウスがセルから離れたときの処理
  const onMouseLeave = (row: number, col: number) => () => {
    setLeavePositionState({
      row: row,
      col: col,
    });
  };
  useEffect(() => {
    if (
      leavePositionState.row != undefined &&
      leavePositionState.col != undefined &&
      // 基本的にはマウスが乗ったときのuseEffectのunmount時の処理で消えるので、
      // ここではマウスカーソルがテーブルの外に出たときのみ削除処理を行う
      (leavePositionState.row == 0 ||
        leavePositionState.col == 0 ||
        leavePositionState.row == rowCells.length - 1 ||
        leavePositionState.col == columnCells.length - 1)
    ) {
      updateTableStyle(leavePositionState.row, leavePositionState.col, UpdateCellType.REMOVE);
      // 戻しておかないと、次の回転処理のときに最後の座標に描画される
      setEnterPositionState({
        row: undefined,
        col: undefined,
      });
    }
  }, [leavePositionState]);

  // キーが押された時のコールバック
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "z" || event.key === "x") {
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
  function updateTableStyle(row: number, col: number, action: UpdateCellType) {
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
