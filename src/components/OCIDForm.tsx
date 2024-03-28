import { testData } from "../testdata/getocids";
import OCIDFormSection from "./OCIDFormSection";
import "./OCIDForm.css";

export const OCIDForm = () => {
    const sortedData = testData.extra.results.sort((a, b) => a.results[0].dist - b.results[0].dist)

    return (
        <form>
            {sortedData.map((item, index) => <OCIDFormSection key={item.game.id} index={index} item={item}/>)}
        </form>
    )

}

export default OCIDForm;