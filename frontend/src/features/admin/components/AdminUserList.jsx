import React, {useState, useEffect} from "react";
import CommonTable from "../../../components/ui/CommonTable";
import Pagination from "../../../components/ui/Pagination";
import StatusBadge from "../../../components/ui/StatusBadge";
import TableActionButtons from "../../../components/ui/TableActionButtons";
import EmptyState from "../../../components/ui/EmptyState";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import CommonFilterBar from "../../../components/ui/CommonFilterBar";
import { getAllUsers, blockUser, unblockUser } from "../api/adminApi";
import { Typography } from "@material-tailwind/react";
import Swal from "sweetalert2";

const TABLE_HEAD = ["ID", "아이디", "닉네임", "권한", "상태", "관리"];

const AdminUserList = () => {
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await getAllUsers();
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const userFilters = [
    {
      id: "status",
      label: "계정 상태",
      options: [
        {label: "전체", value: "ALL"},
        {label: "정상 (ACTIVE)", value: "ACTIVE"},
        {label: "차단됨 (BLOCKED)", value: "BLOCKED"},
      ],
    }
  ];

  const handleSearch = (searchData) => {
    console.log("관리자 유저 검색:", searchData);
  };

  const handleToggleBlock = async (user) => {
    const isBlocking = user.status !== "BLOCKED";
    const actionText = isBlocking ? "차단" : "차단 해제";
    
    const result = await Swal.fire({
      title: `회원 ${actionText}`,
      text: `정말로 ${user.nickname} 회원을 ${actionText}하시겠습니까?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "예",
      cancelButtonText: "아니오",
      customClass: {
        confirmButton: "bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg mx-2",
        cancelButton: "bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg mx-2"
      },
      buttonsStyling: false,
    });

    if (result.isConfirmed) {
      try {
        if (isBlocking) {
          await blockUser(user.id);
        } else {
          await unblockUser(user.id);
        }
        
        Swal.fire({
          title: "완료",
          text: `회원이 성공적으로 ${actionText}되었습니다.`,
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
        
        fetchUsers();
      } catch (error) {
        console.error(`Failed to ${actionText} user:`, error);
        Swal.fire({
          title: "오류",
          text: `회원 ${actionText} 중 오류가 발생했습니다.`,
          icon: "error",
        });
      }
    }
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
              <LoadingSpinner size="large" />
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
                    <td className="p-4 text-gray-600">{user.id}</td>
                    <td className="p-4 font-medium text-gray-700">{user.username}</td>
                    <td className="p-4 font-bold text-blue-gray-900">{user.nickname}</td>
                    <td className="p-4">
                      <StatusBadge status={user.role}/>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={user.status}/>
                    </td>
                    <td className="p-4">
                      <TableActionButtons
                          onDelete={() => handleToggleBlock(user)}
                          deleteLabel="차단"
                          isBlocked={user.status === "BLOCKED"}
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
