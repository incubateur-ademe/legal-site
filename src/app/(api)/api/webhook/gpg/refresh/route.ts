import { execFile } from "child_process";
import { StatusCodes } from "http-status-codes";
import { unauthorized } from "next/navigation";
import { type NextRequest } from "next/server";
import { promisify } from "util";

import { config } from "@/config";

const execFileAsync = promisify(execFile);

export const GET = async (req: NextRequest) => {
  const headerSecret = req.headers.get("x-api-key");
  if (headerSecret !== config.security.webhook.secret) {
    unauthorized();
  }

  try {
    const { stderr, stdout } = await execFileAsync("./scripts/refresh_gpg_passphrase.sh");
    if (stderr) {
      console.error(`[gpg-refresh] ${stderr}`);
      return Response.json(
        {
          ok: false,
          error: stderr,
        },
        {
          status: StatusCodes.INTERNAL_SERVER_ERROR,
        },
      );
    }

    return Response.json({
      ok: true,
      message: stdout,
    });
  } catch (error) {
    const message = (error as Error).message;
    console.error(`[gpg-refresh] ${message}`);
    return Response.json(
      {
        ok: false,
        error: message,
      },
      {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      },
    );
  }
};
