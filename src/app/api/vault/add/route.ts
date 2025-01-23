import { errorMessage } from "@/utils/errorMessage";
import { NextRequest, NextResponse } from "next/server";
import { getSupraClient } from "@/utils/getSupraClient";
import { HexString, SupraAccount, TxnBuilderTypes } from "supra-l1-sdk";
import { Vault, dbConnect } from "@/utils/mongo";

dbConnect();
const supraClient = getSupraClient();

const VAULT_CREATED_EVENT = `${process.env.ABI}::lp_vault::VaultCreated`;

export async function POST(request: NextRequest) {
    try {
        const req = await request.json();
        const { pk, x, y } = req;
        if (!pk || !x || !y) {
            throw new Error("Incorrect nunber of args")
        }
        let rePk = pk;
        if (rePk.startsWith("0x")) {
            rePk = rePk.slice(2)
        }
        const supraAccount = new SupraAccount(Buffer.from(rePk, "hex"));
        const transaction = await supraClient.createSerializedRawTxObject(
            new HexString(supraAccount.address().toString()),
            (await supraClient.getAccountInfo(supraAccount.address())).sequence_number,
            process.env.ABI as string,
            "router",
            "create_vault_entry",
            [
                new TxnBuilderTypes.TypeTagParser(x).parseTypeTag(),
                new TxnBuilderTypes.TypeTagParser(y).parseTypeTag()
            ],
            []
        );
        const txn = await supraClient.sendTxUsingSerializedRawTransaction(
            supraAccount,
            transaction,
            {
                enableWaitForTransaction: true,
                enableTransactionSimulation: true,
            }
        )

        const txnResponse = await supraClient.getTransactionDetail(
            supraAccount.address(),
            txn.txHash
        );

        if (!txnResponse) {
            throw new Error("Txn not found by hash")
        }
        // const events: any[] = txnResponse.events;
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

        return NextResponse.json({ message: "success", data: { hash: txn.txHash, result: txn.result } })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: errorMessage(error) }, { status: 500 })
    }
}
