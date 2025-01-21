import { errorMessage } from "@/utils/errorMessage";
import { dbConnect, Vault } from "@/utils/mongo";
import { NextRequest, NextResponse } from "next/server";
import { getSupraClient } from "@/utils/getSupraClient";
import { HexString } from "supra-l1-sdk";
dbConnect();
const supraClient = getSupraClient();

const VAULT_CREATED_EVENT = `${process.env.ABI}::lp_vault::VaultCreated`;
const VAULT_UPDATED_EVENT = `${process.env.ABI}::lp_vault::VaultUpdated`;

export async function GET() {
    try {
        const all_vaults = await Vault.find();
        return NextResponse.json({ message: "success", data: all_vaults})
    } catch (error) {
        return NextResponse.json({ message: errorMessage(error) }, { status: 500 })
    }
}
export async function POST(request: NextRequest) {
    try {
        const req = await request.json();
        const hash = req.hash;
        const account = req.account;
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
        const event = events.find((event) => event.type === VAULT_CREATED_EVENT);
        if (!event) {
            throw new Error("Vault event not found")
        }
        const vault = new Vault({
            lp: event.data.lp,
            x: event.data.x,
            y: event.data.y,
            lp_addr: event.data.lp_addr,
            x_addr: event.data.x_addr,
            y_addr: event.data.y_addr,
            lp_decimals: event.data.lp_decimals,
            x_decimals: event.data.x_decimals,
            y_decimals: event.data.y_decimals,
            last_harvest: event.data.last_harvest,
            vault_fee_bps: event.data.vault_fee_bps,
            vault_addr: event.data.vault_addr,
            vp: event.data.vp,
            vp_decimals: event.data.vp_decimals,
        })
        await vault.save();
        return NextResponse.json({ message: "vault created" })

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