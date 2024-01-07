import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import AcmeLogo from '@/app/ui/acme-logo';
import { PowerIcon } from '@heroicons/react/24/outline';
import { signOut } from '@/auth';
import Image from 'next/image';


export default function SideNav() {
  return (
    <div className="flex md:fixed h-full flex-col px-3 py-10 md:px-2 border-2 md:border-r-[#5DAF24] shadow-md shadow-[#5DAF24] items-center">
       <Image
        src="/logoClinique.png"
        width={200}
        height={200}
        className="hidden md:block flex"
        alt="Screenshots of the dashboard project showing desktop version"
      />
      <Link
        className="mb-2 flex h-20 items-end justify-center items-center rounded-md bg-white-600 p-4 md:h-40"
        href="/"
      >
        <div className="w-32 text-white md:w-40">
        <h1 className="text-5xl"><strong className='text-[#5DAF24]'>I</strong>
        <strong className='text-[#5DAF24]'>Z</strong>
      <strong className='text-[#AF1855]'>I</strong>
      <strong className='text-[#F7BE00]'>Plan</strong>
      </h1>          
        </div>
      </Link>
      <div className="flex grow w-full flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <form action={async () => {
            'use server';
            await signOut();
          }}>
          <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-mygreen-400 hover:text-white md:flex-none md:justify-start md:p-2 md:px-3">
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}
