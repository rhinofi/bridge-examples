export const tronAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "commitmentId",
        type: "uint256",
      },
    ],
    name: "depositWithId",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "depositNative",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
];