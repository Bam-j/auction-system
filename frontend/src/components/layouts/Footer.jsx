import {ServerStackIcon} from "@heroicons/react/24/outline";
import Swal from "sweetalert2";

const Footer = () => {
  const serverAddress = "abyssblock.kr";
  const discordUrl = "https://discord.gg/QZF8HHZk";

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
        background: '#FFFFFF',
        iconColor: '#3F99F5',
      });
    }).catch(err => {
      console.error('복사 실패:', err);
    });
  };

  return (
      <footer className="bg-primary-dark text-font-white py-12 mt-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center space-y-8">
            <div className="flex flex-col md:flex-row items-center justify-center space-y-6 md:space-y-0 md:space-x-16">
              <div
                  onClick={handleCopy}
                  className="flex items-center space-x-4 cursor-pointer hover:scale-105 transition-transform group"
                  title="클릭하여 서버 주소 복사"
              >
                <div className="p-3 bg-white/10 rounded-full group-hover:bg-white/20 transition-colors">
                  <ServerStackIcon className="w-6 h-6 text-white"/>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-white/60 uppercase tracking-widest font-bold">서버 주소</span>
                  <span className="text-xl font-bold tracking-tight">{serverAddress}</span>
                </div>
              </div>

              <a
                  href={discordUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-4 hover:scale-105 transition-transform group"
                  title="공식 디스코드"
              >
                <div className="p-3 bg-white/10 rounded-full group-hover:bg-[#5865F2]/40 transition-colors">
                  <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 24 24">
                    <path
                        d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.08.08 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-white/60 uppercase tracking-widest font-bold">공식 디스코드</span>
                  <span className="text-xl font-bold tracking-tight">공식 디스코드</span>
                </div>
              </a>
            </div>

            <div className="pt-8 border-t border-white/10 w-full max-w-4xl text-center">
              <p className="text-sm opacity-60">
                &copy; {new Date().getFullYear()} <span className="font-bold text-white/80">AbyssBlock</span> Minecraft
                                                                                                              Auction
                                                                                                              System.
                                                                                                              All rights
                                                                                                              reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
  );
};

export default Footer;