import { FC, createElement } from "preact/compat";
import { testData } from "../testdata/getocids";

interface Props {
    item: {
        game: string;
        results: {
            id: number;
            name: string;
            dist: number;
        }[];
    }
}

export const OCIDForm:FC<Props> = (props) => {
    const {game, results} = props.item;
    const almostCertain = (results[0].dist == 0)

    return (
        <>
            <p>{game}</p>
            <select>
                {results.map((result) => <option value={result.name}>{result.name}</option>)}
            </select>
            {createElement('input',{type: 'checkbox', defaultChecked: almostCertain})}
        </>
    )

}

export default OCIDForm;