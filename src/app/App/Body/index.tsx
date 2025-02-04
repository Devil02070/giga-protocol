'use client'

import { useSupraWallet } from "@/context/SupraWalletProvider"
import { LPVault } from "@/utils/mongo"
import { Vault } from "./Vault"
import { useCallback, useEffect, useState } from "react"
export default function Body() {
    const { address, supraWallet } = useSupraWallet();
    const [vaults, setVaults] = useState<Array<LPVault>>([])
    const [bal, setBal] = useState("0")
    const fetchSupraBalance = useCallback(async()=>{
        if(!address || !supraWallet) return;
        try {
            const supraBal = (await supraWallet.balance());
            setBal(supraBal.formattedBalance + supraBal.displayUnit)
        } catch (error) {
            console.log(error)
        }
    },[address, supraWallet])
    const fetchData = async () => {
        const data = await fetch(`${process.env.SITE_URL}/api/vault`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then((response) => response.data)
            .catch((err) => console.error(err));
        return data;
    };
    const getVaults = useCallback(async()=>{
        const data: Array<LPVault> = await fetchData()
        setVaults(data || [])
    },[])
    useEffect(()=>{
        fetchSupraBalance()
        getVaults()
    },[fetchSupraBalance, getVaults])
    return (
        <>
            <section className="py-10">
                <div className="container m-auto">
                    <div className="row flex items-center justify-between gap-5">
                        <div className="col bg-cyan-800/30 p-10 w-1/2 rounded-2xl">
                            <h3 className="text-2xl font-bold">Portfolio:</h3>
                            <h5>{address}</h5>
                            <div className="flex items-center gap-6 mt-5">
                                <div className="box border-r border-zinc-600 text-center pe-5">
                                    <h3 className="text-lg text-zinc-400">Balance</h3>
                                    <h3 className="text-xl mt-2">{bal}</h3>
                                </div>
                                <div className="box border-r border-zinc-600 text-center pe-5">
                                    <h3 className="text-lg text-zinc-400">Monthly yield</h3>
                                    <h3 className="text-2xl mt-2">$0</h3>
                                </div>
                                <div className="box border-r border-zinc-600 text-center pe-5">
                                    <h3 className="text-lg text-zinc-400">Daily yield</h3>
                                    <h3 className="text-2xl mt-2">$0</h3>
                                </div>
                                <div className="box text-center">
                                    <h3 className="text-lg text-zinc-400">Avg. APY</h3>
                                    <h3 className="text-2xl mt-2">$0</h3>
                                </div>
                            </div>
                        </div>
                        <div className="col bg-cyan-800/30 p-10 w-1/2  rounded-2xl text-end">
                            <h3 className="text-2xl font-bold">Platform:</h3>
                            <div className="flex items-center justify-end gap-6 mt-5">
                                <div className="box border-r border-zinc-600 text-center pe-5">
                                    <h3 className="text-lg text-zinc-400 ">TVL</h3>
                                    <h3 className="text-2xl mt-2">$123.00M</h3>
                                </div>
                                <div className="box">
                                    <h3 className="text-lg text-zinc-400">Vaults</h3>
                                    <h3 className="text-2xl mt-2">{vaults.length}</h3>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>


            <section className="py-10 border-t border-zinc-800">

                {/* <div className="container m-auto">
                    <div className="row flex items-center justify-between">
                        <div className="col w-1/2">
                            <input type="text" placeholder="Search" className="bg-transparent border border-zinc-400 focus:outline-none rounded-full py-2 px-4" />
                        </div>
                        <div className="col w-1/2 flex justify-end">
                            <div className="network w-fit text-end relative">
                                <button className="py-2 px-4 rounded bg-zinc-800">Network</button>
                                <ul className="dropdown bg-cyan-900 rounded py-2 absolute right-0 mt-2 w-[200px]">
                                    <li className="flex items-center gap-4 py-2 px-6 hover:bg-zinc-800"><Image src="/images/arb-chain.svg" alt='chain-icon' height={30} width={30} className="" />Arbitrum</li>
                                    <li className="flex items-center gap-4 border-t border-zinc-700 py-2 px-6 hover:bg-zinc-800"><Image src="/images/base-chain.svg" alt='chain-icon' height={30} width={30} className="" />Base</li>
                                    <li className="flex items-center gap-4 border-t border-zinc-700 py-2 px-6 hover:bg-zinc-800"><Image src="/images/arb-chain.svg" alt='chain-icon' height={30} width={30} className="" />Movement</li>
                                    <li className="flex items-center gap-4 border-t border-zinc-700 py-2 px-6 hover:bg-zinc-800"><Image src="/images/arb-chain.svg" alt='chain-icon' height={30} width={30} className="" />Supra</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div> */}

                <div className="container m-auto mt-10">
                    <div className="row">
                        <table className="table w-full rounded-2xl overflow-hidden">
                            <thead className="text-start bg-cyan-800/30">
                                <tr>
                                    <th className="text-start py-4 px-5">Token</th>
                                    <th className="text-start py-4 px-5">Tvl</th>
                                    <th className="text-start py-4 px-5">Last Harvest</th>
                                    <th className="text-start py-4 px-5">Vault Fee</th>
                                    <th className="text-start py-4 px-5">Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-start bg-zinc-900 text-zinc-400">
                                {
                                    vaults.map((data, index) => (
                                        <Vault data={data} key={index} />
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </>
    )
}