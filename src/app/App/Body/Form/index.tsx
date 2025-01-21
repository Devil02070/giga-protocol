'use client'
import { errorMessage } from '@/utils/errorMessage';
import { LPVault } from '@/utils/mongo';
import { useCallback, useEffect, useState } from 'react'
import { toast } from "sonner"
import { useSupraWallet } from '@/context/SupraWalletProvider';
import { getSupraClient } from '@/utils/getSupraClient';
import { BCS, HexString, TxnBuilderTypes } from 'supra-l1-sdk';
import { SendTransactionParams } from '@/types/starkey';
const supraClient = getSupraClient();
const ABI = process.env.ABI as string;
export default function LiquidityForm({ vault }: { vault: LPVault }) {
    const { address, supraWallet } = useSupraWallet()
    const [activeTab, setActiveTab] = useState(1);
    const [addAmount, setAddAmount] = useState("");
    const [removeAmount, setRemoveAmount] = useState("");
    const [lpBalance, setLpBalance] = useState(0);
    const [vpBalance, setVpBalance] = useState(0);
    // Show modal
    const ShowModal = () => {
        const modal = document.getElementById('my_modal_3') as HTMLDialogElement | null;
        if (modal) {
            modal.showModal();
        }
    }

    const fetchLpBalance = useCallback(async()=>{
        if(!address) return;
        try {
            const moveValue = await supraClient.invokeViewMethod(
                `0x1::coin::balance`,
                [
                    vault.lp_addr
                ],
                [
                    new HexString(address).toString()
                ]
            );
            setLpBalance(moveValue[0] / Math.pow(10, vault.lp_decimals))
        } catch (error) {
            console.log(error)
        }
    },[address])
    const fetchVpBalance = useCallback(async()=>{
        if(!address) return;
        try {
            const moveValue = await supraClient.invokeViewMethod(
                `0x1::primary_fungible_store::balance`,
                [
                    vault.lp_addr
                ],
                [
                    new HexString(address).toString(),
                    vault.vault_addr
                ]
            );
            setVpBalance(moveValue[0] / Math.pow(10, vault.vp_decimals))
        } catch (error) {
            console.log(error)
        }
    },[address])
    useEffect(()=>{
        fetchLpBalance();
        fetchVpBalance();
    },[fetchLpBalance, fetchVpBalance])
    const addLiquidity = async() => {
        try {
            if(!address || !supraWallet){
                throw new Error("Wallet not connected")
            }
            let amount = Number(addAmount);
            if(isNaN(amount)) {
                throw new Error("Invalid amount")
            }
            amount = amount * Math.pow(10, vault.lp_decimals);
            const raw_obj = await supraClient.createSerializedRawTxObject(
                new HexString(address),
                BigInt(0),
                ABI,
                "router",
                "add_liquidity_entry",
                [
                    new TxnBuilderTypes.TypeTagParser(vault.x).parseTypeTag(),
                    new TxnBuilderTypes.TypeTagParser(vault.y).parseTypeTag()
                ],
                [
                    BCS.bcsSerializeUint64(amount),
                ],
            );
            const data = Buffer.from(raw_obj).toString('hex');
            const networkData = await supraWallet.getChainId();
            if (!networkData) throw new Error(`Network data not found`)
            if (Number(networkData.chainId) !== supraClient.chainId.value) {
                throw new Error("Wallet and app must be on same network")
            }
            const params: SendTransactionParams = {
                data: data,
                from: address,
                to: ABI,
                chainId: networkData.chainId,
                value: "",
            };
            const hash = await supraWallet.sendTransaction(params);
            if (!hash) {
                throw new Error("Txn hash not found!! There occured some error")
            }
            await fetch(
                `${process.env.SITE_URL}/api/vault`,
                {
                    method: "PUT",
                    body: JSON.stringify({
                        account: address,
                        hash,
                    })
                }
            );
            toast.success("Lp tokens staked successfully")
        } catch (error) {
            toast.error(errorMessage(error))
        }
    }

    const removeLiquidity = async() => {
        try {
            if(!address || !supraWallet){
                throw new Error("Wallet not connected")
            }
            let amount = Number(removeAmount);
            if(isNaN(amount)) {
                throw new Error("Invalid amount")
            }
            amount = amount * Math.pow(10, vault.lp_decimals);
            const raw_obj = await supraClient.createSerializedRawTxObject(
                new HexString(address),
                BigInt(0),
                ABI,
                "router",
                "remove_liquidity_entry",
                [
                    new TxnBuilderTypes.TypeTagParser(vault.x).parseTypeTag(),
                    new TxnBuilderTypes.TypeTagParser(vault.y).parseTypeTag()
                ],
                [
                    BCS.bcsSerializeUint64(amount),
                ],
            );
            const data = Buffer.from(raw_obj).toString('hex');
            const networkData = await supraWallet.getChainId();
            if (!networkData) throw new Error(`Network data not found`)
            if (Number(networkData.chainId) !== supraClient.chainId.value) {
                throw new Error("Wallet and app must be on same network")
            }
            const params: SendTransactionParams = {
                data: data,
                from: address,
                to: ABI,
                chainId: networkData.chainId,
                value: "",
            };
            const hash = await supraWallet.sendTransaction(params);
            if (!hash) {
                throw new Error("Txn hash not found!! There occured some error")
            }
            await fetch(
                `${process.env.SITE_URL}/api/vault`,
                {
                    method: "PUT",
                    body: JSON.stringify({
                        account: address,
                        hash,
                    })
                }
            );
            toast.success("Lp tokens unstaked successfully")
        } catch (error) {
            toast.error(errorMessage(error))
        }
    }

    return (
        <>
            <button className="border py-2 px-6 rounded-full bg-black border-zinc-400 text-zinc-400 hover:text-white hover:border-white" onClick={ShowModal}>Opt In.</button>
            <dialog id="my_modal_3" className="modal bg-black/50">
                <div className="modal-box bg-zinc-900 p-8 h-fit">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <h2 className="text-center text-2xl">LP Tokens Management</h2>
                    <div className="row flex items-center justify-between mt-6 rounded-full gap-4 bg-zinc-800 p-2">
                        <div className={`col rounded-full bg-cyan-800/30 text-center w-1/2 py-2 px-4 cursor-pointer ${activeTab == 1 ? 'bg-cyan-800/30' : 'bg-zinc-800'} `} onClick={() => setActiveTab(1)}>Add</div>
                        <div className={`col rounded-full bg-cyan-800/30 text-center w-1/2 py-2 px-4 cursor-pointer ${activeTab == 2 ? 'bg-cyan-800/30' : 'bg-zinc-800'} `} onClick={() => setActiveTab(2)}>Remove</div>
                    </div>
                    <div className="row mt-6">
                        {
                            activeTab == 1 &&
                            <div className="add_liq">
                                <div className="form-control">
                                    <label className="label mt-4">
                                        <span className="label-text">{vault.lp} Bal: {lpBalance}</span>
                                    </label>
                                    <input type="string" placeholder="Enter Amount" className="input input-bordered focus:outline-none" value={addAmount} onChange={(e) => setAddAmount(e.target.value)} />
                                    <button className="btn btn-primary w-full mt-10" onClick={()=>addLiquidity()}>Add Lp Tokens to vault</button>
                                </div>
                            </div>
                        }
                        {
                            activeTab == 2 &&
                            <div className="add_liq">
                                <div className="form-control">
                                    <label className="label mt-4">
                                        <span className="label-text">{vault.vp} Bal: {vpBalance}</span>
                                    </label>
                                    <input type="string" placeholder="Enter Amount" className="input input-bordered focus:outline-none" value={removeAmount} onChange={(e) => setRemoveAmount(e.target.value)} />
                                </div>
                                <button className="btn btn-primary w-full mt-10" onClick={()=>removeLiquidity()}>Remove Lp Tokens from vault</button>
                            </div>
                        }
                    </div>
                </div>
            </dialog>
        </>
    )
}