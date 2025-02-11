import React, { useEffect, useRef, useState } from "react";

const Canvas = ({ page, pageNumber }) => {
  const canvasRef = useRef(null);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    let renderTask = null;

    const renderPage = async () => {
      if (!canvasRef.current) return;

      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      const viewport = page.getViewport({ scale: 0.5 });

  
      canvas.width = viewport.width;
      canvas.height = viewport.height;

  
      context.clearRect(0, 0, canvas.width, canvas.height);

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };


      renderTask = page.render(renderContext);

      try {
        await renderTask.promise;


        const imageData = canvas.toDataURL("image/jpeg");
        setImageUrl(imageData);
      } catch (error) {
        if (error.name !== "RenderingCancelledException") {
          console.error("Erro na renderização da página:", error);
        }
      }
    };

    renderPage(); 


    return () => {
      if (renderTask) {
        renderTask.cancel();
      }
    };
  }, [page]);

  return (
    <div>
      <p>Página {pageNumber}</p>
      <canvas ref={canvasRef} />
      {imageUrl && (
        <a href={imageUrl} download={`pagina-${pageNumber}.jpg`}>
          <button>Baixar Imagem</button>
        </a>
      )}
    </div>
  );
};

export default Canvas;
