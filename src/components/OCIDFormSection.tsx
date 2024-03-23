import { FC, createElement } from "preact/compat";
import { testData } from "../testdata/getocids";

interface Props {
    item: {
        game: {
            name: string;
            id: number;
        };
        results: {
            id: number;
            name: string;
            dist: number;
        }[];
    },
    index: number;
}

export const OCIDFormSection:FC<Props> = (props) => {
    const {game, results} = props.item;
    const almostCertain = (results[0].dist == 0)

    return (
        <div class={`ocid-form-section ${props.index % 2 == 0 ? " even" : " odd"}`}>
            <button>Apply</button>
            <div class="subsection">
                <p>{game.name}</p>
                {createElement('input',{type: 'checkbox', class: "checkbox", defaultChecked: almostCertain})}
                <select>
                    {results.map((result) => <option value={result.name}>{result.name}</option>)}
                </select>
            </div>
        </div>
    )

}

export default OCIDFormSection;