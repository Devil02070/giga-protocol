'use client'
import ShinyText from "@/components/design/ShinyText";
import Link from "next/link";
export default function Header() {
    return (
        <section className="header py-4 bg-black border-b border-zinc-900" >
            <div className="container m-auto">
                <div className="row flex items-center justify-between">
                    <div className="columns-2">
                        <Link href="/"><h2 className="text-lg">Giga Protocol</h2></Link>
                    </div>
                    <div className="columns-2 flex justify-end gap-4">
                        <ul className="flex items-center gap-4 text-lg text-zinc-400">
                            <li className="hover:text-white cursor-pointer">Stake</li>
                            <li className="hover:text-white cursor-pointer">Unstake</li>
                            <li className="hover:text-white cursor-pointer">Add Liquidity</li>
                            <li className="hover:text-white cursor-pointer">Lp-Farm</li>
                        </ul>
                        <ShinyText text="Connect Wallet" disabled={false} speed={3} className='border border-zinc-400 p-2 px-6 rounded-full text-lg' />
                    </div>
                </div>
            </div>
        </section>
    )
}