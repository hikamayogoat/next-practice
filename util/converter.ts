import { ControlMino } from "@/app/components/TetrisArea/TetrisArea";
import { BlockKind, constVars } from "@/app/config/config";

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
    case BlockKind.WHITE:
      return "WHITE";
    case BlockKind.GRAY:
      return "GRAY";
  }
}

export function convertNumberToMinoColorCode(kind: BlockKind) {
  switch (kind) {
    case BlockKind.O:
      return constVars.minoColorCodes.O;
    case BlockKind.Z:
      return constVars.minoColorCodes.Z;
    case BlockKind.T:
      return constVars.minoColorCodes.T;
    case BlockKind.L:
      return constVars.minoColorCodes.L;
    case BlockKind.I:
      return constVars.minoColorCodes.I;
    case BlockKind.J:
      return constVars.minoColorCodes.J;
    case BlockKind.S:
      return constVars.minoColorCodes.S;
    case BlockKind.WHITE:
      return constVars.minoColorCodes.WHITE;
    case BlockKind.GRAY:
      return constVars.minoColorCodes.GRAY;
  }
}

export function getRelativeActivePosition(mino: ControlMino) {
  switch (mino.blockKind) {
    case BlockKind.O:
      return constVars.minoPosition.O[mino.rotation];
    case BlockKind.Z:
      return constVars.minoPosition.Z[mino.rotation];
    case BlockKind.T:
      return constVars.minoPosition.T[mino.rotation];
    case BlockKind.L:
      return constVars.minoPosition.L[mino.rotation];
    case BlockKind.I:
      return constVars.minoPosition.I[mino.rotation];
    case BlockKind.J:
      return constVars.minoPosition.J[mino.rotation];
    case BlockKind.S:
      return constVars.minoPosition.S[mino.rotation];
    default:
      return [[0, 0]];
  }
}
