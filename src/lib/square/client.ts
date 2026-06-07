import { SquareClient } from "square";
import { getSquareConfig } from "@/lib/square/config";

let cachedClient: SquareClient | null = null;

export function getSquareClient(): SquareClient {
  if (!cachedClient) {
    const { accessToken, environment } = getSquareConfig();
    cachedClient = new SquareClient({
      token: accessToken,
      environment,
    });
  }
  return cachedClient;
}
