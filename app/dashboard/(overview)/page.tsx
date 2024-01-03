import { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
// import { fetchCardData } from '@/app/lib/data';
import { Suspense } from 'react';
import { RevenueChartSkeleton, LatestInvoicesSkeleton, CardsSkeleton } from '@/app/ui/skeletons';
import CardWrapper from '@/app/ui/dashboard/cards';
// import {extractExcelContent} from '@/app/lib/plan'
import ExcelUploadForm from '../../ui/ExcelUploadForm';



export default async function Page() {

  return (
  <main className="min-h-full w-full flex justify-center items-center">  
   <ExcelUploadForm/>  
  </main>
  );
}