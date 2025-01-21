"use client"

import { LPVault } from "@/utils/mongo"
import LiquidityForm from "./Form"

export function Vault({ data }: { data: LPVault }) {
    return (
        <tr className="border-t border-zinc-800 hover:bg-cyan-800/10 cursor-pointer overflow-hidden">
            <td className="py-3 px-5">
                <p className=" text-white">
                    {data.x}/{data.y}
                    <span className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] p-1 px-2 rounded bg-zinc-800">Evo</span>
                        <span className="text-[10px] p-1 px-2 rounded bg-cyan-400/20">LP Vault</span>
                    </span>
                </p>

            </td>
            <td className="py-3 px-5">{data.amount_lp} {data.lp}</td>
            <td className="py-3 px-5">{new Date(data.last_harvest * 1000).toLocaleString()}</td>
            <td className="py-3 px-5">{data.vault_fee_bps}</td>
            <td className="py-3 px-5">
                <LiquidityForm vault={data}/>
            </td>
        </tr>
    )
}