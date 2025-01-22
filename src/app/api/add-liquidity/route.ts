import { errorMessage } from "@/utils/errorMessage";
import { NextRequest, NextResponse } from "next/server";
import { getSupraClient } from "@/utils/getSupraClient";
import { BCS, HexString, SupraAccount, TxnBuilderTypes } from "supra-l1-sdk";
import { dbConnect } from "@/utils/mongo";

dbConnect();
const supraClient = getSupraClient();

export async function POST(request: NextRequest) {
    try {
        const req = await request.json();
        const { pk, x, y, amount_x, amount_y } = req;
        if (!pk || !x || !y || !amount_x || !amount_y) {
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
            "0x53f58e405ed45a7294d2064cedb3de5c96263ee8d3aa8d4d84f48b3089dfdab9",
            "router",
            "add_liquidity",
            [
                new TxnBuilderTypes.TypeTagParser(x).parseTypeTag(),
                new TxnBuilderTypes.TypeTagParser(y).parseTypeTag()
            ],
            [
                BCS.bcsSerializeUint64(amount_x),
                BCS.bcsSerializeUint64(amount_y),
                BCS.bcsSerializeUint64(0),
                BCS.bcsSerializeUint64(0),
            ]
        );
        const txn = await supraClient.sendTxUsingSerializedRawTransaction(
            supraAccount,
            transaction,
            {
                enableWaitForTransaction: true,
                enableTransactionSimulation: true,
            }
        )

        return NextResponse.json({ message: "success", data: { hash: txn.txHash, result: txn.result } })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: errorMessage(error) }, { status: 500 })
    }
}
