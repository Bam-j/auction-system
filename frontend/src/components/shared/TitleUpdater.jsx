import {useEffect} from "react";
import {useLocation} from "react-router-dom";

const TitleUpdater = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    let title = "어비스 거래소";

    if (path === "/") {
      title = "어비스 거래소 - Home";
    } else if (path === "/login") {
      title = "로그인";
    } else if (path === "/signup") {
      title = "회원 가입";
    } else if (path.startsWith("/mypage")) {
      title = "마이 페이지";
    } else if (path.startsWith("/admin")) {
      title = "관리자 페이지";
    }
    document.title = title;
  }, [location]);

  return null;
};

export default TitleUpdater;