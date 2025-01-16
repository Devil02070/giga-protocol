'use client'
import Squares from "../Banner";
import SpotlightCard from "@/components/design/SpotlightCard";

export default function Body() {
    return (
        <>
            <Squares speed={0.5} squareSize={40} direction='up' borderColor='#ffffff10' hoverFillColor='#000' />
            <section className="bg-cyan-800/10">
            <div className="container m-auto py-20">
                <div className="row flex items-center gap-6">
                    <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(0, 229, 255, 0.2)">
                        <i className="fa fa-lock"></i>
                        <h2 className="text-2xl font-bold">Enhanced Security</h2>
                        <p className="pt-4">Our state of the art software offers peace of mind through the strictest security measures. Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus, a?</p>
                    </SpotlightCard>
                    <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(0, 229, 255, 0.2)">
                        <i className="fa fa-lock"></i>
                        <h2 className="text-2xl font-bold">Enhanced Security</h2>
                        <p className="pt-4">Our state of the art software offers peace of mind through the strictest security measures. Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus, a?</p>
                    </SpotlightCard>
                    <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(0, 229, 255, 0.2)">
                        <i className="fa fa-lock"></i>
                        <h2 className="text-2xl font-bold">Enhanced Security</h2>
                        <p className="pt-4">Our state of the art software offers peace of mind through the strictest security measures. Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus, a?</p>
                    </SpotlightCard>
                </div>
                <div className="row flex items-center gap-6 mt-6">
                    <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(0, 229, 255, 0.2)">
                        <i className="fa fa-lock"></i>
                        <h2 className="text-2xl font-bold">Enhanced Security</h2>
                        <p className="pt-4">Our state of the art software offers peace of mind through the strictest security measures. Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus, a?</p>
                    </SpotlightCard>
                    <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(0, 229, 255, 0.2)">
                        <i className="fa fa-lock"></i>
                        <h2 className="text-2xl font-bold">Enhanced Security</h2>
                        <p className="pt-4">Our state of the art software offers peace of mind through the strictest security measures. Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus, a?</p>
                    </SpotlightCard>
                    <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(0, 229, 255, 0.2)">
                        <i className="fa fa-lock"></i>
                        <h2 className="text-2xl font-bold">Enhanced Security</h2>
                        <p className="pt-4">Our state of the art software offers peace of mind through the strictest security measures. Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus, a?</p>
                    </SpotlightCard>
                </div>
            </div>
            </section>
        </>
    )
}