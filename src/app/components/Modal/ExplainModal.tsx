import { useState } from "react";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import explainModalStyle from "./explainModal.module.css";
import Modal from "react-modal";

export function ExplainModal() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const toggleModal = () => {
    setModalIsOpen(!modalIsOpen);
  };

  const modalStyle = {
    content: {
      top: "20%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      minWidth: "40%",
    },
  };

  return (
    <>
      <AiOutlineQuestionCircle
        className={explainModalStyle.icon}
        onClick={toggleModal}
      ></AiOutlineQuestionCircle>
      <Modal style={modalStyle} isOpen={modalIsOpen}>
        <h2>このページについて</h2>
        テトリスの譜面分析ページの試作品です。
        <br />
        開発途中のものをリアルタイムに公開しているため、すべての機能は何の予告もなく変更されます。
        <br />
        <br />
        スマートフォンからの閲覧は想定していません。 <br />
        最新のGoogle Chromeでのみ動作を確認しています。
        <br />
      </Modal>
    </>
  );
}
