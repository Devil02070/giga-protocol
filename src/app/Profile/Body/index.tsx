'use client'
export default function () {
    return (
        <>
            <section className="py-10">
                <div className="container m-auto">
                    <div className="row flex items-center justify-between gap-5">
                        <div className="col bg-cyan-800/30 p-10 w-1/2 rounded-2xl m-auto">
                            <h3 className="text-2xl font-bold">Profile:</h3>
                            <h5 className="mt-4">0x34...345</h5>
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
                        {/* <div className="col bg-cyan-800/30 p-10 w-1/2  rounded-2xl text-end">
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
                        </div> */}
                    </div>
                </div>
            </section>
        </>
    )
}