import React, {useState, useEffect} from "react";
import CommonTable from "../../../components/ui/CommonTable";
import Pagination from "../../../components/ui/Pagination";
import StatusBadge from "../../../components/ui/StatusBadge";
import TableActionButtons from "../../../components/ui/TableActionButtons";
import EmptyState from "../../../components/ui/EmptyState";
import CommonFilterBar from "../../../components/ui/CommonFilterBar";
import { getAllUsers } from "../api/adminApi";
import { Typography } from "@material-tailwind/react";

const TABLE_HEAD = ["ID", "아이디", "닉네임", "권한", "관리"];

const AdminUserList = () => {
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        setUsers(response.data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

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
    // TODO: Implement actual block logic with API
    console.log("Toggle block for user:", id);
  };

  return (
      <div className="flex flex-col gap-4 h-full">
        <CommonFilterBar
            searchPlaceholder="닉네임/아이디 검색"
            filterConfigs={userFilters}
            onSearch={handleSearch}
        />

        {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Typography>회원 목록을 불러오는 중입니다...</Typography>
            </div>
        ) : users.length === 0 ? (
            <EmptyState message="회원이 없습니다."/>
        ) : (
            <CommonTable
                title="전체 회원 관리"
                headers={TABLE_HEAD}
                pagination={
                  users.length > 0 && (
                    <Pagination 
                      active={page} 
                      total={Math.ceil(users.length / 10) || 1} 
                      onChange={setPage}
                    />
                  )
                }
            >
              {users.map((user) => (
                  <tr key={user.username} className="border-b border-blue-gray-50 hover:bg-gray-50">
                    <td className="p-4 text-gray-600">{user.username}</td>
                    <td className="p-4 font-bold text-blue-gray-800">{user.nickname}</td>
                    <td className="p-4 text-gray-600">{user.nickname}</td>
                    <td className="p-4">
                      <StatusBadge status={user.role}/>
                    </td>
                    <td className="p-4">
                      <TableActionButtons
                          onDelete={() => toggleBlock(user.username)}
                          deleteLabel="차단"
                          isBlocked={false}
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
