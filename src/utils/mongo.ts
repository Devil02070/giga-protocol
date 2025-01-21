import { connect, Schema, model, models } from "mongoose"

export async function dbConnect() {
    connect(process.env.MONGO_URL as string).then(()=>console.log("connection has been established with db"))
}

export type LPVault = {
    lp: string,
    x: string,
    y: string,
    lp_addr: string,
    x_addr: string,
    y_addr: string,
    lp_decimals: number,
    x_decimals: number,
    y_decimals: number,
    amount_lp: number,
    amount_x: number,
    amount_y: number,
    last_harvest: number,
    vault_fee_bps: number,
    vault_addr: string,
    vp: string,
    vp_decimals: number
}

const LPVaultSchema = new Schema<LPVault>({
    lp: {
        type: String,
        required: true
    },
    x: {
        type: String,
        required: true
    },
    y: {
        type: String,
        required: true
    },
    lp_addr: {
        type: String,
        required: true
    },
    x_addr: {
        type: String,
        required: true
    },
    y_addr: {
        type: String,
        required: true
    },
    lp_decimals: {
        type: Number,
        required: true
    },
    x_decimals: {
        type: Number,
        required: true
    },
    y_decimals: {
        type: Number,
        required: true
    },
    amount_lp: {
        type: Number,
        default: 0
    },
    amount_x: {
        type: Number,
        default: 0
    },
    amount_y: {
        type: Number,
        default: 0
    },
    last_harvest: {
        type: Number,
        required: true
    },
    vault_fee_bps: {
        type: Number,
        required: true
    },
    vault_addr: {
        type: String,
        required: true,
    },
    vp: {
        type: String,
        required: true
    },
    vp_decimals: {
        type: Number,
        required: true
    }

});

export const Vault = models.vaults || model<LPVault>("vaults", LPVaultSchema);