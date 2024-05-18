import { FunctionComponent } from "preact";
import { Signal } from "@preact/signals";

type FiltroNameProps = {
    nameSignal:Signal<string>
}

const FiltroName: FunctionComponent<FiltroNameProps> = ({nameSignal}) => {
    return(
        <div>
            <input type="text" placeholder="Buscar por nombre" onInput={(e) => nameSignal.value = e.currentTarget.value} value = {nameSignal.value}/>
        </div>
    )
}

export default FiltroName;