import { SquareEnvironment } from "square";

export interface SquareConfig {
  accessToken: string;
  locationId: string;
  environment:
    | typeof SquareEnvironment.Sandbox
    | typeof SquareEnvironment.Production;
}

export class SquareNotConfiguredError extends Error {
  constructor() {
    super(
      "Square is not configured. Set SQUARE_ACCESS_TOKEN and SQUARE_LOCATION_ID in your environment.",
    );
    this.name = "SquareNotConfiguredError";
  }
}

/** True when Square credentials are present — invoice creation can run */
export function isSquareConfigured(): boolean {
  return Boolean(
    process.env.SQUARE_ACCESS_TOKEN?.trim() &&
      process.env.SQUARE_LOCATION_ID?.trim(),
  );
}

export function getSquareConfig(): SquareConfig {
  const accessToken = process.env.SQUARE_ACCESS_TOKEN?.trim();
  const locationId = process.env.SQUARE_LOCATION_ID?.trim();

  if (!accessToken || !locationId) {
    throw new SquareNotConfiguredError();
  }

  const environment =
    process.env.SQUARE_ENVIRONMENT?.trim().toLowerCase() === "production"
      ? SquareEnvironment.Production
      : SquareEnvironment.Sandbox;

  return { accessToken, locationId, environment };
}
