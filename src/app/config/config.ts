export enum BlockKind {
  NONE,
  O,
  Z,
  T,
  L,
  I,
  J,
  S,
  // GRAY,
  // ERASER,
}

export const config = {
  tetrisTableWidth: 10,
  tetrisTableHeight: 20,
  historyStorageKey: "tableHistory",
  historyChars: {
    EMPTY: ".",
    O: "O",
    Z: "Z",
    T: "T",
    L: "L",
    I: "I",
    J: "J",
    S: "S",
    GRAY: "G",
  },
  usedMinoHistoryStorageKey: "usedMinoHistory",
  lineClearIndexListStorageKey: "lineClearIndex",
  defaultBackgroundColor: "#909090",
  minoColorCodes: {
    WHITE: "white",
    O: "#ffff00",
    Z: "#ff0000",
    T: "#800080",
    L: "#ffa500",
    I: "#00ffff",
    J: "#0000ff",
    S: "#00ff00",
    GRAY: "#202020",
  },
  minoPosition: {
    O: [
      [
        [0, 0],
        [-1, 0],
        [0, -1],
        [-1, -1],
      ],
      [
        [0, 0],
        [-1, 0],
        [0, -1],
        [-1, -1],
      ],
      [
        [0, 0],
        [-1, 0],
        [0, -1],
        [-1, -1],
      ],
      [
        [0, 0],
        [-1, 0],
        [0, -1],
        [-1, -1],
      ],
    ],
    Z: [
      [
        [0, 0],
        [0, -1],
        [-1, -1],
        [1, 0],
      ],
      [
        [0, 0],
        [0, 1],
        [1, 0],
        [1, -1],
      ],
      [
        [0, 0],
        [-1, 0],
        [0, 1],
        [1, 1],
      ],
      [
        [0, 0],
        [0, -1],
        [-1, 0],
        [-1, 1],
      ],
    ],
    T: [
      [
        [0, 0],
        [-1, 0],
        [1, 0],
        [0, -1],
      ],
      [
        [0, 0],
        [0, 1],
        [1, 0],
        [0, -1],
      ],
      [
        [0, 0],
        [-1, 0],
        [0, 1],
        [1, 0],
      ],
      [
        [0, 0],
        [0, -1],
        [-1, 0],
        [0, 1],
      ],
    ],
    L: [
      [
        [0, 0],
        [-1, 0],
        [1, 0],
        [1, -1],
      ],
      [
        [0, 0],
        [0, 1],
        [0, -1],
        [1, 1],
      ],
      [
        [0, 0],
        [-1, 0],
        [-1, 1],
        [1, 0],
      ],
      [
        [0, 0],
        [0, -1],
        [-1, -1],
        [0, 1],
      ],
    ],
    I: [
      [
        [0, 0],
        [-1, 0],
        [-2, 0],
        [1, 0],
      ],
      [
        [0, 0],
        [0, -1],
        [0, 1],
        [0, 2],
      ],
      [
        [0, 0],
        [-1, 0],
        [-2, 0],
        [1, 0],
      ],
      [
        [0, 0],
        [0, -1],
        [0, 1],
        [0, 2],
      ],
    ],
    J: [
      [
        [0, 0],
        [1, 0],
        [-1, 0],
        [-1, -1],
      ],
      [
        [0, 0],
        [0, -1],
        [0, 1],
        [1, -1],
      ],
      [
        [0, 0],
        [-1, 0],
        [1, 0],
        [1, 1],
      ],
      [
        [0, 0],
        [0, 1],
        [-1, 1],
        [0, -1],
      ],
    ],
    S: [
      [
        [0, 0],
        [-1, 0],
        [0, -1],
        [1, -1],
      ],
      [
        [0, 0],
        [0, -1],
        [1, 0],
        [1, 1],
      ],
      [
        [0, 0],
        [1, 0],
        [0, 1],
        [-1, 1],
      ],
      [
        [0, 0],
        [0, 1],
        [-1, 0],
        [-1, -1],
      ],
    ],
  },
};
