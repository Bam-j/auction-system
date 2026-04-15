import {FC} from 'react';

import {ServerStackIcon} from '@heroicons/react/24/outline';
import Swal from 'sweetalert2';

import DiscordIcon from '../icons/DiscordIcon';

const Footer: FC = () => {
  const serverAddress = import.meta.env.VITE_SERVER_ADDRESS || 'abyssblock.kr';
  const discordUrl = import.meta.env.VITE_DISCORD_URL || '';

  const handleCopy = () => {
    navigator.clipboard.writeText(serverAddress).then(() => {
      Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        icon: 'success',
        title: '서버 주소가 복사되었습니다!',
        background: document.documentElement.classList.contains('dark') ? '#1E1E1E' : '#FFFFFF',
        iconColor: '#3F99F5',
        color: document.documentElement.classList.contains('dark') ? '#E2E8F0' : '#444444',
      });
    }).catch(err => {
      console.error('복사 실패:', err);
    });
  };

  return (
      <footer className='bg-surface border-t border-border text-font-main py-12 mt-10 transition-colors duration-300'>
        <div className='container mx-auto px-4'>
          <div className='flex flex-col items-center justify-center space-y-8'>
            <div className='flex flex-col md:flex-row items-center justify-center space-y-6 md:space-y-0 md:space-x-16'>
              <div
                  onClick={handleCopy}
                  className='flex items-center space-x-4 cursor-pointer hover:scale-105 transition-transform group'
                  title='클릭하여 서버 주소 복사'
              >
                <div className='p-3 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors'>
                  <ServerStackIcon className='w-6 h-6 text-primary'/>
                </div>
                <div className='flex flex-col'>
                  <span className='text-[10px] text-font-sub uppercase tracking-widest font-bold'>서버 주소</span>
                  <span className='text-xl font-bold tracking-tight text-font-main'>{serverAddress}</span>
                </div>
              </div>

              <a
                  href={discordUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center space-x-4 hover:scale-105 transition-transform group'
                  title='공식 디스코드'
              >
                <div className='p-3 bg-[#5865F2]/10 rounded-full group-hover:bg-[#5865F2]/30 transition-colors'>
                  <DiscordIcon className='w-6 h-6 text-[#5865F2]'/>
                </div>
                <div className='flex flex-col'>
                  <span className='text-[10px] text-font-sub uppercase tracking-widest font-bold'>공식 디스코드</span>
                  <span className='text-xl font-bold tracking-tight text-font-main'>공식 디스코드</span>
                </div>
              </a>
            </div>

            <div className='pt-8 border-t border-border w-full max-w-4xl text-center'>
              <p className='text-sm text-font-sub'>
                &copy; {new Date().getFullYear()}
                <span className='font-bold text-primary ml-1'>AbyssBlock</span> AB Auction System. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
  );
};

export default Footer;
