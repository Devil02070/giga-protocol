'use client'
import Image from 'next/image';
import { useState } from 'react'
import { IoIosArrowDown } from "react-icons/io";
export default function LiquidityForm() {
    const [activeTab, setActiveTab] = useState(1);
    
    const [tokenDropdown, setTokenDropdown] = useState(true);
    const [tokenDropdowntwo, setTokenDropdowntwo] = useState(true);
    const [withdrawTokenDropdown, setwithdrawTokenDropdown] = useState(true);

    const [selectedFirstToken, setSelectedFirstToken] = useState('')
    const [selectedSecondToken, setSelectedSecondToken] = useState('')
    const [selectedWithdrawToken, setselectedWithdrawToken] = useState('')
    
    const selectedTokenOne = (token: string) => {
        setSelectedFirstToken(token)
        setTokenDropdown(!tokenDropdown)
    }
    const selectedTokenSecond = (token: string) => {
        setSelectedSecondToken(token)
        setTokenDropdowntwo(!tokenDropdowntwo)
    }

    const selectedWdToken = (token: string) => {
        setselectedWithdrawToken(token)
        setwithdrawTokenDropdown(!withdrawTokenDropdown)
    }

    // Show modal
    const ShowModal = () => {
        const modal = document.getElementById('my_modal_3') as HTMLDialogElement | null;
        if (modal) {
            modal.showModal();
        }
    }
    return (
        <>
            <button className="border py-2 px-6 rounded-full bg-black border-zinc-400 text-zinc-400 hover:text-white hover:border-white" onClick={ShowModal}>Launch App</button>
            <dialog id="my_modal_3" className="modal bg-black/50">
                <div className="modal-box bg-zinc-900 p-8 h-fit">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <h2 className="text-center text-2xl">Liquidity Management</h2>
                    <div className="row flex items-center justify-between mt-6 rounded-full gap-4 bg-zinc-800 p-2">
                        <div className={`col rounded-full bg-cyan-800/30 text-center w-1/2 py-2 px-4 cursor-pointer ${activeTab == 1 ? 'bg-cyan-800/30' : 'bg-zinc-800'} `} onClick={() => setActiveTab(1)}>Add Liquidity</div>
                        <div className={`col rounded-full bg-cyan-800/30 text-center w-1/2 py-2 px-4 cursor-pointer ${activeTab == 2 ? 'bg-cyan-800/30' : 'bg-zinc-800'} `} onClick={() => setActiveTab(2)}>Remove Liquidity</div>
                    </div>
                    <div className="row mt-6">
                        {
                            activeTab == 1 &&
                            <div className="add_liq">
                                <div className="form-control">
                                    <div className="tokens">

                                        {/* <input type="text" placeholder="Enter Token 1 amount" className="input input-bordered" /> */}
                                        <div className="w-full text-end relative ">
                                            <label className="label"><span className="label-text">Token 1</span></label>
                                            <button className="py-3 px-4 w-full rounded bg-[#1D232A] flex items-center justify-between" onClick={() => setTokenDropdown(!tokenDropdown)}>
                                                <span>{selectedFirstToken == '' ? 'Select First Token' : selectedFirstToken}</span>
                                                <IoIosArrowDown />
                                            </button>

                                            <ul className="bg-cyan-900 rounded py-2 absolute right-0 top-[90px] w-full z-50" hidden={tokenDropdown}>
                                                <li className="flex items-center gap-4 py-2 px-6 hover:bg-cyan-800/80 cursor-pointer" onClick={() => selectedTokenOne('USDT')}>
                                                    <Image src="/images/arb-chain.svg" alt='chain-icon' height={30} width={30} />
                                                    <span>USDT</span>
                                                </li>
                                                <li className="flex items-center gap-4 border-t border-zinc-700 py-2 px-6 hover:bg-cyan-800/80 cursor-pointer" onClick={() => selectedTokenOne('USDC')}>
                                                    <Image src="/images/base-chain.svg" alt='chain-icon' height={30} width={30} />
                                                    <span>USDC</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="w-full text-end relative mt-4">
                                        <label className="label"><span className="label-text">Token 2</span></label>
                                        <button className="py-3 px-4 w-full rounded bg-[#1D232A] flex items-center justify-between" onClick={() => setTokenDropdowntwo(!tokenDropdowntwo)}>
                                        <span>{selectedSecondToken == '' ? 'Select Second Token' : selectedSecondToken}</span>
                                            <IoIosArrowDown />
                                        </button>
                                        <ul className="bg-cyan-900 rounded py-2 absolute right-0 top-[90px] w-full z-50" hidden={tokenDropdowntwo}>
                                            <li className="flex items-center gap-4 py-2 px-6 hover:bg-cyan-800/80 cursor-pointer" onClick={() => selectedTokenSecond('SUPRA')}>
                                                <Image src="/images/arb-chain.svg" alt='chain-icon' height={30} width={30} />
                                                <span>SUPRA</span>
                                            </li>
                                            <li className="flex items-center gap-4 border-t border-zinc-700 py-2 px-6 hover:bg-cyan-800/80 cursor-pointer" onClick={() => selectedTokenSecond('MOVE')}>
                                                <Image src="/images/base-chain.svg" alt='chain-icon' height={30} width={30} />
                                                <span>MOVE</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <label className="label mt-4">
                                        <span className="label-text">Pool Share</span>
                                    </label>
                                    <input type="number" placeholder="Enter Pool Share Percentage" className="input input-bordered focus:outline-none" />
                                </div>
                                <button className="btn btn-primary w-full mt-10">Add Liquidity</button>
                            </div>
                        }
                        {
                            activeTab == 2 &&
                            <div className="remove_liq">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Liquidity Amount</span>
                                    </label>
                                    <input type="number" placeholder="Enter Liquidity to Remove" className="input input-bordered" />

                                    <div className="w-full text-end relative mt-4">
                                        <label className="label"><span className="label-text">Token to Withdraw</span></label>
                                        <button className="py-3 px-4 w-full rounded bg-[#1D232A] flex items-center justify-between" onClick={() => setwithdrawTokenDropdown(!withdrawTokenDropdown)}>
                                        <span>{selectedWithdrawToken == '' ? 'Select Token to Withdraw Token' : selectedWithdrawToken}</span>
                                            <IoIosArrowDown />
                                        </button>
                                        <ul className="bg-cyan-900 rounded py-2 absolute right-0 top-[90px] w-full z-50" hidden={withdrawTokenDropdown}>
                                            <li className="flex items-center gap-4 py-2 px-6 hover:bg-cyan-800/80 cursor-pointer" onClick={() => selectedWdToken('SUPRA')}>
                                                <Image src="/images/arb-chain.svg" alt='chain-icon' height={30} width={30} />
                                                <span>SUPRA</span>
                                            </li>
                                            <li className="flex items-center gap-4 border-t border-zinc-700 py-2 px-6 hover:bg-cyan-800/80 cursor-pointer" onClick={() => selectedWdToken('MOVE')}>
                                                <Image src="/images/base-chain.svg" alt='chain-icon' height={30} width={30} />
                                                <span>MOVE</span>
                                            </li>
                                        </ul>
                                    </div>

                                    {/* <label className="label">
                                        <span className="label-text">Token to Withdraw</span>
                                    </label>
                                    <input type="text" placeholder="Select Token (e.g., USDC)" className="input input-bordered" /> */}
                                </div>
                                <button className="btn btn-primary mt-4 w-full">Remove Liquidity</button>
                            </div>
                        }

                    </div>
                </div>
            </dialog>
        </>
    )
}