import * as React from "react";
import { InfiniteLoader, List, IndexRange, ListRowProps, AutoSizer } from "react-virtualized";
import { LogEntry } from "./types";
import * as util from "./util";
import * as request from "./request";
import  { TableContainer, Table, TableBody, TableRow, TableCell } from "@material-ui/core";
import { Entry, LoadingEntry } from "./entry";

export interface entriesLoaderProps {
    filepath: string, 
    entriesCount: number, 
    filterBy: (entry: LogEntry) => boolean
}

export const EntriesLoader = (props: entriesLoaderProps) => {
    const [entries, setEntries] = React.useState(new Array<LogEntry>());

    const isRowLoaded = (index: number) => !!entries[index];

    
    /** `[startIndex, stopIndex)` */
    const loadMoreRows = async ({startIndex, stopIndex}: IndexRange) => {
        setEntries(util.placeAt(
            entries, 
            await request.entriesBetween(startIndex, stopIndex, props.filepath), 
            startIndex
        ));
    }

    const rowRenderer = ({key, index, style}: ListRowProps) => {
        if (isRowLoaded(index)) {
            if (props.filterBy(entries[index])) {
                return <Entry entry={entries[index]} key={key} />
            }
            else
                return <div style={{display: "none"}}> I'm invisible! </div>;
        }
        else
            return <LoadingEntry key={key}/>
    }
        

    return (
        <InfiniteLoader
            isRowLoaded = {({index}) => isRowLoaded(index)}
            loadMoreRows = {loadMoreRows}
            rowCount = {props.entriesCount}
        >
            {({ onRowsRendered, registerChild }) =>
                <List
                    width={500}
                    height={800}
                    onRowsRendered={onRowsRendered}
                    ref={registerChild}
                    rowCount={Math.min(props.entriesCount, 12)}
                    rowRenderer={rowRenderer}
                    rowHeight={30}
                />   
            }
        </InfiniteLoader>
    )
}

/*


*/