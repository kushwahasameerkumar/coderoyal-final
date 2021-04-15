const Row = (props) => {
    const time = new Date(props.created_at);
    return (
        <tr>
            <td>{props.submissionId}</td>
            <td>{time.toLocaleDateString() + " " + time.toLocaleTimeString()}</td>
            <td>{props.verdict}</td>
            <td>{props.language}</td>
        </tr>
    )
}

export const SubmissionTable = (props) => {
    // submissions.sort((a, b) => {
    //     return a.created_at - b.created_at;
    // })
    return (
        <table className="table">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Time</th>
                    <th scope="col">Verdict</th>
                    <th scope="col">Lang</th>
                </tr>
            </thead>
            <tbody>
                {props.submissions.map((submission, i) => {
                    return <Row {...submission} key={ i }/>
                })}
            </tbody>
        </table>
    )
}