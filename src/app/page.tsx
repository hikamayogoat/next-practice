"use client";

import { Inter } from "@next/font/google";
import { useRef, useState } from "react";
import { Header } from "./components/TetrisArea/Header";
import Top from "./components/TetrisArea/TetrisArea";
import styles from "./page.module.css";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div>
      <div className={styles.header}>
        <Header />
      </div>
      <main className={styles.main}>
        <Top />
      </main>
    </div>
  );
}
