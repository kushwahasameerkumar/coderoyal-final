import { Link } from 'react-router-dom';

export const TableRow = (props) => {
    const date = new Date(props.created_at);
    return (
        <tr>
            <td>{props.id}</td>
            <td>{ date.toLocaleDateString() + " " + date.toLocaleTimeString() }</td>
            <td><Link to={`/matches/join/${props.id}`}><button type="button" className="btn btn-warning">Join</button></Link></td>
        </tr>
    )
};