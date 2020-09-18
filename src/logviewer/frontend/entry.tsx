import * as React from 'react';
import { LogEntry, LogSeverities } from './types';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from "@material-ui/core";
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import * as util from "./util";

export const Entry = (props: {entry: LogEntry, key: any}) => {
    const [open, setOpen] = React.useState(false);
    const innerDivId = `key: ${props.key}`;

    return (
        <React.Fragment>
            <TableRow 
                key={props.key} 
                onClick={() => setOpen(!open)} 
                className={open ? "open" : undefined}
            >
                <TableCell style={{width: 40}}>
                    {open ? <ExpandLessIcon></ExpandLessIcon> : <ExpandMoreIcon></ExpandMoreIcon>}
                </TableCell>
                <TableCell>
                    {props.entry.severity}
                </TableCell>
                <TableCell>
                    {format(props.entry.date)}
                </TableCell>
                <TableCell>
                    {props.entry.thread}
                </TableCell>
                <TableCell>
                    {props.entry.source}
                </TableCell>
            </TableRow>
            {open ? 
                <>
                    <TableRow>
                        <TableCell>
                            {props.entry.body.message}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            {format(props.entry.body.object)}
                        </TableCell>
                    </TableRow>

                </> : ""
            }
        </React.Fragment>
    ) 
}
        

export const LoadingEntry = (props: {key: any}) =>
    <div key={props.key}>
        . . . . . . . . . .
    </div>
/*
export const Header = () => 
    <TableHead>
        <TableRow>
            <TableCell style={{width: 40}}></TableCell>
            <TableCell> Severity </TableCell>
            <TableCell> Date </TableCell>
            <TableCell> Thread </TableCell>
            <TableCell> Source </TableCell>
        </TableRow>
    </TableHead>
*/
/*
const expandableObject = (header: any, object: any) => {
    const keys = Object.keys(object);
    if (keys.length === 0 || typeof object !== "object" || object instanceof Date) {
        return <KeyValueRow header={header} object={object} />
    }
    if (keys.length === 1) {
        return <KeyValueRow header={keys[0]} object={object[keys[0]]} />
    }
    return (
        <Expandable 
            header={header} 
            elements={keys.map(
                key => expandableObject(key, object[key])
            )}
            key={JSON.stringify(name) + JSON.stringify(object)}
        />
    )
}

    
const Expandable = ({header, elements, key}) => {
    
}


const KeyValueRow = ({header, object}) => {
    console.log(object);

    return (
        <Container>
        <Row>
            <Col sm={4}> {format(header)} </Col>
            <Col sm={8}> {format(object)} </Col>
        </Row>
    </Container>

    )
}
*/
const format = (object: any) => {
    if (isEmptyObject(object))
        return "(empty)"

    if (object instanceof Date) 
        return util.before(object.toString(), " GMT")

    return object.toString()
}

const isEmptyObject = (object: any) =>
    Object.keys(object).length === 0 && !(object instanceof Date)