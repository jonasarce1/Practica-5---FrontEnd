import { FunctionComponent } from "preact";
import { Signal } from "@preact/signals";

type FiltroFormatProps = {
    formatThirtyFiveSignal:Signal<boolean>,
    formatOneTwentySignal:Signal<boolean>
}

const FiltroFormat: FunctionComponent<FiltroFormatProps> = ({formatThirtyFiveSignal, formatOneTwentySignal}) => {
    return(
        <div className="checkbox-container">
            <input type="checkbox" onChange={(e) => formatThirtyFiveSignal.value = e.currentTarget.checked} />
            <label>35mm</label>
            <input type="checkbox" onChange={(e) => formatOneTwentySignal.value = e.currentTarget.checked} />
            <label>120mm</label>
        </div>
    )
}

export default FiltroFormat;