/** Windows checkouts often turn line endings into CRLF. Every reader of text files goes through `lf` so a CRLF file reads the same as an LF one. */
import { readFileSync } from "node:fs";

export const lf = (text: string): string => text.replace(/\r\n?/g, "\n");
export const readLf = (file: string): string => lf(readFileSync(file, "utf8"));
