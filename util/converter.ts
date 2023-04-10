import { ControlMino } from "@/app/components/TetrisArea/TetrisArea";
import { BlockKind, config } from "@/app/config/config";
import { loggingHistoryTable } from "./debug";

export function convertNumberToMinoName(kind: BlockKind) {
  switch (kind) {
    case BlockKind.O:
      return "O";
    case BlockKind.Z:
      return "Z";
    case BlockKind.T:
      return "T";
    case BlockKind.L:
      return "L";
    case BlockKind.I:
      return "I";
    case BlockKind.J:
      return "J";
    case BlockKind.S:
      return "S";
    case BlockKind.GRAY:
      return "GRAY";
    case BlockKind.ERASER:
      return "ERASER";
  }
}

export function convertBlockKindToColorCode(kind: BlockKind) {
  switch (kind) {
    case BlockKind.O:
      return config.minoColorCodes.O;
    case BlockKind.Z:
      return config.minoColorCodes.Z;
    case BlockKind.T:
      return config.minoColorCodes.T;
    case BlockKind.L:
      return config.minoColorCodes.L;
    case BlockKind.I:
      return config.minoColorCodes.I;
    case BlockKind.J:
      return config.minoColorCodes.J;
    case BlockKind.S:
      return config.minoColorCodes.S;
    case BlockKind.GRAY:
      return config.minoColorCodes.GRAY;
    case BlockKind.ERASER:
      return config.defaultBackgroundColor;
  }
}

export function getRelativeActivePosition(mino: ControlMino) {
  switch (mino.blockKind) {
    case BlockKind.O:
      return config.minoPosition.O[mino.rotation];
    case BlockKind.Z:
      return config.minoPosition.Z[mino.rotation];
    case BlockKind.T:
      return config.minoPosition.T[mino.rotation];
    case BlockKind.L:
      return config.minoPosition.L[mino.rotation];
    case BlockKind.I:
      return config.minoPosition.I[mino.rotation];
    case BlockKind.J:
      return config.minoPosition.J[mino.rotation];
    case BlockKind.S:
      return config.minoPosition.S[mino.rotation];
    default:
      return [[0, 0]];
  }
}

export function convertHistoryFromTableStyle(tableStyle: any[][]) {
  const table = new Array(tableStyle.length);
  for (let x = 0; x < tableStyle.length; x++) {
    table[x] = new Array(tableStyle[0].length);
  }

  for (let x = 0; x < tableStyle.length; x++) {
    for (let y = 0; y < tableStyle[0].length; y++) {
      const color = tableStyle[x][y].backgroundColor;
      switch (color) {
        case config.minoColorCodes.O:
          table[x][y] = config.historyChars.O;
          break;
        case config.minoColorCodes.Z:
          table[x][y] = config.historyChars.Z;
          break;
        case config.minoColorCodes.T:
          table[x][y] = config.historyChars.T;
          break;
        case config.minoColorCodes.L:
          table[x][y] = config.historyChars.L;
          break;
        case config.minoColorCodes.I:
          table[x][y] = config.historyChars.I;
          break;
        case config.minoColorCodes.J:
          table[x][y] = config.historyChars.J;
          break;
        case config.minoColorCodes.S:
          table[x][y] = config.historyChars.S;
          break;
        case config.minoColorCodes.GRAY:
          table[x][y] = config.historyChars.GRAY;
          break;
        default:
          table[x][y] = config.historyChars.EMPTY;
      }
    }
  }
  return table;
}
