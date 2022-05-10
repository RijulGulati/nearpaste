import { AccountBalance } from 'near-api-js/lib/account';

export interface PasteBase {
  title: string;
  content: string;
}

export interface PasteWithId extends PasteBase {
  id: string;
}

export interface PasteWithTimestamp extends PasteWithId {
  timestamp: number;
}

export interface PasteNearRequest extends PasteWithId {
  is_encrypted: boolean;
}

export interface PasteNearResponse
  extends PasteWithTimestamp,
    PasteNearRequest {}

export interface HttpPasteCreateRequest extends PasteBase {
  isEncrypted: boolean;
}

export interface HttpPasteCreateResponse {
  id: string;
  txnId: string;
}

export interface HttpPasteGetResponse
  extends HttpPasteCreateRequest,
    PasteWithTimestamp {}

export interface HttpResponse {
  message?: string;
  data:
    | HttpPasteCreateResponse
    | HttpPasteGetResponse
    | HttpPasteCountResponse
    | HttpPasteAccountBalance
    | null;
}

export interface HttpPasteCountResponse {
  count: number;
}

export interface HttpPasteAccountBalance {
  balance: AccountBalance;
}

export interface GenericPageProps {
  host?: string;
  networkId?: string;
  accountId?: string;
}

export interface PasteUx extends HttpPasteCreateRequest, PasteWithId {
  createdAt: string;
}
