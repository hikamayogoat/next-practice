import { constVars } from "@/app/config/config";
import { useState } from "react";
import MinoCandidate from "./MinoCandidate/MinoCandidate";
import { TetrisTable } from "./TetrisTable/TetrisTable";

export default function Top() {
  const initStyle = {
    backgroundColor: "white",
  };

  var initArray = new Array(10).fill(initStyle);
  for (let i = 0; i < 10; i++) {
    initArray[i] = new Array(20).fill(initStyle);
  }

  const [tableState, setTableState] = useState(initArray);

  const tetrisFieldProps = {
    tableState: tableState,
    setTableState: setTableState,
  };

  return (
    <div>
      <TetrisTable {...tetrisFieldProps} />
      <MinoCandidate />
    </div>
  );
}
