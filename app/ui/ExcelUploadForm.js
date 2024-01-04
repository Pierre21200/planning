// Importez useState pour gérer l'état du fichier
'use client';

import { useState } from 'react';

const ExcelUploadForm = () => {
  // Utilisez useState pour gérer l'état du fichier
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);

  const [dataDays, setDataDays] = useState([]);

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

      let tab = [];

      const calculateAndSetHeights = (dayData) => {
        if (dayData[0] === 'congé') {
          tab.push('0', '0');
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
          tab.push(ma, so);
        }
      };

      const joursSemaine = [
        'lundi',
        'mardi',
        'mercredi',
        'jeudi',
        'vendredi',
        'samedi',
        'dimanche',
      ];

      for (const jour of joursSemaine) {
        calculateAndSetHeights(responseData[jour]);
      }

      setDataDays(tab);
    } catch (error) {
      console.error("Erreur lors de la requête d'upload :", error);
    }
  };

  const WeekDays = ({ datas }) => {
    const weekDays = [
      'LUNDI',
      'MARDI',
      'MERCREDI',
      'JEUDI',
      'VENDREDI',
      'SAMEDI',
      'DIMANCHE',
    ];

    return (
      <div className="relative my-5 flex h-[350px] w-full items-start justify-around rounded-2xl  border-[3px] border-[#5DAF24] bg-[#ADD791] py-5 font-bold text-white shadow-md shadow-[#ADD791]">
        {weekDays.map((day, index) => (
          <div key={index} className="h-full w-1/12">
            <div
              style={{ marginBottom: `${dataDays[index * 2]}px` }}
              className={`flex h-1/6 items-center justify-center text-lg`}
            >
              {day}
            </div>
            {dataDays[index * 2] === '0' ? (
              <div className="flex h-5/6 w-full flex-col items-center justify-center rounded-2xl border-2 border-white bg-[#5DAF24]">
                <p>CONGÉ</p>
              </div>
            ) : (
              <div
                style={{ height: `${dataDays[index * 2 + 1]}px` }}
                className="flex w-full flex-col items-center justify-between rounded-2xl border-2 border-white bg-[#5DAF24] py-3"
              >
                <p>{data[day.toLowerCase()][0]}</p>
                <p>{data[day.toLowerCase()][1]}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="justify-beetwen relative flex w-full flex-col items-center ">
      <input
        className="pointer absolute z-10 h-80 w-5/6 cursor-pointer rounded-[100px] border-2   opacity-0 max-[500px]:w-full"
        type="file"
        name="file"
        onChange={handleFileChange}
      />
      <div className="relative z-0 flex flex h-80 w-5/6 flex-col items-center justify-between rounded-[100px] border-2 border-[#5DAF24] bg-[#ADD791] py-9 text-3xl font-bold text-white shadow-md shadow-[#5DAF24] max-[500px]:w-full max-[500px]:text-xl">
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

      {dataDays.length !== 0 ? (
        <WeekDays data={dataDays}></WeekDays>
      ) : (
        <div className="relative my-10 flex h-[300px] w-full  items-start justify-between border-2 border-black">
          <div className="h-full">
            <div className="mb-[20px] flex h-1/6 items-center">Lundi</div>

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
