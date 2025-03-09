import logo from "../../assets/images/logo-doe-agasalho.png";

export const printReport = (containerRef, period) => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const container = containerRef.current;
    const containerCopy = container.cloneNode(true);
    containerCopy.style.overflow = "visible";

    const printWindow = window.open();
    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>Relatório Movimentação - Doe Agasalho</title>
          <link rel="stylesheet" href="./style.css">
          <style>
            
            @media print {
                body {
                  visibility: hidden;
                }
                .print-container {
                  visibility: visible;
                  position: absolute;
                  left: 0;
                  top: 0;
                  width: 100%;
                  height: 100%;
                  font-family: 'Lato', sans-serif;
                }
                .print-table {
                  width: 100%;
                  border-collapse: collapse;
                  text-transform: uppercase;
                }
                .print-table th,
                .print-table td {
                  text-align: center;
                  border-bottom: 1px solid #333;
                  padding: 6px 6px;
                }

                .print-table th{
                    font-size: 13px;
                }


                .print-table td{
                    font-size: 10px;
                }
            
                .relatorio-header{
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
            
                .relatorio-logo{
                    width: 200px;
                    justify-self: flex-start

                }
                
                .relatorio-header h1{
                    font-size: 18px;
                    margin-bottom: 30px;
                }
              }

              .print-container {
                display: flex;
                align-items: center;
                justify-content: flex-start;
                flex-direction: column;
                visibility: visible;
                width: 100%;
                height: 100%;
                font-family: 'Lato', sans-serif;
                margin-top: 50px;
              }
              .print-table {
                width: 100%;
                border-collapse: collapse;
                text-transform: uppercase;
              }
              .print-table th,
              .print-table td {
                text-align: center;
                border-bottom: 1px solid #333;
                padding: 5px
              }

              .print-table th{
                  font-size: 13px;
              }


              .print-table td{
                  font-size: 10px;
              }
          
              .relatorio-header{
                  display: flex;
                  flex-direction: column;
                  align-items: center;
              }
          
              .relatorio-logo{
                  width: 250px;
              }
              
              .relatorio-header h1{
                  font-size: 18px;
                  margin-bottom: 30px;
              }

              .row-result td{
                text-align: left;
                padding-left: 40px;
                font-weight: 700;
            }
            
            .row-result-first{
                border-top: 2px solid #0000006b;
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            <div class="relatorio-header">
                <img src=${logo} alt="Logo Doe Agasalho" class="relatorio-logo" />
                <h1 class="relatorio-title">Relatório de Doações - Ref: ${period}</h1>
             </div>
            <table class="print-table">${containerCopy.innerHTML}</table>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
      printWindow.onafterprint = () => {
        printWindow.close();
        document.body.style.overflow = originalOverflow;
      };
    };
  };