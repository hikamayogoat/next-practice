"use client";

import { Inter } from "@next/font/google";
import Top from "./components/TetrisArea/TetrisArea";
import styles from "./page.module.css";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className={styles.main}>
      <Top />
    </main>
  );
}
