import React, {useState} from "react";
import CommonTable from "../../../components/ui/CommonTable";
import Pagination from "../../../components/ui/Pagination";
import StatusBadge from "../../../components/ui/StatusBadge";
import TableActionButtons from "../../../components/ui/TableActionButtons";
import EmptyState from "../../../components/ui/EmptyState";
import CommonFilterBar from "../../../components/ui/CommonFilterBar";

const TABLE_HEAD = ["ID", "아이디", "닉네임", "상태", "관리"];

const AdminUserList = () => {
  const [page, setPage] = useState(1);

  const [users, setUsers] = useState([
    {id: 1, username: "admin", nickname: "관리자", isBlocked: false},
    {id: 3, username: "badguy", nickname: "트롤러", isBlocked: true},
  ]);

  const userFilters = [
    {
      id: "status",
      label: "계정 상태",
      options: [
        {label: "전체", value: "ALL"},
        {label: "정상 (ACTIVE)", value: "ACTIVE"},
        {label: "차단됨 (BANNED)", value: "BANNED"},
      ],
    }
  ];

  const handleSearch = (searchData) => {
    console.log("관리자 유저 검색:", searchData);
  };

  const toggleBlock = (id) => {
    setUsers(users.map(u => u.id === id ? {...u, isBlocked: !u.isBlocked} : u));
  };

  return (
      <div className="flex flex-col gap-4 h-full">
        <CommonFilterBar
            searchPlaceholder="닉네임/아이디 검색"
            filterConfigs={userFilters}
            onSearch={handleSearch}
        />

        {users.length === 0 ? (
            <EmptyState message="회원이 없습니다."/>
        ) : (
            <CommonTable
                title="전체 회원 관리"
                headers={TABLE_HEAD}
                pagination={<Pagination active={page} total={1} onChange={setPage}/>}
            >
              {users.map(({id, username: username, nickname, isBlocked}) => (
                  <tr key={id} className="border-b border-blue-gray-50 hover:bg-gray-50">
                    <td className="p-4 text-gray-600">{id}</td>
                    <td className="p-4 font-bold text-blue-gray-800">{username}</td>
                    <td className="p-4 text-gray-600">{nickname}</td>
                    <td className="p-4">
                      <StatusBadge status={isBlocked ? "BANNED" : "ACTIVE"}/>
                    </td>
                    <td className="p-4">
                      <TableActionButtons
                          onDelete={() => toggleBlock(id)}
                          deleteLabel="차단"
                          isBlocked={isBlocked}
                      />
                    </td>
                  </tr>
              ))}
            </CommonTable>
        )}
      </div>
  );
};

export default AdminUserList;
