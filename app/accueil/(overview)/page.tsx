import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/invoices/table';
import { CreateInvoice } from '@/app/ui/invoices/buttons';
import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { fetchInvoicesPages } from '@/app/lib/data';
import { Metadata } from 'next';
import Planning from '@/app/ui/planning'
import {fetchFilteredInvoices} from  '@/app/lib/data'
import WeekDays from '@/app/ui/WeekDays';
import Plan from '@/app/ui/plan'
import { useState } from 'react';

export const metadata: Metadata = {
  title: 'Acceuil',
};
 
export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {


  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const data = await fetchFilteredInvoices();


  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-center mt-10">
        <h1 className={`text-[#5DAF24] font-bold text-3xl`}>MES PLANNINGS</h1>
      </div>
      <div className="mt-10 flex-col items-center z-20 justify-center sm:justify-start ">
        {/* <Search placeholder="Search invoices..." /> */}
        <CreateInvoice />
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>

          {data.slice().reverse().map((item: any) => {
        return (
          <WeekDays key={item.id} data={item} my={true}></WeekDays>
        );
    })}



        {/* <Planning data={data}></Planning> */}
        {/* <Table query={query} currentPage={currentPage} /> */}
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        {/* <Pagination totalPages={totalPages} /> */}
        
      </div>
    </div>
  );
}