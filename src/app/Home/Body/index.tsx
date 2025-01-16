'use client'
import Squares from "../Banner";

export default function Body(){
    return(
        <>
            <Squares speed={0.5} squareSize={40} direction='up' borderColor='#ffffff10' hoverFillColor='#000' />
        </>
    )
}