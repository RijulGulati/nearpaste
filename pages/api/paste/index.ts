import type { NextApiRequest, NextApiResponse } from 'next';
import { generateId, getTxnSuccessValue } from '../../../utils/common';
import {
  HttpPasteCreateRequest,
  HttpPasteCreateResponse,
  HttpPasteGetResponse,
  HttpResponse,
  PasteNearRequest,
} from '../../../utils/interfaces';
import { createPaste, getPaste } from '../services/common';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  let response: HttpResponse = {
    data: null,
  };
  if (req.method === 'POST') {
    let paste: HttpPasteCreateRequest = req.body;

    if (!paste.title) {
      response.message = 'Title cannot be empty';
      res.status(400).json(response);
    }

    if (!paste.content) {
      response.message = 'Content cannot be empty';
      res.status(400).json(response);
    }

    const id = generateId(7);

    const pasteNear: PasteNearRequest = {
      id: id,
      content: paste.content,
      is_encrypted: paste.isEncrypted ? paste.isEncrypted : false,
      title: paste.title,
    };

    let result = await createPaste(pasteNear);

    let pasteResult = getTxnSuccessValue(result.status);
    if (pasteResult === 'true') {
      // successfully created
      let paste: HttpPasteCreateResponse = {
        id: id,
        txnId: result.transaction_outcome.id,
      };
      response.message = 'Paste created successfully!';
      response.data = paste;
      res.status(200).json(response);
    } else {
      response.message = 'Unexpected result. Please try again in some time';
      res.status(500).json(response);
    }
  }

  if (req.method === 'GET') {
    let id = req.query.id;
    let pasteId: string = '';
    if (!id) {
      response.message = 'id not provided';
      response.data = null;
      res.status(400).json(response);
    } else {
      if (Array.isArray(id)) {
        pasteId = id[0];
      } else {
        pasteId = id;
      }

      let pasteResult = await getPaste(pasteId);
      if (!pasteResult) {
        response.message = 'Paste not found';
        res.status(200).json(response);
      } else {
        const paste: HttpPasteGetResponse = {
          id: pasteResult.id,
          content: pasteResult.content,
          isEncrypted: pasteResult.is_encrypted,
          timestamp: pasteResult.timestamp,
          title: pasteResult.title,
        };
        response.data = paste;
        response.message = 'Paste found';
        res.status(200).json(response);
      }
    }
  }
}
