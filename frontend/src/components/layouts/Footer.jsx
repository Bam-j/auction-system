const Footer = () => {
  return (
      <footer className="bg-primary-dark text-font-white py-6 mt-10">
        <div className="container mx-auto text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Minecraft Auction System. All rights reserved.
            {/* TODO: 서버 주소, 디스코드 초대 링크 삽입 */}
          </p>
        </div>
      </footer>
  );
};

export default Footer;