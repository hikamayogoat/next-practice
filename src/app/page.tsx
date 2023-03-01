"use client";

import { Inter } from "@next/font/google";
import TetrisField from "./components/TetrisTable/TetrisTable";
import styles from "./page.module.css";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className={styles.main}>
      <TetrisField />
    </main>
  );
}
