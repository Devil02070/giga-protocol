'use client'

import Image from "next/image"

export default function Body() {
    return (
        <>
            <section className="py-10">
                <div className="container m-auto">
                    <div className="row flex items-center justify-between gap-5">
                        <div className="col bg-cyan-800/30 p-10 w-1/2 rounded-2xl">
                            <h3 className="text-2xl font-bold">Portfolio:</h3>
                            <div className="flex items-center gap-6 mt-5">
                                <div className="box border-r border-zinc-600 text-center pe-5">
                                    <h3 className="text-lg text-zinc-400">Deposited</h3>
                                    <h3 className="text-2xl mt-2">$0</h3>
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
                                    <h3 className="text-2xl mt-2">123</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <section className="py-10 border-t border-zinc-800">

                <div className="container m-auto">
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
                </div>

                <div className="container m-auto mt-10">
                    <div className="row">
                        <table className="table w-full rounded-2xl overflow-hidden">
                            <thead className="text-start bg-cyan-800/30">
                                <tr>
                                    <th className="text-start py-4 px-5">Token</th>
                                    <th className="text-start py-4 px-5">Wallet</th>
                                    <th className="text-start py-4 px-5">Deposited</th>
                                    <th className="text-start py-4 px-5">Apy</th>
                                    <th className="text-start py-4 px-5">Daily</th>
                                    <th className="text-start py-4 px-5">Tvl</th>
                                    <th className="text-start py-4 px-5">Safety</th>
                                </tr>
                            </thead>
                            <tbody className="text-start bg-zinc-900 text-zinc-400">
                                {

                                    Array.from({ length: 10 }).map((_, index) => (
                                        <tr key={index} className="border-t border-zinc-800 hover:bg-cyan-800/10 cursor-pointer overflow-hidden">
                                            <td className="py-3 px-5">
                                                <p className="flex items-center gap-4">
                                                    <p className="relative">
                                                        <Image src="/images/usdc.svg" alt='token-icon' height={40} width={40} />
                                                        <Image src="/images/arb-chain.svg" alt='chain-icon' height={20} width={20} className="absolute bottom-[-8px]" />
                                                    </p>
                                                    <p className="text-white">
                                                        MEOW/USDcC
                                                        <span className="flex items-center gap-2 mt-2">
                                                            <span className="text-[10px] p-1 px-2 rounded bg-zinc-800">Curve</span>
                                                            <span className="text-[10px] p-1 px-2 rounded bg-cyan-400/20">DAO Boost</span>
                                                        </span>
                                                    </p>
                                                </p>

                                            </td>
                                            <td className="py-3 px-5">0</td>
                                            <td className="py-3 px-5">0</td>
                                            <td className="py-3 px-5">18.16%</td>
                                            <td className="py-3 px-5">0.0468%</td>
                                            <td className="py-3 px-5">$1234234</td>
                                            <td className="py-3 px-5">***</td>
                                        </tr>
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