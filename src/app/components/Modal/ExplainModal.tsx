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
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      minWidth: "40%",
      maxHeight: "80%",
    },
    overflowY: "auto",
  };

  return (
    <>
      <AiOutlineQuestionCircle
        className={explainModalStyle.icon}
        onClick={toggleModal}
      ></AiOutlineQuestionCircle>
      <Modal style={modalStyle} isOpen={modalIsOpen}>
        <h2>このページについて</h2>
        テトリスの譜面分析ページの試作品です。 <br />
        開発途中のものをリアルタイムに公開しているため、すべての機能は何の予告もなく変更されます。
        <br />
        <br />
        スマートフォンからの閲覧は想定していません。 <br />
        最新のGoogle Chromeでのみ動作を確認しています。
        <br />
        <br />
        製作中のものなので、大した反応はできないかもしれませんが、何かあればTwitterまで <br />
        https://twitter.com/hikamajin_tet <br />
        <br />
        <h3>今後実装予定の機能など（いつやるかは未定）</h3>
        <ul>
          <li>ページの見た目をかっこよくする</li>
          <li>スマートフォンから操作しやすいようにする</li>
          <li>譜面データを公開できるようにし、一覧ページを作る</li>
          <li>より短い共有用URLの生成</li>
          <li>ホールドも考慮できるようにする</li>
          <li>組み換えを設定できるようにする</li>
        </ul>
        <br />
        <h3>なんとなく作れそうな予感がする、いつか作るかも機能</h3>
        <ul>
          <li>自分で入力した形から、似たテンプレを検索する</li>
          <li>YouTubeなどの時刻を指定しただけで、そこからの盤面を譜面に起こす</li>
        </ul>
      </Modal>
    </>
  );
}
