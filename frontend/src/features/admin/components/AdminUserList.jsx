import {useState, useEffect} from "react";

//절대 경로 모듈
import CommonTable from "@/components/ui/CommonTable";
import Pagination from "@/components/ui/Pagination";
import StatusBadge from "@/components/ui/StatusBadge";
import TableActionButtons from "@/components/ui/TableActionButtons";
import EmptyState from "@/components/ui/EmptyState";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import CommonFilterBar from "@/components/ui/CommonFilterBar";
import {successAlert, errorAlert, confirmAction} from "@/utils/swalUtils";
import {
  USER_STATUS_FILTER_CONFIG,
  mapFilterParams
} from "@/constants/filterOptions";

//auth 도메인 내부 api
import {getAllUsers, blockUser, unblockUser} from "../api/adminApi";

const TABLE_HEAD = ["ID", "아이디", "닉네임", "권한", "상태", "관리"];

const AdminUserList = () => {
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({});
  const [sortConfig, setSortConfig] = useState({key: null, direction: null});

  const fetchUsers = async (params = {}) => {
    setIsLoading(true);
    try {
      const response = await getAllUsers(params);
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(searchParams);
  }, []);

  const handleSort = (key, direction) => {
    setSortConfig({key, direction});
  };

  const getSortedUsers = () => {
    if (!sortConfig.key || !sortConfig.direction) {
      return users;
    }

    return [...users].sort((a, b) => {
      let aValue, bValue;
      switch (sortConfig.key) {
        case "ID":
          aValue = a.id;
          bValue = b.id;
          break;
        case "아이디":
          aValue = a.username;
          bValue = b.username;
          break;
        case "닉네임":
          aValue = a.nickname;
          bValue = b.nickname;
          break;
        case "권한":
          aValue = a.role;
          bValue = b.role;
          break;
        case "상태":
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  const sortedUsers = getSortedUsers();

  const userFilters = [
    USER_STATUS_FILTER_CONFIG
  ];

  const handleSearch = (searchData) => {
    const params = mapFilterParams(searchData);
    setSearchParams(params);
    fetchUsers(params);
  };

  const handleToggleBlock = async (user) => {
    const isBlocking = user.status !== "BLOCKED";
    const actionText = isBlocking ? "차단" : "차단 해제";

    const result = await confirmAction({
      title: `회원 ${actionText}`,
      text: `정말로 ${user.nickname} 회원을 ${actionText}하시겠습니까?`,
      icon: "warning",
      confirmButtonText: "예",
      cancelButtonText: "아니오",
    });

    if (result.isConfirmed) {
      try {
        if (isBlocking) {
          await blockUser(user.id);
        } else {
          await unblockUser(user.id);
        }

        successAlert("완료", `회원이 성공적으로 ${actionText}되었습니다.`);
        fetchUsers();
      } catch (error) {
        console.error(`Failed to ${actionText} user:`, error);
        errorAlert("오류", `회원 ${actionText} 중 오류가 발생했습니다.`);
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
              <LoadingSpinner size="large"/>
            </div>
        ) : users.length === 0 ? (
            <EmptyState message="회원이 없습니다."/>
        ) : (
            <CommonTable
                title="전체 회원 관리"
                headers={TABLE_HEAD}
                onSort={handleSort}
                currentSort={sortConfig}
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
              {sortedUsers.map((user) => (
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
