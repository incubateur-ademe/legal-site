import { ReasonPhrases, StatusCodes } from "http-status-codes";

export const getStatusCodeResponse = (code: keyof typeof StatusCodes) =>
  new Response(ReasonPhrases[code], { status: StatusCodes[code] });
