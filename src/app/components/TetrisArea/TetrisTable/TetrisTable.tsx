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
type Position = {
  row: number | undefined;
  col: number | undefined;
};
const initPosition: Position = {
  row: undefined,
  col: undefined,
};

export function TetrisTable(props: TetrisTableProps) {
  // マウスカーソルがテーブル外に出たことを検出する必要があるため、パディングする
  const expandedTableStyle = tableStylePaddingClone(props.masterTableState);
  const [tableStyle, setTableStyle] = useState(expandedTableStyle);
  // イテレーション用
  const rowCells = new Array(tableStyle.length).fill(0);
  const columnCells = new Array(tableStyle[0].length).fill(0);

  const [enterPositionState, setEnterPositionState] = useState(initPosition);
  const [erasableRowsState, setErasableRowsState] = useState(new Array<number>(0));

  // マスターテーブルの状態が変わったら、テーブルのスタイルを更新する
  useEffect(() => {
    const expandedTableStyle = tableStylePaddingClone(props.masterTableState);
    setTableStyle(expandedTableStyle);
  }, [props.masterTableState]);

  // マスターテーブルの状態が変わったら、消去できるラインがあるかを判定する
  useEffect(() => {
    const erasableRows = new Array<number>(0);
    for (let y = 0; y < config.tetrisTableHeight; y++) {
      let isLineFull = true;
      for (let x = 0; x < config.tetrisTableWidth; x++) {
        if (props.masterTableState[x][y].backgroundColor == config.defaultBackgroundColor) {
          isLineFull = false;
        }
      }
      if (isLineFull) {
        erasableRows.push(y);
      }
    }
    if (erasableRows.length != 0) {
      setErasableRowsState(erasableRows);
    } else {
      setErasableRowsState([]);
    }
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
    const fixedTableStyle = tableStyleRemovePaddingClone(tableStyle);
    const cloneTableStyle = fixedTableStyle;
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
    if (row == 0 || col == 0 || row == rowCells.length - 1 || col == columnCells.length - 1) {
      setEnterPositionState({
        row: undefined,
        col: undefined,
      });
    } else {
      setEnterPositionState({
        row: row,
        col: col,
      });
    }
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
  }, [enterPositionState, props.currentMino, props.masterTableState]);

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
        // masterTableStyle と tableStyle を比較するために、座標を調整する
        checkBlockConflict(props.masterTableState, row - 1, col - 1, relativePositions)
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
              : // masterTableStyle と tableStyle を比較するために、座標を調整する
                props.masterTableState[targetX - 1][targetY - 1].backgroundColor;
          cloneTableStyle[targetX][targetY] = {
            backgroundColor: color,
            opacity: opacity,
          };
        });
        return cloneTableStyle;
      }
    });
  }

  // ライン消去してその分詰める
  const onClickEraseLine = () => {
    const cloneMasterTableStyle = structuredClone(props.masterTableState);
    erasableRowsState.forEach((rowIdx) => {
      for (let colIdx = 0; colIdx < cloneMasterTableStyle.length; colIdx++) {
        for (let i = rowIdx; i > 0; i--) {
          cloneMasterTableStyle[colIdx][i] = cloneMasterTableStyle[colIdx][i - 1];
        }
        cloneMasterTableStyle[colIdx][0] = {
          backgroundColor: config.defaultBackgroundColor,
        };
      }
    });
    setErasableRowsState([]);
    props.setMasterTableState(cloneMasterTableStyle);
  };

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
                onClick={onClickCell(row - 1, col - 1)}
                style={tableStyle[row][col]}
              ></div>
            ))}
          </div>
        ))}
      </div>
      <p>Z: 左回転, X: 右回転</p>
      {erasableRowsState.length > 0 ? (
        <button onClick={onClickEraseLine}>ライン消去</button> // TODO: 揃った瞬間に消えたほうがいいか、もしくは履歴を見ているときは操作不能にするなどの工夫が必要
      ) : (
        <></>
      )}
    </div>
  );
}

function tableStylePaddingClone(array: any[][]): any[][] {
  const hiddenStyle = {
    display: "hidden",
    border: "none",
  };
  const clone = array.slice();
  const newTable = new Array(clone.length + 2);
  const newTableWidth = clone.length + 2;
  const newTableHeight = clone[0].length + 2;
  for (let x = 0; x < newTableWidth; x++) {
    if (x == 0 || x == newTableWidth - 1) {
      newTable[x] = new Array(newTableHeight).fill(hiddenStyle);
    } else {
      newTable[x] = new Array(newTableHeight);
      for (let y = 0; y < newTableHeight; y++) {
        if (y == 0 || y == newTableHeight - 1) {
          newTable[x][y] = hiddenStyle;
        } else {
          newTable[x][y] = clone[x - 1][y - 1];
        }
      }
    }
  }
  return newTable;
}

function tableStyleRemovePaddingClone(array: any[][]) {
  const clone = structuredClone(array);
  clone.shift();
  clone.pop();
  clone.forEach((row) => {
    row.shift();
    row.pop();
  });
  return clone;
}
