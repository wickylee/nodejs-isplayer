import React, { Component } from 'react';

import { Document, Page, pdfjs } from "react-pdf/dist/esm/entry.webpack";
// import { pdfjs, Document, Page } from 'react-pdf';
// pdfjs.GlobalWorkerOptions.workerSrc = `/static/pdfjs.worker.js`;


class PlayPdf extends Component {
  state = {
    numPages: null,
    pageNumber: 1,
    //--
    loopInterval: null,
  }
 

  onDocumentLoadSuccess = ({ numPages }) => {
    //console.log('onDocumentLoadSuccess') 
    this.setState({ numPages });
    this.loopPDFpage();
  }
 
  loopPDFpage = () => {
    this.state.loopInterval = setInterval(() => {
        //console.log('pageNumber', this.state.pageNumber) 
        let nextPage = this.state.pageNumber;
        
        if (nextPage >= this.state.numPages ) 
            nextPage = 1;
        else  
            nextPage++;
        this.setState({ pageNumber: nextPage});
    }, 1000*this.props.appSetting.turn_page_time);
  }


  componentWillUnmount() {
    clearInterval(this.state.loopInterval);
  }

  render() {
    const { pageNumber, numPages } = this.state;
    const media = this.props.element.mediasource;

    let mStyle = { padding: "0px" };
    mStyle.width = `${this.props.element.width}px`;
    mStyle.height =  `${this.props.element.height}px`;

    return (
      <div style={mStyle} className="play-pdf">
        <Document
          file={media.content}
          onLoadSuccess={this.onDocumentLoadSuccess}
          options={{
            cMapUrl: '/static/cmaps/',
            cMapPacked: true,
          }}
        >
          <Page pageNumber={pageNumber} width={this.props.element.width} renderAnnotationLayer={false} renderTextLayer={false} />
        </Document>
      </div>
    );
  }
}

export default PlayPdf;
