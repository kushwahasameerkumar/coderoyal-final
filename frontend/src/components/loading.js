import { Fragment } from "react"

export const LoadingText = () => {
    return (
        <Fragment>
            <i className="fa fa-spinner fa-spin"></i>Loading
        </Fragment>
    )
}

export const LoadingIcon = (props) => {
    return (
        <i className="fa fa-spinner fa-spin" {...props}></i>
    )
}