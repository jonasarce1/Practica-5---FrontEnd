import { FunctionComponent } from "preact";
import { useEffect, useState } from "preact/hooks";
import { Film } from "../types.ts";
import { useSignal, Signal } from "@preact/signals";

type FiltroIsoProps = {
    isos:number[],
    isoSignal:Signal<number>
}

const FiltroIso: FunctionComponent<FiltroIsoProps> = ({isos, isoSignal}) => {
    return(
        <div>
            <select onChange={(e) => isoSignal.value = parseInt(e.currentTarget.value)}>
                <option value={0}>Cualquier iso</option>
                {isos.map(iso => (
                    <option value={iso}>{iso}</option>
                ))}
            </select>
        </div>
    )
}

export default FiltroIso;