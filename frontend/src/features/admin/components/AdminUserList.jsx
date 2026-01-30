import React, {useState} from "react";
import {Typography, Button, Chip} from "@material-tailwind/react";
import CommonTable from "../../../components/ui/CommonTable";
import Pagination from "../../../components/ui/Pagination";

const TABLE_HEAD = ["ID", "아이디", "닉네임", "상태", "관리"];

const AdminUserList = () => {
  const [page, setPage] = useState(1);

  //TODO: 프론트엔드 렌더링 테스트용 가짜 데이터, 개발 후 삭제
  const [users, setUsers] = useState([
    {id: 1, userId: "admin", nickname: "관리자", isBlocked: false},
    {id: 2, userId: "user123", nickname: "스티브", isBlocked: false},
    {id: 3, userId: "badguy", nickname: "트롤러", isBlocked: true},
  ]);

  const toggleBlock = (id) => {
    setUsers(users.map(user =>
        user.id === id ? {...user, isBlocked: !user.isBlocked} : user
    ));
    // TODO: 백엔드 API 호출
  };

  return (
      <CommonTable
          title="전체 회원 관리"
          headers={TABLE_HEAD}
          pagination={<Pagination active={page} total={1} onChange={setPage}/>}
      >
        {users.map(({id, userId, nickname, isBlocked}) => (
            <tr key={id} className="border-b border-blue-gray-50 hover:bg-gray-50">
              <td className="p-4"><Typography variant="small" className="text-gray-600">{id}</Typography></td>
              <td className="p-4"><Typography variant="small"
                                              className="font-bold text-blue-gray-800">{userId}</Typography></td>
              <td className="p-4"><Typography variant="small" className="text-gray-600">{nickname}</Typography></td>
              <td className="p-4">
                <Chip
                    size="sm"
                    variant="ghost"
                    value={isBlocked ? "차단됨" : "정상"}
                    color={isBlocked ? "red" : "green"}
                    className="w-max"
                />
              </td>
              <td className="p-4">
                <Button
                    size="sm"
                    variant={isBlocked ? "outlined" : "gradient"}
                    color={isBlocked ? "green" : "red"}
                    onClick={() => toggleBlock(id)}
                    className="w-24"
                >
                  {isBlocked ? "차단 해제" : "차단"}
                </Button>
              </td>
            </tr>
        ))}
      </CommonTable>
  );
};

export default AdminUserList;