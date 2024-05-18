import { FunctionComponent } from "preact";
import { Signal } from "@preact/signals";

type FiltroColor = {
    colorSignal:Signal<boolean>
}

const FiltroColor: FunctionComponent<FiltroColor> = ({colorSignal}) => {
    return(
        <div className="checkbox-container">
            <input type="checkbox" onChange={(e) => colorSignal.value = e.currentTarget.checked} />
            <label>Color</label>
        </div>
    )
}

export default FiltroColor;