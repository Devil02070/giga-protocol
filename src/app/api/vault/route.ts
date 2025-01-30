export const maxDuration = 60; // This function can run for a maximum of 5 seconds

import { errorMessage } from "@/utils/errorMessage";
import { dbConnect, Vault } from "@/utils/mongo";
import { NextRequest, NextResponse } from "next/server";
import { getSupraClient } from "@/utils/getSupraClient";
import { HexString } from "supra-l1-sdk";
dbConnect();
const supraClient = getSupraClient();

const VAULT_UPDATED_EVENT = `${process.env.ABI}::lp_vault::VaultUpdated`;

export async function GET() {
    try {
        const all_vaults = await Vault.find();
        return NextResponse.json({ message: "success", data: all_vaults})
    } catch (error) {
        return NextResponse.json({ message: errorMessage(error) }, { status: 500 })
    }
}

export async function PUT(request: NextRequest) {
    try {
        const req = await request.json();
        const { hash, account } = req;
        if (!hash || !account) {
            throw new Error("Txn hash or account not provided")
        }

        const txnResponse = await supraClient.getTransactionDetail(
            new HexString(account),
            hash
        );

        if (!txnResponse) {
            throw new Error("Txn not found by hash")
        }
        const events: any[] = txnResponse.events;
        const event = events.find((event) => event.type === VAULT_UPDATED_EVENT);
        if (!event) {
            throw new Error("Vault event not found")
        }
        const vault = await Vault.findOne({
            vault_addr: event.data.vault_addr
        });
        if(!vault){
            throw new Error("Vault not found by addr")
        }
        await Vault.updateOne({ vault_addr: event.data.vault_addr }, { 
            amount_lp: event.data.amount_lp,
            amount_x: event.data.amount_x,
            amount_y: event.data.amount_y,
            last_harvest: event.data.last_harvest,
        });

        return NextResponse.json({ message: "vault updated" })

    } catch (error) {
        return NextResponse.json({ message: errorMessage(error) }, { status: 500 })
    }
}