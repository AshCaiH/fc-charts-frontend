import { testData } from "../testdata/getocids";
import OCIDFormSection from "./OCIDFormSection";

export const OCIDForm = () => {

    return (
        <form>
            {
                testData.extra.results.map((item) => {
                    return <OCIDFormSection item={item}/>
                })
            }
        </form>
    )

}

export default OCIDForm;