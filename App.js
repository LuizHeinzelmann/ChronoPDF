import './App.css';
import React, { useState } from 'react';
import Canvas from './components/canvas';
import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/build/pdf.worker.mjs';
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
import.meta.url
).toString();
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';

function App() {
  const [pages, setPages] = useState([]);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPages([]);
      convertPdfToImages(file);
    } else {
      alert('Por favor, selecione um arquivo PDF.');
    }
  };

  const convertPdfToImages = (file) => {
    const fileReader = new FileReader();
    fileReader.onload = async () => {
      const pdfData = new Uint8Array(fileReader.result);
      try {
        const pdf = await pdfjsLib.getDocument(pdfData).promise;
        const totalPages = pdf.numPages;
        const pagesArray = [];

        for (let i = 1; i <= totalPages; i++) {
          const page = await pdf.getPage(i);
          pagesArray.push(page);
        }

        setPages(pagesArray);
      } catch (error) {
        console.error('Erro ao carregar o PDF:', error);
      }
    };
    fileReader.readAsArrayBuffer(file);
  };

  return (
    <div className="App">
      <div className='header'></div>
          <section class="container">
            <div class="box">
                <div class="boxContent">
                  <h1>Chrono PDF</h1>
                  <h2>Converta seu arquivo de PDF para JPG!</h2>
                  <label htmlFor="fileInput" className="custom-file-upload glow-on-hover">
                    Escolher Arquivo
                  </label>
<input id="fileInput" type="file" accept=".pdf" onChange={handleFileChange} />

            <div className='chooseText'>
              {pages.length > 0 ? (
                pages.map((page, index) => <Canvas key={index} page={page} pageNumber={index + 1} />)
              ) : (
                <p>Selecione seu arquivo acima.</p>
              )}
            </div>

                </div>        
            </div>
      </section>
    </div>
  );
}

export default App;