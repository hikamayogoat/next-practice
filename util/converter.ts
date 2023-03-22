import { BlockKind, constVars } from "@/app/config/config";

export function convertNumberToMinoName(block: BlockKind) {
  switch (block) {
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

export function convertNumberToMinoColorCode(block: BlockKind) {
  switch (block) {
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

export function getRelativeActivePosition(block: BlockKind) {
  switch (block) {
    case BlockKind.O:
      return [
        [0, 0],
        [-1, 0],
        [0, -1],
        [-1, -1],
      ];
    case BlockKind.Z:
      return [
        [0, 0],
        [-1, 0],
        [-1, -1],
        [-2, -1],
      ];
    case BlockKind.T:
      return [
        [0, 0],
        [-1, 0],
        [1, 0],
        [0, -1],
      ];
    case BlockKind.L:
      return [
        [0, 0],
        [-1, 0],
        [-1, -1],
        [-1, -2],
      ];
    case BlockKind.I:
      return [
        [0, 0],
        [0, 1],
        [0, -1],
        [0, -2],
      ];
    case BlockKind.J:
      return [
        [0, 0],
        [-1, 0],
        [0, -1],
        [0, -2],
      ];
    case BlockKind.S:
      return [
        [0, 0],
        [-1, 0],
        [0, -1],
        [1, -1],
      ];
    default:
      return [[0, 0]];
  }
}
