import React, {useState} from "react";
import LoadingButton from "./LoadingButton";
import {DocumentEditorContainerComponent, Editor, Toolbar} from "@syncfusion/ej2-react-documenteditor";
import {useSaveFileMutation} from "../states/apislice";

DocumentEditorContainerComponent.Inject(Toolbar, Editor);

const NewDocumentEditorComponent = ({setDocumentEditor}) => {


    return (
        <div className='space-y-2'>
            {/*<button onClick={onClick}>Import from Remote URL</button>*/}
            <DocumentEditorContainerComponent
                id="container"
                ref={(scope) => {
                    setDocumentEditor(scope);
                }}
                height={'590px'}
                serviceUrl="https://ej2services.syncfusion.com/production/web-services/api/documenteditor/"
                enableToolbar={true}
                // created={onCreate}
                // contentChange={onContentChange}
            />
        </div>
    );
}

export default NewDocumentEditorComponent;