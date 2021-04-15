import { Fragment } from "react";
import { Navbar } from "../components/navbar";
import '../res/css/TemplatePage.css';

export const TemplatePage = (props) => {
    return (
        <Fragment>
            <Navbar />
            <main>
                <div className="container-fluid">
                    <div className="row d-flex justify-content-end" style={{ padding: "80px 150px" }}>
                        {/* <!-- Content goes here --> */}  
            </div>
                </div>
            </main>
        </Fragment>
    );
}