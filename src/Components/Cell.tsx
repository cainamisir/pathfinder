import { useEffect, useState } from "react";
import "./Cell.css";
export default function Cell(props: any) {
    const [cellClass, setCellClass] = useState(props.cellClass);
    useEffect(() => {
        console.log(props.cellClass);
        if (props.isStart === true) setCellClass("start cell");
        else if (props.isEnd === true) setCellClass("end cell");
        else if (props.cellClass === "visited")
            setTimeout(() => setCellClass("visited cell"), props.time * 7);
        else if (props.cellClass === "shortest-path")
            setTimeout(
                () => setCellClass("shortest-path cell"),
                props.time * 100
            );
        else if (props.cellClass === "wall") {
            setCellClass("wall cell");
        }
    }, [props.isStart, props.isEnd, props.cellClass, props.time]);
    return <div className={cellClass}>&nbsp;</div>;
}
