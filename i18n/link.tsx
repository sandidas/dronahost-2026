"use client";

import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Locale-aware Link as a client module. Server components render it without asking the server for
 * the locale, which keeps pages statically generated. Use this instead of next/link.
 */
export const { Link } = createNavigation(routing);
