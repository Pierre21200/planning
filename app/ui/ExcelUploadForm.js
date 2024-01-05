// Importez useState pour gérer l'état du fichier
'use client';

import { useState } from 'react';

const ExcelUploadForm = () => {
  // Utilisez useState pour gérer l'état du fichier
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  // const [dataDays, setDataDays] = useState([]);

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

      // let tab = [];

      // const calculateAndSetHeights = (dayData) => {
      //   if (dayData[0] === 'congé') {
      //     tab.push('0', '0');
      //   } else {
      //     const matchResult = dayData[0].match(/(\d+)(?:h(\d+))?/);
      //     const heures = parseInt(matchResult[1], 10);
      //     const minutes = matchResult[2] ? parseInt(matchResult[2], 10) : 0;
      //     const m = heures + minutes / 60;
      //     const ma = (m - 7) * 20;

      //     const matchResult2 = dayData[1].match(/(\d+)(?:h(\d+))?/);
      //     const heures2 = parseInt(matchResult2[1], 10);
      //     const minutes2 = matchResult2[2] ? parseInt(matchResult2[2], 10) : 0;
      //     const s = heures2 + minutes2 / 60;

      //     const so = (s - m) * 20;
      //     tab.push(ma, so);
      //   }
      // };

      // const joursSemaine = [
      //   'lundi',
      //   'mardi',
      //   'mercredi',
      //   'jeudi',
      //   'vendredi',
      //   'samedi',
      //   'dimanche',
      // ];

      // for (const jour of joursSemaine) {
      //   calculateAndSetHeights(responseData[jour]);
      // }

      // setDataDays(tab);
    } catch (error) {
      console.error("Erreur lors de la requête d'upload :", error);
    }
  };

  const renderDayData = (day, data) => {
    const dayData = data[day];
    return (
      <>
        {dayData.length === 0 ? (
          <div className="relative top-[20px] flex h-5/6 w-full flex-col items-center justify-center rounded-2xl border-2 border-white bg-[#ADD791]"></div>
        ) : dayData.length === 2 ? (
          <div
            style={{ height: `${(dayData[1] - dayData[0]) * 20}px` }}
            className="flex w-full flex-col items-center justify-between rounded-2xl border-2 border-white bg-[#5DAF24] py-2"
          >
            {dayData.map((h, index) => (
              <div key={index}>{h === 25 ? '01' : h === 26 ? '02' : h}</div>
            ))}
          </div>
        ) : dayData.length === 4 ? (
          <>
            <div
              style={{
                marginBottom: `20px`,
                height: `${(dayData[1] - dayData[0]) * 20}px`,
              }}
              className="flex w-full flex-col items-center justify-between rounded-2xl border-2 border-white bg-[#5DAF24] py-2"
            >
              <p>{dayData[0]}</p>
              <p>
                {dayData[1] === 25
                  ? '01'
                  : dayData[1] === 26
                  ? '02'
                  : dayData[1]}
              </p>
            </div>
            <div
              style={{ height: `${(dayData[3] - dayData[2]) * 20}px` }}
              className="flex w-full flex-col items-center justify-between rounded-2xl border-2 border-white bg-[#5DAF24] py-2"
            >
              <p>{dayData[2]}</p>
              <p>
                {dayData[3] === 25
                  ? '01'
                  : dayData[3] === 26
                  ? '02'
                  : dayData[3]}
              </p>
            </div>
          </>
        ) : null}
      </>
    );
  };

  const WeekDays = ({ datas }) => {
    const weekDays = [
      'Lundi',
      'Mardi',
      'Mercredi',
      'Jeudi',
      'Vendredi',
      'Samedi',
      'Dimanche',
    ];

    return (
      <div className="relative my-5 flex h-[460px] w-full items-start justify-around rounded-2xl  border-[3px] border-[#5DAF24] bg-[#ADD791] py-5 text-sm font-bold text-white shadow-md shadow-[#ADD791]">
        {weekDays.map((day, index) => (
          <div key={index} className="h-full w-1/12">
            <div
              style={{ marginBottom: `${(data[day][0] - 7) * 20 + 20}px` }}
              className={`flex h-[20px] items-center justify-center lg:text-lg`}
            >
              {day.substring(0, 3)}.
            </div>
            {renderDayData(day, data)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="justify-beetwen relative flex w-full flex-col items-center ">
      <input
        className="pointer absolute z-10 h-[100px] w-5/6 cursor-pointer rounded-[100px] border-2   opacity-0 max-[500px]:w-full"
        type="file"
        name="file"
        onChange={handleFileChange}
      />
      <div className="relative z-0 flex h-[100px] w-5/6  items-center justify-center rounded-[100px] border-2 border-[#5DAF24] bg-[#ADD791] py-9 text-2xl font-bold text-white shadow-md shadow-[#5DAF24] max-[500px]:w-full max-[500px]:text-xl">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="160"
          width="100"
          viewBox="0 0 640 512"
          fill="white"
        >
          <path d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z" />
        </svg>
        {file ? (
          <p className="mx-3 md:mx-10">{file.name}</p>
        ) : (
          <p className="mx-3 md:mx-10">CHOISIR UN FICHIER</p>
        )}
      </div>

      {data ? (
        <WeekDays data={data}></WeekDays>
      ) : (
        <div className="relative my-5 flex h-[460px] w-full items-center justify-center rounded-2xl border-[3px]  border-[#5DAF24] bg-[#ADD791] py-5 text-4xl font-bold text-white shadow-md shadow-[#ADD791]">
          <p>Aucun Fichier Sélectionné</p>
        </div>
      )}
    </div>
  );
};

export default ExcelUploadForm;
