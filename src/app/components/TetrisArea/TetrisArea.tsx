import tetrisArea from "./tetrisArea.module.css";
import { useState } from "react";
import { Nexts } from "./Nexts/Nexts";
import { TetrisTable } from "./TetrisTable/TetrisTable";
import { Minos } from "../../config/config";

export default function Top() {
  const [tableState, setTableState] = useState(getTableStateInitArray());
  const [nexts, setNexts] = useState(getNextsInitArray());

  const tetrisFieldProps = {
    tableState: tableState,
    setTableState: setTableState,
  };

  const nextsProps = {
    nexts: nexts,
  };

  return (
    <div className={tetrisArea.top}>
      <TetrisTable {...tetrisFieldProps} />
      <Nexts {...nextsProps} />
    </div>
  );
}

function getTableStateInitArray() {
  const initStyle = {
    backgroundColor: "white",
  };

  var initArray = new Array(10).fill(initStyle);
  for (let i = 0; i < 10; i++) {
    initArray[i] = new Array(20).fill(initStyle);
  }

  return initArray;
}

function getNextsInitArray() {
  return new Array(5).fill(Minos.I);
}
