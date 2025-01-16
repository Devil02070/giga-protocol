'use client'
import ShinyText from "@/components/design/ShinyText";
export default function Header() {
    return (
        <section className="header py-4 bg-black" >
            <div className="container m-auto">
                <div className="row flex items-center justify-between">
                    <div className="columns-2">
                        <h2 className="text-lg">Giga Protocol</h2>
                    </div>
                    <div className="columns-2 flex justify-end gap-4">
                        <ul className="flex items-center gap-4 text-lg text-zinc-400">
                            <li>Stake</li>
                            <li>Unstake</li>
                            <li>Add Liquidity</li>
                            <li>Lp-Farm</li>
                        </ul>
                        <ShinyText text="Connect Wallet" disabled={false} speed={3} className='border border-zinc-400 p-2 px-6 rounded-full text-lg' />
                    </div>
                </div>
            </div>
        </section>
    )
}