import type { MessageStatus, MessageTx } from '../../types';
import type { MessageDebugStatus } from '../debugger/types';

interface MessageDeliveryResult {
  status: MessageStatus;
}

export interface MessageDeliverySuccessResult extends MessageDeliveryResult {
  status: MessageStatus.Delivered;
  deliveryTransaction: MessageTx;
}

export interface MessageDeliveryFailingResult extends MessageDeliveryResult {
  status: MessageStatus.Failing;
  debugStatus: MessageDebugStatus;
  debugDetails: string;
}

export interface MessageDeliveryPendingResult extends MessageDeliveryResult {
  status: MessageStatus.Pending;
}

export type MessageDeliveryStatusResponse =
  | MessageDeliverySuccessResult
  | MessageDeliveryFailingResult
  | MessageDeliveryPendingResult;
