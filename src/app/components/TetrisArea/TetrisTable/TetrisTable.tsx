import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import tetrisTableStyle from "./tetrisTable.module.css";

import { BlockKind, config } from "../../../config/config";

import { convertBlockKindToColorCode, getRelativeActivePosition } from "util/converter";
import { checkBlockConflict } from "util/checker";
import { ControlMino } from "../TetrisArea";

export type TetrisTableProps = {
  masterTableState: any[][];
  setMasterTableState: Dispatch<SetStateAction<any[][]>>;
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

  const [tableStyle, setTableStyle] = useState(structuredClone(props.masterTableState));

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

  useEffect(() => {
    setTableStyle(structuredClone(props.masterTableState));
  }, [props.masterTableState]);

  const onClickCell = (row: number, col: number) => () => {
    // memo: 半透明になってるところを1にしたやつ、で定義してもいいかも？
    if (props.currentMino.blockKind == BlockKind.NONE) {
      return;
    }
    const relativePositions = getRelativeActivePosition(props.currentMino);
    if (
      props.currentMino.blockKind != BlockKind.ERASER &&
      checkBlockConflict(props.masterTableState, row, col, relativePositions)
    ) {
      return;
    }
    const cloneTableStyle = props.masterTableState.slice();
    relativePositions.forEach((position) => {
      const targetX = position[0] + row;
      const targetY = position[1] + col;
      const newCellStyle = {
        backgroundColor: convertBlockKindToColorCode(props.currentMino.blockKind),
        opacity: 1,
      };
      cloneTableStyle[targetX][targetY] = newCellStyle;
    });
    props.setMasterTableState(cloneTableStyle);
  };

  // マウスがセルの上に乗ったときの処理
  const onMouseEnter = (row: number, col: number) => () => {
    if (props.currentMino.blockKind == BlockKind.NONE) {
      return;
    }
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
    if (props.currentMino.blockKind == BlockKind.NONE) {
      return;
    }
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
        const cloneControlMino = structuredClone(props.currentMino);
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
      const cloneTableStyle = structuredClone(prev);
      if (
        props.currentMino.blockKind != BlockKind.ERASER &&
        checkBlockConflict(props.masterTableState, row, col, relativePositions)
      ) {
        return prev;
      } else {
        const opacity = action == UpdateCellType.PUT ? 0.6 : 1;

        relativePositions.forEach((position) => {
          const targetX = position[0] + row;
          const targetY = position[1] + col;
          const color =
            action == UpdateCellType.PUT
              ? convertBlockKindToColorCode(props.currentMino.blockKind)
              : props.masterTableState[targetX][targetY].backgroundColor;
          cloneTableStyle[targetX][targetY] = {
            backgroundColor: color,
            opacity: opacity,
          };
        });
        return cloneTableStyle;
      }
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
