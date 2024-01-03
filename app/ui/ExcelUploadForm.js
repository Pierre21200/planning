// Importez useState pour gérer l'état du fichier
'use client';

import { useState } from 'react';

const ExcelUploadForm = () => {


  // Utilisez useState pour gérer l'état du fichier
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  
  const [dataDays, setDataDays] = useState([])

  const [lmatin, setLmatin] = useState(0)
  const [lsoir, setLsoir] = useState(0)


  const handleFileChange = async (event) => {
    setFile(event.target.files[0]);
    await handleUpload(event.target.files[0]);
  };

  const handleUpload = async (file) => {
    try {
      // Vérifiez si un fichier a été sélectionné
      if (!file) {
        console.error('Aucun fichier sélectionné.');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/excel', {
        method: 'POST',
        body: formData,
      });

      const responseData = await response.json();

      setData(responseData);

      let tab = []



      
      const calculateAndSetHeights = (dayData) => {
        if(dayData[0] === 'congé') {
          tab.push('0', '0')
        } else {
          const matchResult = dayData[0].match(/(\d+)(?:h(\d+))?/);
          const heures = parseInt(matchResult[1], 10);
          const minutes = matchResult[2] ? parseInt(matchResult[2], 10) : 0;
          const m = heures + minutes / 60;
          const ma = (m - 7) * 20;
  
          const matchResult2 = dayData[1].match(/(\d+)(?:h(\d+))?/);
          const heures2 = parseInt(matchResult2[1], 10);
          const minutes2 = matchResult2[2] ? parseInt(matchResult2[2], 10) : 0;
          const s = heures2 + minutes2 / 60;
  
          const so = (s - m) * 20;
          tab.push(ma,so)
        }
      };

      
    const joursSemaine = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

    for (const jour of joursSemaine) {
      calculateAndSetHeights(responseData[jour]);
    }

    setDataDays(tab)


    } catch (error) {
      console.error("Erreur lors de la requête d'upload :", error);
    }
  };

  return (
    <div className="justify-beetwen relative flex w-full flex-col items-center ">
      <input
        className="pointer absolute z-10 h-80 w-5/6 cursor-pointer rounded-[100px]  opacity-0 max-[500px]:w-full"
        type="file"
        name="file"
        onChange={handleFileChange}
      />
      <div className="relative z-0 flex flex h-80 w-5/6 flex-col items-center justify-between rounded-[100px] bg-[#ADD791] py-9 text-3xl font-bold text-white max-[500px]:w-full max-[500px]:text-xl">
        {file ? file.name : 'CHOISIR UN FICHIER'}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="160"
          width="200"
          viewBox="0 0 640 512"
          fill="white"
        >
          <path d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z" />
        </svg>
      </div>

      {data ? (
    <div className="relative my-10 flex h-[300px] w-full  items-start justify-around border-2 border-black">
          <div className="h-full w-1/12">
           
          <div style={{ marginBottom: `${dataDays[0]}px` }} className={`flex h-1/6 items-center justify-center`}>{window.innerWidth < 1024 ? 'Lun.' : 'Lundi'}</div>
          <div style={{ height: `${dataDays[1]}px` }} className=  {` w-full border-2`}></div>
          </div>
          <div className="h-full w-1/12">
          <div style={{ marginBottom: `${dataDays[2]}px` }} className={`flex h-1/6 justify-center items-center`}>Mardi</div>
          <div style={{ height: `${dataDays[3]}px` }} className=  {` w-full border-2`}></div>
          </div>
          <div className="h-full w-1/12">
          <div style={{ marginBottom: `${dataDays[4]}px` }} className={`flex h-1/6 justify-center items-center`}>Mercredi</div>
          <div style={{ height: `${dataDays[5]}px` }} className=  {` w-full border-2`}></div>
          </div>
          <div className="h-full w-1/12">
          <div style={{ marginBottom: `${dataDays[6]}px` }} className={`flex h-1/6 justify-center items-center`}>Jeudi</div>
          <div style={{ height: `${dataDays[7]}px` }} className=  {` w-full border-2`}></div>
          </div>
          <div className="h-full w-1/12">
          <div style={{ marginBottom: `${dataDays[8]}px` }} className={`flex h-1/6 justify-center items-center`}>Vendredi</div>
          <div style={{ height: `${dataDays[9]}px` }} className={` w-full border-2`}></div>
          </div>
          <div className="h-full w-1/12">
          <div style={{ marginBottom: `${dataDays[10]}px` }} className={`flex h-1/6 items-center justify-center`}>Samedi</div>
          <div style={{ height: `${dataDays[11]}px` }} className={` w-full border-2`}></div>
          </div>
          <div className="h-full w-1/12">
          <div style={{ marginBottom: `${dataDays[12]}px` }} className={`flex h-1/6 items-center justify-center`}>Dimanche</div>
          <div style={{ height: `${dataDays[13]}px` }} className={` w-full border-2`}></div>
          </div>
        </div>
      ) : (
        <div className="relative my-10 flex h-[300px] w-full  items-start justify-between border-2 border-black">
          <div className="h-full">
            {/*  on va définir un margin bottom a la div contenant le nom de la journée pour définir l'heure de début de journée
            on va définir une height à la div juste en dessous pour définir la durée de la journée
             20px = 1heure
              parseInt(data.lundi[0].match(/\d+/)[0], 10);
             */}
            <div className="flex h-1/6 items-center mb-[20px]">Lundi</div>
            
            <div className="h-[20px] w-full border-2"></div>
          </div>
          <div>Mardi</div>
          <div>Mercredi</div>
          <div>Jeudi</div>
          <div>Vendredi</div>
          <div>Samedi</div>
          <div>Dimanche</div>
        </div>
      )}
    </div>
  );
};

export default ExcelUploadForm;

// 7/21
// 300px, 280px (140 x 2) + 20px
