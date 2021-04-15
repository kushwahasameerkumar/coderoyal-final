import { Fragment } from "react"

export const Editor = (props) => {
    return (
        <Fragment>
            <div id="editor">
                { `function foo(params) {
                    return "bar";
                }` }
            </div>
        </Fragment>
    );
}