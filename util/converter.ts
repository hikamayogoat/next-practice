import { constVars } from "@/app/config/config";

export function convertNumberToMinoName(minoNumber: number) {
  switch (minoNumber) {
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
  }
}

export function convertNumberToMinoColorCode(minoNumber: number) {
  switch (minoNumber) {
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
  }
}
