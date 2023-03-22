import { BlockKind, constVars } from "@/app/config/config";

export function convertNumberToMinoName(block: BlockKind) {
  switch (block) {
    case 0:
      return "O";
    case 1:
      return "Z";
    case 2:
      return "T";
    case 3:
      return "L";
    case 4:
      return "I";
    case 5:
      return "J";
    case 6:
      return "S";
    case 7:
      return "WHITE";
    case 8:
      return "GRAY";
  }
}

export function convertNumberToMinoColorCode(block: BlockKind) {
  switch (block) {
    case 0:
      return constVars.minoColorCodes.O;
    case 1:
      return constVars.minoColorCodes.Z;
    case 2:
      return constVars.minoColorCodes.T;
    case 3:
      return constVars.minoColorCodes.L;
    case 4:
      return constVars.minoColorCodes.I;
    case 5:
      return constVars.minoColorCodes.J;
    case 6:
      return constVars.minoColorCodes.S;
    case 7:
      return constVars.minoColorCodes.WHITE;
    case 8:
      return constVars.minoColorCodes.GRAY;
  }
}

export function getRelativeActivePosition(block: BlockKind) {
  switch (block) {
    case 0:
      return [
        [0, 0],
        [-1, 0],
        [0, -1],
        [-1, -1],
      ];
    case 1:
      return [[0, 0]];
    case 2:
      return [[0, 0]];
    case 3:
      return [[0, 0]];
    case 4:
      return [[0, 0]];
    case 5:
      return [[0, 0]];
    case 6:
      return [[0, 0]];
    default:
      return [[0, 0]];
  }
}
