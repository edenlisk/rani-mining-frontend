import React, {useEffect, useState} from 'react';

import { PdfViewerComponent, Toolbar, Magnification, Navigation, LinkAnnotation, BookmarkView,
    ThumbnailView, Print, TextSelection, Annotation, TextSearch, FormFields, FormDesigner, Inject} from '@syncfusion/ej2-react-pdfviewer';
import {useParams} from "react-router-dom";



const PDFViewer = () => {
    const {documentUrl} = useParams();

    // const [documentUrl, setDocumentUrl] = useState("");
    //
    // useEffect(() => {
    //     const documentUrl = localStorage.getItem('documentUrl');
    //     setDocumentUrl(documentUrl);
    // }, [])

    return (
        <div>
            <PdfViewerComponent
                id="container"
                documentPath={decodeURIComponent(documentUrl)}
                resourceUrl="https://ej2services.syncfusion.com/production/web-services/api/pdfviewer"
                serviceUrl="https://services.syncfusion.com/react/production/api/pdfviewer"
                style={{ 'height': '640px' }}>
                <Inject services={[ Toolbar, Magnification, Navigation, Annotation, LinkAnnotation, BookmarkView,
                    ThumbnailView, Print, TextSelection, TextSearch, FormFields, FormDesigner ]}/>
            </PdfViewerComponent>
        </div>
    )
}

export default PDFViewer;
