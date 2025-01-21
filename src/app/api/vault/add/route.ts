import { errorMessage } from "@/utils/errorMessage";
import { NextRequest, NextResponse } from "next/server";
import { getSupraClient } from "@/utils/getSupraClient";
import { HexString, SupraAccount, TxnBuilderTypes } from "supra-l1-sdk";
const supraClient = getSupraClient();

export async function POST(request: NextRequest) {
    try {
        const req = await request.json();
        const { pk, x, y } = req;
        if(!pk || !x || !y){
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
        const txnResponse = await supraClient.sendTxUsingSerializedRawTransaction(
            supraAccount,
            transaction,
            {
                enableWaitForTransaction: true,
                enableTransactionSimulation: true,
            }
        )

        return NextResponse.json({ message: "success", data: { hash: txnResponse.txHash, result: txnResponse.result }})
    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: errorMessage(error) }, { status: 500 })
    }
}
