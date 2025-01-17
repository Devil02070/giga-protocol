'use client'
import Squares from "../Banner";
import SpotlightCard from "@/components/design/SpotlightCard";
import { singleAsset, liquidityPools, earningPools } from "@/utils/constants";


export default function Body() {
    return (
        <>
            <Squares speed={0.5} squareSize={40} direction='up' borderColor='#ffffff10' hoverFillColor='#000' />

            <section className="bg-cyan-800/20">
                <div className="container m-auto py-24">
                    <h2 className="text-center text-5xl font-bold">Earn With Giga Protocol</h2>
                    <div className="w-1/2 m-auto mt-4 pt-[1px] bg-zinc-600"></div>
                    <h2 className="text-4xl mt-6 font-bold">Single Asset</h2>
                    <div className="row flex items-center gap-6 mt-6">
                        {
                            singleAsset.map((item, _i) => {
                                return (
                                    <SpotlightCard key={_i} className="custom-spotlight-card w-[25%]" spotlightColor="rgba(0, 229, 255, 0.2)">
                                        {/* <p className="text-2xl">{item.id}.</p> */}
                                        <h2 className="text-2xl font-bold">{item.title}</h2>
                                        <p className="pt-4 text-zinc-500">{item.description}</p>
                                    </SpotlightCard>
                                )
                            })
                        }
                    </div>

                    <h2 className="text-4xl mt-10 font-bold">Liquidity Pools</h2>
                    <div className="row flex items-center gap-6 mt-6">
                        {
                            liquidityPools.map((item, _i) => {
                                return (
                                    <SpotlightCard key={_i} className="custom-spotlight-card w-[25%] p-10" spotlightColor="rgba(0, 229, 255, 0.2)">
                                        {/* <p className="text-2xl">{item.id}.</p> */}
                                        <h2 className="text-2xl font-bold">{item.title}</h2>
                                        <p className="pt-4 text-zinc-500">{item.description}</p>
                                    </SpotlightCard>
                                )
                            })
                        }
                    </div>

                    <h2 className="text-4xl mt-10 font-bold">Earning Pools</h2>
                    <div className="row flex items-center gap-6 mt-6">
                        {
                            earningPools.map((item, _i) => {
                                return (
                                    <SpotlightCard key={_i} className="custom-spotlight-card w-[25%]" spotlightColor="rgba(0, 229, 255, 0.2)">
                                        {/* <p className="text-2xl">{item.id}.</p> */}
                                        <h2 className="text-2xl font-bold">{item.title}</h2>
                                        <p className="pt-4 text-zinc-500">{item.description}</p>
                                    </SpotlightCard>
                                )
                            })
                        }
                    </div>

                    
                </div>
            </section>

            {/* <section className="py-24">
                <div className="container m-auto">
                    
                </div>
            </section> */}
        </>
    )
}