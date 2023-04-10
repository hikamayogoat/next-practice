export function loggingHistoryTable(table: any[][]) {
  let text = "";
  for (let x = 0; x < table.length; x++) {
    for (let y = 0; y < table[x].length; y++) {
      text += table[x][y];
    }
    text += "\n";
  }
  console.log(text);
}
