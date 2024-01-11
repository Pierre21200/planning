'use client';

import { useState, useEffect } from 'react';
import { savePlanning } from '../lib/actions';
import WeekDays from './WeekDays';

const Planning = ({ data }) => {
  // Utilisez useState pour gérer l'état du fichier
  const [enr, setEnr] = useState(false);
  const [drop, setDrop] = useState(false);

  const save = async (datas) => {
    const response = await savePlanning(datas);
    if (response === 'Ajout réussi') {
      setEnr(true);
      window.location.reload();
    }
  };

  return (
    <>
      {!enr ? (
        <div className="justify-beetwen relative flex w-full flex-col items-center ">
          <div className="flex w-full justify-center">
            <p className="mt-10 text-2xl font-bold text-[#5DAF24]">
              {data.semaine[0]}
            </p>
          </div>

          <button
            onClick={() => save(data)}
            className="mt-5 border-2 border-[#5DAF24] bg-[#ADD791] p-2 font-bold text-white shadow-md hover:bg-[#5DAF24] hover:shadow-lg"
          >
            Enregistrer
          </button>

          <WeekDays data={data} my={false}></WeekDays>
        </div>
      ) : null}
    </>
  );
};

export default Planning;
