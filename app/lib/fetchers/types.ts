import type { CategoryKey } from "../categories";

export interface FetchedProfile {
  name: string;
  imageUrl: string | null;
  category: CategoryKey;
}

export class FetchProfileError extends Error {
  constructor(
    message: string,
    readonly code:
      | "not_found"
      | "unauthorized"
      | "unavailable"
      | "invalid_response",
  ) {
    super(message);
    this.name = "FetchProfileError";
  }
}

export const USER_AGENT = "SukikiraiVRC/1.0.0 https://sukikiraivrc.com";
