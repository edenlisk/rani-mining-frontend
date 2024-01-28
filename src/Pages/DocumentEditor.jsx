import React, {useEffect} from 'react';
import {
    DocumentEditorContainerComponent,
    Toolbar, Editor
} from '@syncfusion/ej2-react-documenteditor';
import {useNavigate} from "react-router-dom";
import { useSaveFileMutation } from "../states/apislice";
import {message} from "antd";
import LoadingButton from "./LoadingButton";


DocumentEditorContainerComponent.Inject(Toolbar, Editor);

// const DocumentEditor = () => {
//     let container;
//     let contentChanged = false;
//
//     React.useEffect(() => {
//         onCreate();
//         onContentChange();
//     }, []);
//
//     function onCreate() {
//         setInterval(() => {
//             if (contentChanged) {
//                 // You can save the document as below
//                 container.documentEditor.saveAsBlob('Docx').then((blob) => {
//                     console.log('Saved successfully');
//                     let exportedDocument = blob;
//                     // Now, save the document on your own backend server.
//                     saveToBackend(exportedDocument);
//                 });
//                 contentChanged = false;
//             }
//         }, 1000);
//     }
//
//     function onContentChange() {
//         contentChanged = true;
//     }
//
//     // Function to save the document to your backend server
//     function saveToBackend(documentBlob) {
//         let formData = new FormData();
//         formData.append('fileName', 'sample.docx');
//         formData.append('data', documentBlob);
//         console.log(documentBlob);
//
//         // Replace 'your-backend-endpoint' with the actual endpoint of your backend server
//         // var req = new XMLHttpRequest();
//         // req.open(
//         //     'POST',
//         //     'https://your-backend-endpoint/api/documenteditor/SaveToBackend',
//         //     true
//         // );
//         //
//         // req.onreadystatechange = function () {
//         //     if (req.readyState === 4) {
//         //         if (req.status === 200 || req.status === 304) {
//         //             console.log('Document saved to backend successfully');
//         //         } else {
//         //             console.error('Failed to save document to backend');
//         //         }
//         //     }
//         // };
//         //
//         // req.send(formData);
//     }
//
//     async function onClick() {
//         try {
//             // Replace 'your-backend-endpoint' with the actual endpoint of your backend server
//             const response = await fetch('https://your-backend-endpoint/api/documenteditor/ImportFileURL', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ fileUrl: '' }), // Add your URL inside the quotes
//             });
//
//             if (response.ok) {
//                 const docxContent = await response.blob();
//                 const sfdtContent = await convertDocxToSfdt(docxContent);
//
//                 // Open the SFDT content in Document Editor
//                 container.documentEditor.open(sfdtContent);
//             } else {
//                 console.error('Failed to fetch document:', response.status);
//             }
//         } catch (error) {
//             console.error('Error:', error);
//         }
//     }
//
//     return (
//         <DocumentEditorContainerComponent
//             id="container"
//             ref={(scope) => {
//                 container = scope;
//             }}
//             height={'590px'}
//             serviceUrl="https://ej2services.syncfusion.com/production/web-services/api/documenteditor/"
//             enableToolbar={true}
//             onSave={() => console.log("weeeee")}
//             created={onCreate}
//             contentChange={onContentChange}
//         />
//     );
// }



// DocumentEditorContainerComponent.Inject(Toolbar);

