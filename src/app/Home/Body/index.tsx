'use client'
import Squares from "../Banner";
import ShinyText from "@/components/design/ShinyText";
export default function Body(){
    return(
        <>
        <section className="header py-2 bg-cyan-900" >
            <div className="container m-auto">
                <div className="row flex items-center justify-between">
                    <div className="columns-2">
                        Wavy logo
                    </div>
                    <div className="columns-2">
                        <ShinyText text="Connect Wallet" disabled={false} speed={3} className='custom-class' />
                    </div>
                </div>
            </div>
        </section>
        <Squares speed={0.5} squareSize={40} direction='up' borderColor='#ffffff10' hoverFillColor='#000' />
        </>
    )
}