import React, {useState} from "react";
import {DocumentEditorContainerComponent, Editor, Toolbar} from "@syncfusion/ej2-react-documenteditor";
import LoadingButton from "./LoadingButton";

DocumentEditorContainerComponent.Inject(Toolbar, Editor);

const ViewDocumentEditor = ({setDocumentEditor, sfdt, documentEditor, onSave, isLoading, onDownload}) => {

    const created = () => {
        if (documentEditor) {
            documentEditor.documentEditor.open(sfdt);
        }
    }


    return (
        <div className='space-y-2'>
            <div>
                <LoadingButton name={"Save"} onClickFunction={onSave} isProcessing={isLoading}/>
                <button className="px-4 py-1 bg-blue-300 rounded-md" type="button" onClick={onDownload}>Download</button>
            </div>
            <DocumentEditorContainerComponent
                id="container"
                ref={(scope) => {
                    setDocumentEditor(scope);
                    created()
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

export default ViewDocumentEditor;