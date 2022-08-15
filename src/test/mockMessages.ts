import { constants } from 'ethers';
import { chain } from 'wagmi';

import {
  avalancheChain,
  bscChain,
  celoMainnetChain,
} from '../consts/networksConfig';
import { Message, MessageStatus, PartialTransactionReceipt } from '../types';

function randomAddress() {
  return (
    '0x' +
    [...Array(40)]
      .map(() => Math.floor(Math.random() * 16).toString(16))
      .join('')
  );
}

export const MOCK_TX_HASH =
  '0x0948a5377b757038b3f1a9948b8b5b2e5370c4d0801e68e005eb598048393d68';

export const MOCK_TRANSACTION: PartialTransactionReceipt = {
  to: constants.AddressZero,
  from: constants.AddressZero,
  contractAddress: constants.AddressZero,
  transactionHash: MOCK_TX_HASH,
  blockNumber: 123456789,
};

export const MOCK_MESSAGES: Message[] = [
  {
    id: '1',
    status: MessageStatus.Delivered,
    sender: randomAddress(),
    recipient: randomAddress(),
    body: constants.AddressZero + constants.AddressZero + constants.AddressZero,
    originChainId: chain.mainnet.id,
    destinationChainId: chain.arbitrum.id,
    originTransaction: MOCK_TRANSACTION,
    destinationTransaction: MOCK_TRANSACTION,
    originTimeSent: Date.now() - 86_400_000, // 1 day ago
    destinationTimeSent: Date.now() - 86_400_000, // 1 day ago
  },
  {
    id: '2',
    status: MessageStatus.Delivered,
    sender: randomAddress(),
    recipient: randomAddress(),
    body: constants.AddressZero + constants.AddressZero + constants.AddressZero,
    originChainId: chain.polygon.id,
    destinationChainId: chain.optimism.id,
    originTransaction: MOCK_TRANSACTION,
    destinationTransaction: MOCK_TRANSACTION,
    originTimeSent: Date.now() - 86_400_000, // 1 day ago
    destinationTimeSent: Date.now() - 86_400_000, // 1 day ago
  },
  {
    id: '3',
    status: MessageStatus.Delivered,
    sender: randomAddress(),
    recipient: randomAddress(),
    body: constants.AddressZero + constants.AddressZero + constants.AddressZero,
    originChainId: avalancheChain.id,
    destinationChainId: celoMainnetChain.id,
    originTransaction: MOCK_TRANSACTION,
    destinationTransaction: MOCK_TRANSACTION,
    originTimeSent: Date.now() - 43_200_000, // 12 hours ago
    destinationTimeSent: Date.now() - 43_200_000, // 12 hours ago
  },
  {
    id: '4',
    status: MessageStatus.Delivered,
    sender: randomAddress(),
    recipient: randomAddress(),
    body: constants.AddressZero + constants.AddressZero + constants.AddressZero,
    originChainId: bscChain.id,
    destinationChainId: chain.mainnet.id,
    originTransaction: MOCK_TRANSACTION,
    destinationTransaction: MOCK_TRANSACTION,
    originTimeSent: Date.now() - 21_600_000, // 6 hours ago
    destinationTimeSent: Date.now() - 21_600_000, // 6 hours ago
  },
  {
    id: '5',
    status: MessageStatus.Failing,
    sender: randomAddress(),
    recipient: randomAddress(),
    body: constants.AddressZero + constants.AddressZero + constants.AddressZero,
    originChainId: chain.mainnet.id,
    destinationChainId: chain.goerli.id,
    originTransaction: MOCK_TRANSACTION,
    destinationTransaction: undefined,
    originTimeSent: Date.now() - 100_000,
  },
  {
    id: '6',
    status: MessageStatus.Pending,
    sender: randomAddress(),
    recipient: randomAddress(),
    body: constants.AddressZero + constants.AddressZero + constants.AddressZero,
    originChainId: chain.mainnet.id,
    destinationChainId: celoMainnetChain.id,
    originTransaction: MOCK_TRANSACTION,
    destinationTransaction: undefined,
    originTimeSent: Date.now() - 90_000,
  },
  {
    id: '7',
    status: MessageStatus.Pending,
    sender: randomAddress(),
    recipient: randomAddress(),
    body: constants.AddressZero + constants.AddressZero + constants.AddressZero,
    originChainId: chain.optimism.id,
    destinationChainId: avalancheChain.id,
    originTransaction: MOCK_TRANSACTION,
    destinationTransaction: undefined,
    originTimeSent: Date.now() - 80_000,
  },
  {
    id: '8',
    status: MessageStatus.Pending,
    sender: randomAddress(),
    recipient: randomAddress(),
    body: constants.AddressZero + constants.AddressZero + constants.AddressZero,
    originChainId: bscChain.id,
    destinationChainId: avalancheChain.id,
    originTransaction: MOCK_TRANSACTION,
    destinationTransaction: undefined,
    originTimeSent: Date.now(),
  },
  {
    id: '9',
    status: MessageStatus.Pending,
    sender: randomAddress(),
    recipient: randomAddress(),
    body: constants.AddressZero + constants.AddressZero + constants.AddressZero,
    originChainId: chain.arbitrum.id,
    destinationChainId: chain.polygon.id,
    originTransaction: MOCK_TRANSACTION,
    destinationTransaction: undefined,
    originTimeSent: Date.now(),
  },
];
