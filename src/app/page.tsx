"use client";

import { Inter } from "@next/font/google";
import { useState } from "react";
import { ExplainModal } from "./components/Modal/ExplainModal";
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
      <div className={styles.footer}>
        <ExplainModal />
      </div>
    </div>
  );
}