const DocumentEditorComponent = ({sfdt, fileId, filePath, showSave=true}) => {
    let container;
    let contentChanged = false;
    const navigate = useNavigate();

    useEffect(() => {
        // onCreate();
        onContentChange();
    }, []);

    const [saveFile, {isSuccess, isError, isLoading, error}] = useSaveFileMutation();

    useEffect(() => {
        if (isSuccess) {
            return message.success("Saved successfully");
        } else if (isError) {
            const { message: errorMessage } = error.data;
            return message.error(errorMessage);
        }
    }, [isSuccess, isError, error]);



    // function onCreate() {
    //     setInterval(() => {
    //         if (contentChanged) {
    //             // You can save the document as below
    //             container.documentEditor.saveAsBlob('Docx').then((blob) => {
    //                 console.log('Saved successfully');
    //                 let exportedDocument = blob;
    //                 // Now, save the document on your own backend server.
    //                 saveToBackend(exportedDocument);
    //             });
    //             contentChanged = false;
    //         }
    //     }, 1000);
    // }

    const onDownload = () => {
        container.documentEditor.save(
            filePath?.split('/').pop().replace(/\.docx[^_]*\.docx/, '') || "Untitled",
            'Docx'
        );

        // const sfdtContent = container.documentEditor.serialize();
        // console.log(sfdtContent);

        // Now you can use sfdtContent as needed, for example, log it to the console
        // console.log('SFDT Content:', sfdtContent);
    }

    function onContentChange() {
        contentChanged = true;
    }

    const created = () => {
        const data = {
            "sfdt": "UEsDBBQAAAAIAKish1fFJPAbOCkAAA6yAgAEAAAAc2ZkdOx9W4/jSJbeXyG0L5mARqX7Jf2QqGtXbVdVF6pqujDwDIwgGRKjxYsmSKZKORig0ftowIAxa8MLeAG/7YNhe4EdYF/WL/4pM/YY9hqYv+BzgpREUZfkTUlRisbUpETFnSdOnPOdS/ym5sw8ZrF7+mmse7Ubj/u0XnOpVrv5l7+pqeL/tXHtRnxu1Wtj9x7+dhvN39ZrM/HcI+IH17NrN7XXlOiU1+BHJqp65gyevvn86fkbxWI2VVzmUeWOwR+F2LrCmTtViOtS17Wo7Sm1+p7efltfNsbpzOGe8ocff6d8fvnuw9unn18qr777qDz/7t2Hp+/fvPy0v41fYSvR31ikRDsyJ+LWbpriO05jTzWm127azd5gT63leJVvqE05MRVmjx1uEY85dl1xfcsifCEWQXNszfRdeK44Y8UzwgWKzSPWaTAZHnTEZ1wMQOVTUcrQ4XsT/tZuBoNGDz544ruqcxjjb2omfIX/d0Vhcy6GDa8QiuOfWfjdsHFCMB0+SVXcm6UqrqYbzF2q0vA8RWkdVjdNcT9FcSDh2vauSkhE74lFl8Qx444G+8XhT+hX3AqUKxrhfMHsieL43pqAbtbbaU02q33k2zodw5bUDxVK+duvfvsreP1aQI2aY+IawNLwefhhBmvUbvcare5oNOoMR/3usNsZ4nOggTa8W+AlkkzLJVN4qzvfknjzeUmXche4HDA83dc8JNgVsQpOOOdMPOWH6E7w/0MF6gfpHjr3iOa5yhW1CDOfHCo7MxybHipwfXgc4ohzTPpk5sAUkcHPmWcwe98+voLBub7pETgKHY7LZREbz0XXI+Px7XXjUHe7Zh05ulK8rjIYR+yIVdVUh+xLfJWRYe9p5NAkHqxSYMn0r+UF06M7iFONsjuqeJwwG3bME80hGhDWRBlzx1ICgWtJZ8T1bpU3Y2VB3To81JlGQAibG9TeRU/px3YMgkhILCWO8OBZ1w7Oui5w0TaIX/J8O7XzLXgzIS0dkp/bw0a7if8N+u1RZ9TtdaQ0XXVp+gXyv1AkCdTJm7QHqxSjpbaXUYx+kOUE7UiNvdI85oPPQehfsZkECjmzZsS681dFDG2ffLluZn8Z+w8//g2zPTpxCmpwgQ26Piep2ksltS1RxLfM9ZQPhJMJJzOjVpIw144BF/1es9EFQaDd7ba6zb6U606R4W69JMlvLwMhfcqpsnB8ZeyYpjMHTfhn/kwJNGXHAtuCLoB3V7HAQKF4zpopUwTggfXai0B3JkJhDn4TarPrHAaUdOpqnKnQqnEQK9oaCqJD8FmcEes+U2M8qx+/kKnP2ZRxmAstiOszm1hJOP6TJG3hKvu8qANJJZwV1pRB5kUtma/6rgEGtQRFb5O0956p6c7c/WUKXLEkEkNhoge58ydFvR6QHjy3sMbYhBlFNTYnKgEBK8krSrS/b/eXSQ6hpSkpZajzlaHw3YJKavumWRdH3vKzp5qhKuuPvaAbZoftom9A80Hpedsq3VyOtbdvrEJSqP2FQOaar17VNqzUmaqvrdaZqq+t2Jmqr0gmU+0VCWWqfWSSQusHPpgFxGAEJQSf2vBvSM6H0liG3qy9LuLmob32G6KCHT1pYSFJCt+WUIwsxm9DgkBn5raxk0R20FORxtfYzsrtu9FBqwnwjVa73Rw0Oy2JgZzi+b39lrZ8NxKx3CWxvGUatQHKtH1LBee+Q+opQ082XTh2LGZUaLjMdX1ia1SougcJv5qmXrk1Kr41pD3mIo5iwbzwME5wBgs3ZffwKS0ZzUphkm6+Wc7g1IQriHIJWpfqo5cBCZLn5cWcl51uowkuD6Nhd9BttVvNUVe6M1T9+PwC3qLKnLhClTVXxqqlKzcY0YRNjbnL4/VW+WIwzQiZlg7uq2idC6xqB4/eo3qTnq7Dq8TZLygUSPoqnCczjdvZHsJVgI0eYhPoFyD8/d3DjmPg5sXvGJ0DFz7oqAC2xY2Qm0OFhXOC8GyYIXb+BMNYlhEFSVDMzF4MYOpNZO4GkD6JUdWao/G4SI+IQi2+6FCXbL6Pb9rWCjPgg13bYPb9IRcLeQrLgNzTOYWltVtau49r7d4vKPRT2rz7B23eIECEOtjVzKQEzDhjZmIyAvCU5AoloKIRXRfBqcSMpGeg+vXDFvCxHUQpbBcLHLlfOY5nO9DkRzqmnIIVqLYxiUB2CqYSq/GZfvXint+/9HGfroa1t4+N0yniSPfsRkzaWRti6wqBxQjWBxNQwCqAEOUEYo7uwz9msgk2qpgorbmG45u6oq4WKZmyiaddJ8HpubvMt3GfsD1NLd1YE5RlVuws3l0s4vi6v1DcQXR3KVytgtZjQWKCSY6mnJi8lL0pMnGsmKNm9sYmPgiG8wOtiSMKnbCQC41xH3xaWKpj1qR/yTkokkFKGlEug6uJ4OJXANYFwY1rjraip13tR3QmdFVJWBbZ4vXNA6UjB1n6mT3zPcKdpOMRZ4Qa4frfEpXek8zVE9Z7zGKJsqwMh43haB14CBC8DEI/NdVj6yVt2Qgj7x8+ijwSabbOc0ffYApuYq6wu7cELOKhigG/yFIzTXe7GU6WJfz4ZdjptvvDTJPd4iYfv7zpDnrFtJWlkROsk8hY3G+hR7PkYKfGwcSLkS5UFZc2UbvoR/Igwkd4XvvMLDgx3tO58tGxiF1bb+GwDH7eVWoM2MfO52O65wd7zy9JLSmOFqAdGwKwDkcNZ5pXV1yqeQ6vKxo1zeMfPqtKT41EALoYbRLLgwH4BqeJLBmPN8kX4SrfPOx1vhWAsQPrAFHfnrAUHuw5StSVT4Iwihn6O4BpgIwfaeTPgZQrM+784pgMLqy8xVw6PVwmVtU/mH8rSIyTEBdJiuJsO2g9CiyTGOSKmngkllPxTXEULGd706Bw/PCmOYqId3A7SfjgIC3JKAkJH5wPryvIWPXNh09grXa4zmwQBdw1J9tAIjJKAWUam5S3gEN4vk5vlE631x80crSEenDQVLff7nS7w0ZZNrDIrLrdXjFz6nW72RuS1jZ52BxBQtvmPlksRl/CKJmP754pBHyHPGXGqQt/10nYQ08s10NFyGDuE0D2FBsz7x/ghMlFu8R1t1hlAOxGUd7MITEPNrh3O59UnUaKSsdfziwSd5aleRzbKmwH28kyw3VynhSV1ttuRjU2XmRp45QN13uy52I+LlHMZCastkgRhU0M6zXbxQ+95qjbGw3wgpdDIX8gpy2D/tRMa7eRHzNNvRUjvTmfhfTIZILBOCS4rwlNQI80u23f4gIheWm4P3kVThruL91NFA7C8DqqIKovvIMQb8XalawM/cUCARa0wDv4jXpLtrW60rFoAH9XEGDSlhMVZ/cAPRy1B5GAf0cIXaGd7IurK7QTf74jb3Cx0zDIBM5ZzrZ9Gx7oZ6fvxOE6c+jNJfZ2gubi0KRcEFRJxiuZvLfi2KwMZ5TJex8zeW/iq5I3+N0Q2xf9N5qDUavf7/eag0EbVKcBPsd4wgPRjPA/k95RE+UUEFfYHYgx4DIYF0d2RC7KxLtnLPEm9qTodhq9HhgTOs1ea9AbyKuHT+qNwyPRfHj12URkKn/x8uXTV/0gU7mA8ZvtRh9h/P6oO2x32+0tGD9673sqODLCaFQACkWAjDOHf6pL+V1wa0uMtTwgnkbgnSQVk9Bwa9jZnL+Mi6geDbebjdbRaVhcZ/SANl8UVbbbHXmre/XJciCjec5URDrkWrhOMauzyYRyV7myqF1X5g78eTC4O713ruWrhB8Xs8K7lDR/6t+nBa6uUiJXKiBXakqQL5ZWI1EnTtoFu04Ib0mp+Sxwn4fF4vR84cTd7aWsfB6U+6AwnJ5yT5YipZxcDZKUgvBlC8LgrmNsCcInIQerJOLInaiK6tynNXVLKVhix9XiAMeTgkuRJaAYuiD+q2+cZ0SbQll1GpjGdj5vSWm4+rFVUhrudqRB7iRJUkrDly0Ne5zYrkgaeJIicUpoGBwzicqmgKhKdFiiw5chVZyLXCxR33OhSIn6guIGzjt3gWelqnNXrGK6K9D4JFVxmY1Eyrnnc7YVL+dSYrm3yvpBcP2auEQFf7tV3tg60zBqX0ROhVUUi2IFEI2/Lj0o6srXJYaMH6MC9HUVZWYCPmUus/WUQPJtyn5+/kiuIROWMPwnc3zZY6zWm2OHl6kEtKTUtoOv6d1bsrjq4L5K21FqS0iWTnDRaNplq0t/nYu6/PUYGlnsICvwVpaT0f5yjDh+qrurY/3m3NZpb/aaCswsqdizlK7Od4ZRobHgpjHk/3wXLpTBJZJ0GSfpEZCklCdp2Z6w8lSUp+IlnooidU31plrxU1H6MFfjWJReG5eIZr9wMOZ3objgoOGJC7V8l4IYYwHPJHwBjht8CmxgnYzWcOaKhZHByEzxizP2qJ2QqaSFLJ+RHxbHzbsVwG+ucdxeBMqX2n0k7Ux0YsBL275FrNh38t5Rj7xYR04ftqCTI0dgqsSekEj60mPMYgr777jrxGzXiN8lX3Qf95j2LsNi3cpwVQl/V9IhqWr6RRVHLEN9JVR3WhRZvT1UvRFLKOJctr2EIi4Rinj5a5/NLLwBByAI/UEru8xEcx67XcYaSMfu06JIGWsgSfJERSI89ODl2L5pQkvU1ZafPdUMrHDEH2OIP942ZIdteUHMCBrj+r1mo9tsNtvdbqvb7Ld763Sw2yElzeX4evvGJw7+2l9Ag/BfkBlyHWKSqfo65CRT9bVXaKbqq7M0U+3V2ZqpdtVSs28LcPtSr8+4o/uaeFxk6vVOu9HpgiPPsDvottqt5qgLj8OMpTI86nTVgX23hiVNy94a9TY9uGRK68rlDoZXuJFZv7XlhbeVYTrhZXzhZREJbocA8jKp5lE9SH2NPCni75Kw/2Roc6/biB61MoizImTaGi3PyMclzXy52PNQal8mZj8Dqh00OpGrqzvDMkk4pF4w9LuKw+GrM6NcUHDwaG4DYWsO14/EezuDxhClbHmJS3UJuj9odLsbPvtCRzikHQS9SHWgsupAKs7zYa1iYpieThZBuN5iJsLuhWxHzF0mhT2s5bC/9EOVfMt3Cff5IT+z5B2nrzv1S+rY8m2XlTZpXlbXaoldz51pMWSWqlPMimYR1T94BWueY1sq+acthxasxR/2H0kqEG77ihy/pgQAqmx+zqnhnznZSjSgEiRcnLp/5vQssYAKkLNU9qvr0/Uoyv7rZdShoofRixjHvlTy3Vvli8E0Q4AAmJIBMMg5pdN1yNCxtaP3LJca+2Dw2FEV+PnhpGfH7DuzQhmJZfzWzzOCBStv4Vl5yAmC80xb+Nac8gzI0e5ggURbXZr9z4XzS0Rg136Qgrd0gDjpDXsu+IdyhtqqRF8qcOJJ9EUeeRJrqqi4KrGmCmscj4I1fd70IHHFB30Zx4AhDDeP51Wybevv5MAI0tVV57vgmUfs38es/3xO8vRvgZ+G8mbhbMaeJG5IOi5ImOJkNSDpuHBRKbF2K+65VfbHJVWpKF8SwT7opnCZ1CudEipAvNIpobr851EUxRcOdaMhe6sopyfL8D2D3FEswbgIeopExYfxT7dKJrXwpUvzGH/D4ZVme2YqmzJeos8BaJVlhUssiggUuX1Ui/3WPoAN59kwjLfM9ZQPhJMJJzMDxmQyUc9kpu2Icia22a/XwNEBG++32u3BqP/b2Eb6BXVvcJuIHXLHdKoQ2E6zhXI1Y5rnc3q99OqZEejRcmzPcJUrgtc72PTrtUhMjkRtUk/sN4WoDuw8OH59y25k9OhRSyPQ8iJLDl4XecyePXSBKqlvNna8suYNrHCCG4jkc8G6ylHZnoIvEHClCeV0mmcU10fjSp3msF0GV1JUP0B9w+MavAo5VWzHU8gdYSZRTXqj0K8zkzBbmRuLbKzmF4ez0+9ejYzkF6sLrGZaVt+2RwDdLqnze2akZLOxBg5eEPBQ5Ts/HbMrcOIMRD/rzs/Rwm36uqcsfLx36tGkBeBgDPset3hMeA9ZwHq/MyGSLBRmg1+yDvWYPVFcJxMLsC9R2nAOXvTyUO26QvNpQSrQjkcnfmmKyNQHPejw9dkPKgJ5+v/kqMTONP0s+1kkJ2wN8beUW/soGOCx0D+5MI/oMN6NAasHcl3KBFynAqxuvSSZ2kUCq5vAKtOVheODSGYjXgpoEEZ7oXjlUTgZdHDpwM+hN45yx+CP4jkKcV3qulGYFSQ13wUd22TeYn2hHeBEBGSHpSCHV9ohgjQ3Qh8fTl3f9ABd4nTn/ejJhYLHw3TnMFg1VyRVnt79ghKSZJDiqhy8lqf3EgFKlRnlSc122ZmW5gAu2zljFqv53stTFR+4wPFhXTFHZTezmlQMa1V9Xhosb2OYaHlWgQK2WhblVioaZ+F+JBWNCr/CR1U0iKah4hBPvyyy1ep05nh4G7atMw0AwxD3BTuQMAYhZOyDKWMyofo6ZAC0CmwsqBvgy3dojMbyq2IiV2Vj3bDQP4RSYouEuqG5aQIeJbaiLjZQak7BbKgv1aAgSbQmwha2BtPIBtMk5Zcpl/xLuXqKKjDXPL2rc1Ky782t8hoksepqLvlP9Vxz18k4HgryqPb+Bcnt7HAFW9y9ziXV4hXcdpli5Y7QpkfUYOckl1AbMfSnr/x9SutvseQXqjOlrTxS/31pm780VaZUjnsCPI8Xw/Ma5Xo+VsgUuQv8SCMpVWJqmdD5Skwto9SelsKlcfUCMA95hWRkpQSuIK+QTEZSyED2XCEZv8RxeRS3BVNJfMGkrCaX5EyoJN1dqSuscHVtlnBmcP3ZzGQA34E/QwDtOYhNOvwJIIMO9yjfeYHqSm54cvjnePBTdNIiKcZOmf9QqcjFM/kbi2lJ+RtcEHDw9MF55Id5kc3apMDGtiDBtE0mvj8X3C9HeHtHc9Bvjzqjbq8jL8w6WWNHsRf2JYlLHzYbI6SOVq/dGw6GI+k9Wbl78+Kv8JGugfw+MG5Fs2ZdgQ1sOrlOcKDturcNjGZwWooKJsZ8xrheGqwZGsxeOww2zdFA6qq7dmo/tlOBieNN89K5uWLbU7y3BP7O7U6jhdu42Rm2uv3RoD2QB/VpvGQAsbEkQV7bbfQjl9K34Lyc7H+OYQhFnPOHGfE7ZFdlc6v2VlrjbmMUvcxVcq7KCRZb7zCvZHGYjjXiojrMo1arIjNtD0eN5sY9hglIsrlcy0EvBbjIJ1v101T3Zvm6X6fIy1a/4nj41ns+Mtk6Jpi3j0Ox6ZWzTAS3g15TEYwk2HwEW7ACd5he54455sQ6Gpc9SLPtY9JsTpLNyWIvhMOu5YZSqDd78t0TZ7iSeB9LPNiiV6maV5YbFa+aF8Sn/tI3F6nceXKr1DuP1kSLvuZGiYqvj85ExS8nYXchKnWUVuBB7SlnxKzFCGc8xs/r38bw/iPfxnTjqx35nhblb+4k4mMMTOrwUodPpMOXRJ6HXTvPpcsTl5IlLPGIONp+xU5uwcvdglJRPTGUJXl0yrkcUvJclJuyOuhRM9D4RqPhsDkYNQf4a6gkSn39QsGj3e7iT/2JD0p4+bBRubJCu58OV8rU3VngTCeEKknQSDp+lLgnJGh0WfK4VAEkNFYip5HQ2KXsesloJNZwCjK+BAAvjg9I1iNZz8kIOBLmrCpcdHIw5yc686ilRtJaSKRTIp0S6ZTucTLETSKdJy0fX0aXJ+6BJJ0AJdJ57lvwMro8cUYj3RcktHkBu/AyupS85gJdpSSWeV4hlieHZX6neY5EMqXPpvTZLPgklsm6LuNwThjoC2XOWjqVXV6m2C+xTIllSkZzDuz0xBmNxDIllimFmjMR3SSvkVim9MuUWGaxWOZ75066ZcoAdBmALrMWZgQo5M0DCcFMCSxWXgaXYr/EMk/JqUEmZzzTXS8ZjcQyZch52VtCdimxzIfUH5nCTvplXubVFyfnl/mCahLLlNebydya8kIWeUelzK0plYDTVnVO3KFBemlKZFOiDeeAqZw4o5GX68jcmhJ1PE84V7IeeXv6vnh0PJTgMLF90wTMgrra8rOnmuHNQv7YC9A4ZocHixecRnhk9YatRhfabHe7rW6z3+6tzyx5WEWQ1UwH7QppzVT7yMgr8iN8MAuIwQhKCAYX8DVVtIQcbA9kKjK7HqHsksN+MInvMpWZzFtfiR2pvebFCrF1hTN3+mAxYi5c5u4sJobIg/4P3MrVazfa4laudmfQ7Dd78ErlrVzlmxJ22gIMTVROZRJIcLf1F+IqDleYq3gGVTTHmVFOPHZH8anFbGZP4Kk1I/ZCMZnrUV1xbFH2hQ//gKAn1Nao+E3R4ZHnCOpVnLEy447uax6DCrMI/d8qb8bKgrp1xWVYdW5Q+zbFhV/rPZCl0kuXruslXdR19XAtWI4m8nRPeFk9T/3SugbaYh4tqfMFydMx7gh9tUlyLb8KG7OkNWDWzLdhCpOyXsLUL6ljy3cJ97mTo4nbPP2/Zyq5OFazoJM8C17P07dd1qT5It+C36avGxFkixYrDt/B/MBUHqtOhFBS1DrlqSWBV/q95j41eS+0m0jIXUO5iYqvHcUSFb8cPyJt10tKcPmI1OZO8oXm9+xKwG/fBPqbSe+oGVO9HNWl/A70NuKJMihLByAD1Ryuww+hcmZSRSXuWsGzfbyfBFsDPZByFxqlLrVRzeOoFmKZOxTNb5WXX6ENZoMqt2ikYldHO4Byqnn+hHKQt0HR+6EsmdcvQPbM0/+cqI69oGUJYkQlmj/178uSx+w//Pg3AFjkE4ItP9cQFrBN2bQsAoDJE8PPpXSehlAqpSIpFUmM+2KlIo7izgJgOFfjFMBbbaGo1JtTGog5EVEpEJ9WQlAg9sA5oHjU9Zjl2AxR61illRilLsRPWGsFmaOctXB8HkphJJDIxqIggfp3zIM2sTMUy9bIOLR/x3TRjgUil9uoCj5ulAcbgbRgL+C8gmOzpBEYZAJvuCzUTAgsixLFxTmb0xKlNaLmFhhzSaysCHntnlTYOgXImOeWRgJlEj8DXYnmUpbKtM2Js+dERPWLbVIitxK5lX44Ukd5QEfxDMBxQaVQDAJOOjOfa4bQV3ZpGu4G5nsFAK1HueXGAGKh9dS34N66Qj2tcS11kkJ0kstUSUrVRyb+vZRFKymLKlcl201y6YEwAJXwskhvjpqwld92Ui/AeALacI5GrhvSc6pCnlMTVp5/olbaMePf+ZM8014Du1Ltlmr3AYuJdJiSDlOX4QFXrmlQBMO4Phjlogq4t5jRlWpMzE3FGlXvnYVcfzYzGSjnnhPo5kuz4NUYuqFfiTUzaX3dUKCUQ9cW+wq1NOLiYw7/fuYR2yMmFlJ9b7MxxzYXaIWk7I66T5aIgButXsdprZqI6PT03By3DCINkCUaIEHzUP3S7CCBy1hpYujFmr9UMgWHSQs0/1yvXkbKVEnfcx2V2Pk22xkrP9KaV3EpVMZhSLUig1oxFra5seODTrCpWqCfH1rg0PNPdcB292tQMoSVDtz9TAoiu0LcaRiGH0j2UDEIuQgi8omrzKlp4l8s9fHdM9A2xkwDq90VG+8Nz7hWAm0DJH07MAs2lA+hfyEUYlwZU6qD7DQVmgxoDdSFngyKCtLS/Iil9Y1GFMC416Ejj+egWGJI7EU7N07Bww8U2/IkXIP+4HO/LHFHJfdlrbyPRlwOtFeaYnXRfoX+PNeLRzZ9lU+xKy0FQE6Gd53LqKOyUMXIl30hzxi+z2fcqahNSwXXCddX84U+5mO2/+P3JZI9HHPENRzVmUrlVurL0gyXV1/Om9jxQMYKmdjxUhM7Zs3E+BGT01nMY+gX6dh1Eb+HQXZ6oNbWQfu2NRO0Wsc+nIJRpl6UtuebTnPYTp1zEV24ET1BbEVlkwngQAoYbU0TU6y5ypho63DSWErGJTQ0Z54BpAt6obAuh5ka1yGlEVtKCslnbRXPVF2EvuroTu7MMGwV4SFAvByFWQghRf3YM8FF4MEOYBoiZbvyk9RX3eCvWTqgv/aZGHiWyteZpgSI2xN4rWS1VETXAccT7wHmuaaKLK1nJIJxolqC8iMzEf4EWWoG4GemPlGY4EzNVPkm02AzVbJZKnUkVhsUYSOVJrZ3yOnrqqCF3TtldZ46/UiBnae2p8f7Tpn7JT53P70Hd6yJ2zyjT+uGE6ufFjgq8MVNgGpAmCuNZvWUuWoL7HzhwEnBczRQ1qplitmI93+Vo/JUrFxZ08+U6yrWRj3nETN1QOww8ryA61zsllSXXSycXAPwp+g6Vdb88x5zZQoXGU64hM4+adS6qjSZwCWp3230uqPRcDAYtUf94VCmhj1Bl6T4S5KpYavqY/YokQ4vQh05MyoCmMpEQBJEMxiAO3qmVnZlR4uAWAB4OJkAFNGgiJ6wwDMJvJABvqnvTISLzk3Re0jqytzh0+CCExuk9gD99TigbyQoIapsXuEA7QE458N6ZBltAwMvbEdZLemcrJd15QYWJn3DoAyE/OYIFwIm6DlBDt47+A1eAvMez+eqTDt4eW7t03K9XhZAzfc0nUhebAJa9Oq373MGVODezBtPX3JAf3kpeAmoZaS0KP7cblfA6nJUB80IXFmnLGf6lKqmEQC333y8L9fLzxnXnvO6IWLd+aUmr9AWIAN4+VL6nXF4yxGalOrpeUTMSPVUBuKnUE/B5WAjmj2Thgq2c+H/kFGHBP3PAxXZDwPlDVTKTHA00LMNZ91cltqZ7pVCz4GVeh33wNgO9zecuUgHCNovqJ1j8He1NUZMkbDA4aA/e1QzbKatHwXJAB9N4UTfh2oG6pTotw2icq5w4FwRIgtSWvJv6Hvq3JfYuz3JFyKSR0XPeUNNLvXMA+iuxIA0XyVj4hq5LqipqG54mZdzlqiT+qrP8zH2XDkt1bmTC4TKdxWXBfsMQJhci58PgVP9vDtdUee5rlbwKAhLbJrnlLk+XzxAKu9SeZfJ6y/OtiwiGbLod7Ggm0xt6ExkvAe77zSbYTvUmSMRFk9CFCKTnhsLyXA4CMfMXV35Fbnu62rr+rA66tmUY76OoPQypGFt1I5kFgQNf+Z417fKW+YGeQindKH04qFMl2EftkE8KS/HPCsxK8OblI6Hp2XeBvUNfSr08u5GyNfxVc655wouzynOg121NPNaIU4FJV8sXOkFAGUK3b3zKDK5YJPPOTXJXA4VC5h7eXnqVWZ7fmlZLTxi+6dvzj4scbaOnab4cPftcrvvlNt9t9zue+m6l5iExCQkJnHhKTg3PL6DzP7LBJnC7UBkyKyvAskDZ2tU1RGVECXmzDQVDzEGkbWf2S6coxq9gR5M05n/zJ/h9d2bqjc4PjaUVr0dZPr8F2BOt8CIDkYbcwGKvjuDcqur+xTf9pgZhQfEzX5hLgNEBjxntiyN415dLzDmjhXcBxjCFiJ3iQctiaRz4EyuA4ZgsBnmHf2WTYjJFAZAhB2uA6cmQU9yACuiuUTRJ50T5mLf2a3+MrdnGrEwbSBcoSJxaf71vk4Mv7S0mnPYnHYu8KaqxkzgIsQqzXYN6w72RC8nbpbLnMpBBS8vnkD4tfu5/dpzghClvX/MLemXl88VZz4BCaC8uAp4+3SaMtvAqS1ArhMHqN8GyfHkLenFGdCl3fywHiGd3ns9WA6ksl1JLRPpYnySqrg3S1VclbfPFaejPl+lmMykJoEleHW7Q5b6CVOfxWqF0ckMh67TQDmO2/FBlWxdK28+f3r+RgRPt69X2mXgdY4Z7lwXzdaWE2ZA3GF/P5G76H5uzQlaajYlxU6OgzJd3Xncp7qTR0jp5A3+fLyJbydfe8xFV+dx2Shl7wH952hhl095yjHgnstRf5dr9eO9g533TaTsvpG+coSV5PCqvICq0rRyvmJr7mzt+5NIyWztl5qtPSafbXCaYYTTDEatfr/faw4G7eaoO9gjl/1yR4biDe69zte+ZPvtmBwYbe6pbdOv1L1RPjDNw9Q+wtxjRy9SEwmGNuXth/qIHEUi89Cy7c2kRIH7Z8RV88FmxTSjw/8QXh6no7lLIzPRLgAsYMqhRDOWPQfJjMDgE1zpFj5EY4+YbWxFtzoFtmAEp2k4Sug/eIe492GwrgfMoPZaGJ1qcZucEIjWqZrESooBcUzHH1w5JxJvR1aNUxF4+ocff6d8fvnuw9unn18qr777qDz/7t2Hp+/fvPxUw2Eh4bk0zGtnwIA7fXHCrz4hTwJOJD7C2PvB1EwLnopPfPXJW31SV5/08UzMTncokvOKyPkMWR806QZ/qT0WLG6Mf/F3tvxLg3IT3Ca1p5yoTIO1VnFzvqfzD+DdW4P1xZctNOx3n5RvHM+AQje1P//Tf/nzP/2D8seffv/Hn/7xj3/1V3/86b9BVSjxDpQww1mX+NN/+Dd/+o9/i6sefYfi5B7Dg9pzMP2pImRsKfmEv+FnTNvu8GdMF7+PyfLJ66e2Gzwa0+1n9vZDJJdWswOiFtPx1+XnQNRq9zLsejOgIhOb7tdrMI3gA3SItAkvsz0Y9ZFoxC/DZZHhskgPGuyNBkNcYWKKxvY0Ap3dBQVMhgTYwgUCmysQFnzC11r780//uN4m+ODTwlIdc7Vska9idSLf7eiDNSyIB2hLLMUYP/4MPwvOsXcMkQh38WZBC2ew04GUaqsXGn+IY4s/E+OJP7S3nm4OtddNM9Q///R3m4P9AuxUh3/ualSbT0Tvm4/s2LPN8Yya6cZzlNfX7lfm/bX67dN6ga3RsPw32O50K/MG24Pmab3BTnOL/IWEsocPl8ZlQ7GgCu84kDxO5xW3miewSVvd6mzS1vDENmm71T8BNttrV4fNDocnxmbbW+QvdDJVGP2Epv8q/A9rut4iUL+CMaKu4XALBGD48jX6bS2QB2BoIJG3AL+B/wb9Vm/Y6rZXArnQzoQ+hE2+oGPim57ygXAy4WRmKK+cpQq36jdUCGGkW4NY/WSuvijPcV0fwiERiwqm94NQumarM9yDplBrC6GHelAELwys3XT7wx1FfhWb1OY41KTTfOU43p5prn4yV1/Kn+bmOFJN04aaymf61ds722gJM/5s2echk93DSPT2bLY6ODCpB3rf0/hHOqYcs0AnaxwcrJb3Ba7aIja0FLgI83StiaEOIyNdMqX1y4k07u17Pdtl8AU9DzNOp34/h1/LrmZzv5XtyYI/2Q9UW853e4YJJv4paGJz7gEUp4oB7JlZrJ56cC2D9iKzC5o+NMtnBHzMYch7t1usgBl7tONlBjSEh9RnYjgidnpNUauTdf2bOL0iX8UxFfluRx+k3bi7xppuMxxrIpvvQQTarwaz801sFdlSPjRciljDH2kQ879sJfI91UK+XoAPBfQ1TbaAfkB3gYWg1+88b6HcgAKF7s1XypIVnkJaAGF6a6QTTxbDs4Izhng8kIXG48BWMIYR/abmRjDihA4Xv/TBVtERuG6wXJka6C4bsMUvockSSgLKfZLjQnN3YFTxFmBlCxZ9bC5ts5uYahdvuPUMK9gH8GrEH6SB70QAB7xji/yAbwJ/CHRt/NUE5odk5a3xYOUtm4DPGVISlqBk9RHmKDBpAUn/Jdji96LRr8FTAX7857/7t//vb39U/u8//Kd//ut/FzxGvPt//dd//T//+++C79jxn/793//v3/89wNX/5z//NTxFOBz3HLPAMAJSuPIR9h4O8jVV+c4fPhsEd/VTkJDBezqU518CXo77cUFM3MrPqBjS92C9ERc7feP/gI19MrjvIU79rWHh93eOYz5zwAkbH2FJ6M8PQpO/wfh42IyE3GGF58FkXvozg1oMCzw3QKJD0wtMCxB8myL3ApfyKcX1/wVjOJ53TOOO64w95RdMeUaY6PwzQ0+6yG+vGTARIrLoweRwFO++V545gHzXYRffiQcYMY2M5jM1cVzfEN8jlmiN4B6svSWe8NX4tOC4pV+6HqbroqajvAQLros/fcehi5vat/Dmgzm+MxeWeMC9IBfBW+KgSeGFMwVGDP4X2B6zDZGjdQprRZQPcIJiTUesL/6BYRJ7NbfvGfV2vrWfA51tTBof+Mjsv6GOeDcLc0xge6I1B2wKiag3Jd2GNpJiKPYpZ+KFhHS6/BpS53Mw6bF8xPmC+PYHCqsvabNQ2ly+qRQUCXGL/x8AAP//AwBQSwECLQAUAAAACACorIdXxSTwGzgpAAAOsgIABAAAAAAAAAAAACAAAAAAAAAAc2ZkdFBLBQYAAAAAAQABADIAAABaKQAAAAA="
        }
        if (container) {
            container.documentEditor.open(sfdt);
        }
    }

    // Function to save the document to your backend server
    function saveToBackend(documentBlob) {
        let formData = new FormData();
        formData.append('fileName', 'sample.docx');
        formData.append('data', documentBlob);

        // Replace 'your-backend-endpoint' with the actual endpoint of your backend server
        // var req = new XMLHttpRequest();
        // req.open(
        //     'POST',
        //     'https://your-backend-endpoint/api/documenteditor/SaveToBackend',
        //     true
        // );
        //
        // req.onreadystatechange = function () {
        //     if (req.readyState === 4) {
        //         if (req.status === 200 || req.status === 304) {
        //             console.log('Document saved to backend successfully');
        //         } else {
        //             console.error('Failed to save document to backend');
        //         }
        //     }
        // };
        //
        // req.send(formData);
    }

    async function onClick() {
        try {
            loadFile()
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // async function convertDocxToSfdt(docxContent) {
    //     const docEditor = new DocumentEditor();
    //     const fileReader = new FileReader();
    //
    //     return new Promise((resolve, reject) => {
    //         fileReader.onload = (event) => {
    //             const arrayBuffer = event.target.result;
    //             docEditor.load(arrayBuffer);
    //
    //             // Convert the loaded document to SFDT format
    //             const sfdtContent = docEditor.saveAsBlob('Sfdt').then((blob) => {
    //                 const reader = new FileReader();
    //                 reader.onload = () => {
    //                     resolve(reader.result);
    //                 };
    //                 reader.readAsText(blob);
    //             });
    //         };
    //
    //         fileReader.readAsArrayBuffer(docxContent);
    //     });
    // }

    function loadFile() {
        // const formData = new FormData();
        // formData.append('files', file);

        // Replace 'https://localhost:4000/api/documenteditor/Import' with your actual backend endpoint
        fetch('http://localhost:5001/api/v1/file-structure/convert', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({url: "https://ik.imagekit.io/mqrq0nywc/dd_reports/2023/December/2023-12-06_iTSCi_Template_Due_Diligence_DEMIKARU_mfJlRml20.docx"})
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    console.error('Failed to fetch document:', response.status);
                }
            })
            .then((sfdtContent) => {
                // Open SFDT text in document editor
                // console.log(sfdtContent)
                const { sfdt } = sfdtContent;
                // const { sfdt: sfdt2 } = sfdt;
                if (container.documentEditor) {
                    container.documentEditor.open(sfdt);
                    // console.log(container.documentEditor)
                }
                // container.documentEditor.open(sfdt2);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    const onSave = async () => {
        const file = await container.documentEditor.saveAsBlob('Docx');
        const formData = new FormData();
        formData.append('data', file);
        formData.append('fileId', fileId);
        formData.append('filePath', filePath);
        await saveFile({body: formData});
        navigate(-1);
        // if (response.data) {
        //     const { fileId, filePath, url } = response.data.data;
        //     if (fileId || filePath || url) {
        //         localStorage.setItem('fileId', fileId);
        //         localStorage.setItem('url', url);
        //         localStorage.setItem('filePath', filePath);
        //     }
        // }
    }

    return (
        <div className='space-y-2'>
            {/*<button onClick={onClick}>Import from Remote URL</button>*/}
            <div>
                {showSave && <LoadingButton name={"Save"} onClickFunction={onSave} isProcessing={isLoading}/>}
                <button className="px-4 py-1 bg-blue-300 rounded-md" type="button" onClick={onDownload}>Download</button>
            </div>
            <DocumentEditorContainerComponent
                id="container"
                ref={(scope) => {
                    container = scope;
                    created();
                }}
                height={'590px'}
                serviceUrl="https://ej2services.syncfusion.com/production/web-services/api/documenteditor/"
                enableToolbar={true}
                // created={onCreate}
                contentChange={onContentChange}
            />
        </div>
    );
}

export default DocumentEditorComponent;

