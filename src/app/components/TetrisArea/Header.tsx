import headerStyle from "./header.module.css";

export function Header() {
  return (
    <>
      <div className={headerStyle.left}>left</div>
      <div className={headerStyle.right}>right</div>
    </>
  );
}
