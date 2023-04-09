import { ControlMino } from "@/app/components/TetrisArea/TetrisArea";
import { BlockKind, config } from "@/app/config/config";

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

export function convertNumberToMinoColorCode(kind: BlockKind) {
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
