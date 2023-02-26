import { Inter } from "@next/font/google";
import styles from "./page.module.css";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const rowCells = new Array<number>(10).fill(0);
  const columnCells = new Array<number>(10).fill(0);

  return (
    <main className={styles.main}>
      <p> should shown a table below </p>
      <table border={1}>
        {
          columnCells.map((col) =>
          <tr>
            {
              rowCells.map((row) => 
                <td>0</td>
              )
            }
          </tr>
          )
        }
      </table>
    </main>
  );
}
