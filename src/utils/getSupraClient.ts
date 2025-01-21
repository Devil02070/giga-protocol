import { SupraClient } from "supra-l1-sdk";

export function getSupraClient() {
    return new SupraClient(process.env.SUPRA_RPC_URL as string)
}