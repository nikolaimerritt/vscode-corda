import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { WindowMessage, MessageType, LogEntry } from './types';
import { EntriesDisplay } from "./entriesDisplay";
import { EntriesLoader } from './entriesLoader';

window.addEventListener("message", event => {
    const message = event.data as WindowMessage;
    switch (message.messageType) {
        case MessageType.NEW_LOG_ENTRIES:
            ReactDOM.render( 
                <div style={{height: 600}}>
                    <EntriesLoader 
                        filepath={message.filepath} 
                        amountOfEntries={600} 
                        filterBy={(entry: LogEntry) => true}
                    />
                </div>,
                document.getElementById('root')
            );
            break;
    }
});