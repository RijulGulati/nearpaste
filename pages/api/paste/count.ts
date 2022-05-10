import { NextApiRequest, NextApiResponse } from 'next';
import {
  HttpPasteCountResponse,
  HttpResponse,
} from '../../../utils/interfaces';
import { getTotalPasteCount } from '../services/common';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  let response: HttpResponse = {
    data: null,
  };
  if (req.method === 'GET') {
    const count = await getTotalPasteCount();
    let countResponse: HttpPasteCountResponse = {
      count: count,
    };
    response.data = countResponse;
    res.status(200).json(response);
  }
}
