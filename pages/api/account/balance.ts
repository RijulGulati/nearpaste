import { NextApiRequest, NextApiResponse } from 'next';
import {
  HttpPasteAccountBalance,
  HttpResponse,
} from '../../../utils/interfaces';
import { getAccountBalance } from '../services/common';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  let response: HttpResponse = {
    data: null,
  };
  if (req.method === 'GET') {
    const balance = await getAccountBalance();
    let countResponse: HttpPasteAccountBalance = {
      balance: balance,
    };
    response.data = countResponse;
    res.status(200).json(response);
  }
}
