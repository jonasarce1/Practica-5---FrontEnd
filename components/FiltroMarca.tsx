import { FunctionComponent } from "preact";
import { useEffect, useState } from "preact/hooks";
import { Film } from "../types.ts";
import { useSignal, Signal } from "@preact/signals";

type FiltroMarcaProps = {
    brands:string[],
    brandSignal:Signal<string>
}

const FiltroMarca: FunctionComponent<FiltroMarcaProps> = ({brands, brandSignal}) => {
    return(
        <div>
            <select onChange={(e) => brandSignal.value = (e.currentTarget.value)}>
                <option value="any">Cualquier marca</option>
                {brands.map(brand => (
                    <option value={brand}>{brand}</option>
                ))}
            </select>
        </div>
    )
}

export default FiltroMarca;