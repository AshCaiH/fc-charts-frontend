import { testData } from "../testdata/getocids";
import OCIDForm from "./OCIDForm";

export const UpdateOCIDs = () => {

    return (
        <form>
            {
                testData.extra.results.map((item) => {
                    return <OCIDForm item={item}/>
                })
            }
        </form>
    )

}

export default UpdateOCIDs;