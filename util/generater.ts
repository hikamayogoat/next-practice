import { config } from "@/app/config/config";

export function generateEmptyTableStyleArray() {
  const initArray = new Array(10);
  for (let x = 0; x < 10; x++) {
    initArray[x] = new Array(20).fill({
      backgroundColor: config.defaultBackgroundColor,
    });
  }
  return initArray;
}
