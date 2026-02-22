import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {
  Card, CardHeader, CardBody, Typography, Input, Button
} from "@material-tailwind/react";
import Swal from "sweetalert2";

import CommonModal from "../../../components/ui/CommonModal";
import api from "@/api/axiosInstance.js";
import useAuthStore from "@/stores/useAuthStore";

const MyProfileEdit = () => {
  const navigate = useNavigate();

  const {user, logout, updateNickname} = useAuthStore();

  const userId = user?.id || user?.username;

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const handleOpenDelete = () => {
    setOpenDeleteModal(!openDeleteModal);
    setDeletePassword("");
  };

  const [nickname, setNickname] = useState(user?.nickname || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [errors, setErrors] = useState({});

  const validateField = (name, value, allData = {}) => {
    let errorMessage = "";
    switch (name) {
      case "nickname":
        if (value.length > 0) {
          if (!/^[a-zA-Z0-9_]{3,16}$/.test(value)) {
            errorMessage = "3~16자의 영문, 숫자, 언더바(_)만 사용 가능합니다.";
          }
        }
        break;
      case "password":
        if (value.length > 0) {
          const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\-_#.+^=])[A-Za-z\d@$!%*?&\-_#.+^=]{8,}$/;
          if (!passwordRegex.test(value)) {
            errorMessage = "8자 이상, 대/소문자/숫자/특수문자를 모두 포함해야 합니다.";
          }
        }
        break;
      case "confirmPassword":
        if (value.length > 0 || (allData.password && allData.password.length > 0)) {
          if (allData.password !== value) {
            errorMessage = "비밀번호가 일치하지 않습니다.";
          }
        }
        break;
      default:
        break;
    }
    return errorMessage;
  };

  const handleNicknameChange = (e) => {
    const val = e.target.value;
    setNickname(val);
    const errorMsg = validateField("nickname", val);
    setErrors((prev) => ({...prev, nickname: errorMsg}));
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    const errorMsg = validateField("password", val, {password: val, confirmPassword});
    setErrors((prev) => ({...prev, password: errorMsg}));

    if (confirmPassword) {
      const confirmMsg = val !== confirmPassword ? "비밀번호가 일치하지 않습니다." : "";
      setErrors((prev) => ({...prev, confirmPassword: confirmMsg}));
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const val = e.target.value;
    setConfirmPassword(val);
    const errorMsg = validateField("confirmPassword", val, {password, confirmPassword: val});
    setErrors((prev) => ({...prev, confirmPassword: errorMsg}));
  };

  const handleNicknameUpdate = async () => {
    if (!nickname) {
      Swal.fire({icon: "info", title: "안내", text: "변경할 새 닉네임을 입력해주세요.", confirmButtonColor: "#3B82F6"});
      return;
    }
    if (errors.nickname) {
      Swal.fire({icon: "warning", title: "입력 확인", text: "닉네임 형식을 확인해주세요.", confirmButtonColor: "#F59E0B"});
      return;
    }

    try {
      await api.patch(`/users/me/nickname`, {nickname: nickname});

      updateNickname(nickname);

      Swal.fire({icon: "success", title: "성공", text: "닉네임이 성공적으로 변경되었습니다.", confirmButtonColor: "#3B82F6"});

    } catch (error) {
      console.error("닉네임 변경 실패:", error);
      const serverMessage = error.response?.data?.message || "닉네임 변경에 실패했습니다.";
      Swal.fire({icon: "error", title: "실패", text: serverMessage, confirmButtonColor: "#EF4444"});
    }
  };

  const handlePasswordUpdate = async () => {
    if (!password) {
      Swal.fire({icon: "info", title: "안내", text: "변경할 새 비밀번호를 입력해주세요.", confirmButtonColor: "#3B82F6"});
      return;
    }
    if (errors.password || errors.confirmPassword) {
      Swal.fire({icon: "warning", title: "입력 확인", text: "비밀번호 입력 조건을 다시 확인해주세요.", confirmButtonColor: "#F59E0B"});
      return;
    }

    try {
      await api.patch(`/users/me/password`, {password: password});

      Swal.fire({icon: "success", title: "성공", text: "비밀번호가 성공적으로 변경되었습니다.", confirmButtonColor: "#10B981"});

      setPassword("");
      setConfirmPassword("");
      setErrors((prev) => ({...prev, password: "", confirmPassword: ""}));
    } catch (error) {
      console.error("비밀번호 변경 실패:", error);
      const serverMessage = error.response?.data?.message || "비밀번호 변경에 실패했습니다.";
      Swal.fire({icon: "error", title: "실패", text: serverMessage, confirmButtonColor: "#EF4444"});
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      Swal.fire({icon: "warning", title: "입력 필요", text: "본인 확인을 위해 비밀번호를 입력해주세요.", confirmButtonColor: "#F59E0B"});
      return;
    }

    try {
      await api.delete(`/users/me`, {data: {password: deletePassword}});

      Swal.fire({icon: "success", title: "탈퇴 완료", text: "회원 탈퇴가 완료되었습니다.", confirmButtonColor: "#10B981"})
          .then(() => {
            setOpenDeleteModal(false);
            logout();
            navigate("/");
          });
    } catch (error) {
      console.error("탈퇴 실패:", error);
      const serverMessage = error.response?.data?.message || "비밀번호가 틀렸거나 탈퇴에 실패했습니다.";
      Swal.fire({icon: "error", title: "탈퇴 실패", text: serverMessage, confirmButtonColor: "#EF4444"});
    }
  };

  return (
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-none border border-gray-200">
          <CardHeader floated={false} shadow={false} className="rounded-none">
            <Typography variant="h5" color="blue-gray">회원 정보 수정</Typography>
          </CardHeader>

          <CardBody className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <Typography variant="h6" color="blue-gray">닉네임 변경</Typography>
              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 font-medium">새 닉네임</Typography>
                <div className="flex gap-2">
                  <Input
                      size="lg"
                      value={nickname}
                      onChange={handleNicknameChange}
                      error={!!errors.nickname}
                      crossOrigin={undefined}
                  />
                  <Button variant="outlined" size="sm" className="shrink-0">중복 확인</Button>
                </div>
                {errors.nickname &&
                    <Typography variant="small" color="red" className="mt-1 text-xs ml-1 flex items-center gap-1">
                      ⚠️ {errors.nickname}
                    </Typography>
                }
              </div>
              <div className="flex justify-end mt-2">
                <Button variant="gradient" color="blue" onClick={handleNicknameUpdate}>
                  닉네임 변경하기
                </Button>
              </div>
            </div>

            <hr className="border-gray-200"/>

            {/* 2. 비밀번호 변경 섹션 */}
            <div className="flex flex-col gap-4">
              <Typography variant="h6" color="blue-gray">비밀번호 변경</Typography>

              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 font-medium">새 비밀번호</Typography>
                <Input
                    type="password"
                    size="lg"
                    placeholder="변경할 경우에만 입력하세요"
                    value={password}
                    onChange={handlePasswordChange}
                    error={!!errors.password}
                    crossOrigin={undefined}
                />
                {errors.password &&
                    <Typography variant="small" color="red" className="mt-1 text-xs ml-1 flex items-center gap-1">
                      ⚠️ {errors.password}
                    </Typography>
                }
              </div>

              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 font-medium">새 비밀번호 확인</Typography>
                <Input
                    type="password"
                    size="lg"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    error={!!errors.confirmPassword}
                    crossOrigin={undefined}
                />
                {errors.confirmPassword &&
                    <Typography variant="small" color="red" className="mt-1 text-xs ml-1 flex items-center gap-1">
                      ⚠️ {errors.confirmPassword}
                    </Typography>
                }
              </div>

              <div className="flex justify-end mt-2">
                <Button variant="gradient" color="blue" onClick={handlePasswordUpdate}>
                  비밀번호 변경하기
                </Button>
              </div>
            </div>

            <hr className="border-gray-200"/>

            <div className="flex justify-start">
              <Button variant="text" color="red" onClick={handleOpenDelete} className="px-2">
                회원 탈퇴
              </Button>
            </div>
          </CardBody>
        </Card>

        <CommonModal
            open={openDeleteModal}
            handleOpen={handleOpenDelete}
            title="회원 탈퇴"
            size="xs"
            footer={
              <>
                <Button variant="text" color="blue-gray" onClick={handleOpenDelete} className="mr-1">취소</Button>
                <Button variant="gradient" color="red" onClick={handleDeleteAccount}>탈퇴하기</Button>
              </>
            }
        >
          <div className="flex flex-col gap-6 p-4 sm:p-6">
            <Typography className="text-gray-600 font-normal leading-relaxed">
              정말로 탈퇴하시겠습니까? <br/>
              본인 확인을 위해 비밀번호를 입력해주세요.
            </Typography>
            <Input
                label="비밀번호 입력"
                type="password"
                size="lg"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                crossOrigin={undefined}
            />
          </div>
        </CommonModal>
      </div>
  );
};

export default MyProfileEdit;
