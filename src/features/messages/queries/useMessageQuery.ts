import { useCallback, useMemo } from 'react';
import { useQuery } from 'urql';

import { MessageStatus } from '../../../types';
import { isValidAddressFast, isValidTransactionHash } from '../../../utils/addresses';
import { useInterval } from '../../../utils/useInterval';
import {
  MessageIdentifierType,
  buildMessageQuery,
  buildMessageSearchQuery,
} from '../queries/build';
import { MessagesQueryResult, MessagesStubQueryResult } from '../queries/fragments';
import { parseMessageQueryResult, parseMessageStubResult } from '../queries/parse';

const SEARCH_AUTO_REFRESH_DELAY = 15000;
const MSG_AUTO_REFRESH_DELAY = 10000;
const LATEST_QUERY_LIMIT = 12;
const SEARCH_QUERY_LIMIT = 50;

export function isValidSearchQuery(input: string, allowAddress?: boolean) {
  if (!input) return false;
  if (isValidTransactionHash(input)) return true;
  if (allowAddress && isValidAddressFast(input)) return true;
  return false;
}

export function useMessageSearchQuery(
  sanitizedInput: string,
  originChainFilter: string | null,
  destinationChainFilter: string | null,
  startTimeFilter: number | null,
  endTimeFilter: number | null,
) {
  const hasInput = !!sanitizedInput;
  const isValidInput = hasInput ? isValidSearchQuery(sanitizedInput, true) : true;

  // Assemble GraphQL query
  const { query, variables } = buildMessageSearchQuery(
    sanitizedInput,
    originChainFilter,
    destinationChainFilter,
    startTimeFilter,
    endTimeFilter,
    hasInput ? SEARCH_QUERY_LIMIT : LATEST_QUERY_LIMIT,
    true,
  );

  // Execute query
  const [result, reexecuteQuery] = useQuery<MessagesStubQueryResult>({
    query,
    variables,
    pause: !isValidInput,
  });
  const { data, fetching: isFetching, error } = result;

  // Parse results
  const messageList = useMemo(() => parseMessageStubResult(data), [data]);
  const isMessagesFound = messageList.length > 0;

  // Setup interval to re-query
  const reExecutor = useCallback(() => {
    if (query && isValidInput) {
      reexecuteQuery({ requestPolicy: 'network-only' });
    }
  }, [reexecuteQuery, query, isValidInput]);
  useInterval(reExecutor, SEARCH_AUTO_REFRESH_DELAY);

  return {
    isValidInput,
    isFetching,
    isError: !!error,
    hasRun: !!data,
    isMessagesFound,
    messageList,
  };
}

export function useMessageQuery({ messageId, pause }: { messageId: string; pause: boolean }) {
  // Assemble GraphQL Query
  const { query, variables } = buildMessageQuery(MessageIdentifierType.Id, messageId, 1);

  // Execute query
  const [{ data, fetching: isFetching, error }, reexecuteQuery] = useQuery<MessagesQueryResult>({
    query,
    variables,
    pause,
  });

  // Parse results
  const messageList = useMemo(() => parseMessageQueryResult(data), [data]);
  const isMessageFound = messageList.length > 0;
  const message = isMessageFound ? messageList[0] : null;
  const msgStatus = message?.status;

  // Setup interval to re-query
  const reExecutor = useCallback(() => {
    if (pause || (isMessageFound && msgStatus === MessageStatus.Delivered)) return;
    reexecuteQuery({ requestPolicy: 'network-only' });
  }, [pause, isMessageFound, msgStatus, reexecuteQuery]);
  useInterval(reExecutor, MSG_AUTO_REFRESH_DELAY);

  return {
    isFetching,
    isError: !!error,
    hasRun: !!data,
    isMessageFound,
    message,
  };
}
