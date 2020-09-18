import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { WindowMessage, MessageType, LogEntry } from './types';
import { EntriesDisplay } from "./entriesDisplay";
import  { TableContainer, Table, TableBody, TableRow, TableCell } from "@material-ui/core";
import { EntriesLoader } from './entriesLoader';
import "./transactionStyle.css"

window.addEventListener("message", event => {
    const message = event.data as WindowMessage;
    switch (message.messageType) {
        case MessageType.NEW_LOG_ENTRIES:
            ReactDOM.render( 
                <div style={{height: 600}}>
                    <EntriesDisplay 
                        filepath={message.filepath} 
                        entriesCount={message.entriesCount} 
                    />
                </div>,
                document.getElementById('root')
            );
            break;
    }
});