'use client'

import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteInvoice } from '@/app/lib/actions';
import { useState } from 'react';
import Planning from '../planning';


export function CreateInvoice() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);


  const handleUpload = async (file : any) => {
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
      console.log(responseData)
      setData(responseData);

    } catch (error) {
      console.error("Erreur lors de la requête d'upload :", error);
    }
  };

    const handleFileChange = async (event : any) => {
    setFile(event.target.files[0]);
    await handleUpload(event.target.files[0]);
  };
  return (
    <> 
    <div>
    <input
        className="absolute w-[200px] h-10 z-10 cursor-pointer rounded-lg opacity-0"
        type="file"
        name="file"
        onChange={handleFileChange}
      />
        <div
      className="flex z-1 h-10 w-[200px] cursor-pointer items-center rounded-lg bg-[#5DAF24] px-4 text-sm font-medium text-white font-bold hover:shadow-md hover:shadow-[#ADD791] "
    >

      <span className="block cursor-pointer">Nouveau Planning</span>
      <PlusIcon className="h-5 md:ml-4" />
    </div>

    
    </div>
    
    {file && data? <Planning data={data}></Planning> : null}
    </>

  );
}



export function UpdateInvoice({ id }: { id: string }) {
  return (
    <Link
    href={`/dashboard/invoices/${id}/edit`}  
    className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteInvoice({ id }: { id: string }) {
  const deleteInvoiceWithId = deleteInvoice.bind(null, id);
 
  return (
    <form action={deleteInvoiceWithId}>
      <button className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-4" />
      </button>
    </form>
  );
}
