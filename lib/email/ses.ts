import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";

/**
 * Amazon SES notifications to the team. Needs AWS_REGION, SES_FROM (a verified identity) and
 * SES_TO (comma-separated recipients); credentials come from the standard AWS environment or
 * instance role. When not configured nothing is sent and the caller is told, so a stored
 * submission is never reported as emailed.
 */
let client: SESv2Client | null = null;

export const sesConfigured = (): boolean => Boolean(process.env.AWS_REGION && process.env.SES_FROM && process.env.SES_TO);

/** Strip line breaks so visitor input can never inject headers. */
const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").slice(0, 200);

export async function notifyTeam(opts: { subject: string; body: string; replyTo?: string }): Promise<boolean> {
  if (!sesConfigured()) return false;
  try {
    client ??= new SESv2Client({ region: process.env.AWS_REGION });
    await client.send(
      new SendEmailCommand({
        FromEmailAddress: process.env.SES_FROM,
        Destination: { ToAddresses: (process.env.SES_TO ?? "").split(",").map((a) => a.trim()).filter(Boolean) },
        ReplyToAddresses: opts.replyTo ? [oneLine(opts.replyTo)] : undefined,
        Content: { Simple: { Subject: { Data: oneLine(opts.subject) }, Body: { Text: { Data: opts.body } } } },
      }),
    );
    return true;
  } catch {
    // No visitor data in logs.
    return false;
  }
}
