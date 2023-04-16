import { config } from "@/app/config/config";

export function generateEmptyTableStyleArray(): any[][] {
  const initArray = new Array(config.tetrisTableWidth);
  for (let x = 0; x < config.tetrisTableWidth; x++) {
    initArray[x] = new Array(config.tetrisTableHeight).fill({
      backgroundColor: config.defaultBackgroundColor,
    });
  }
  return initArray;
}
