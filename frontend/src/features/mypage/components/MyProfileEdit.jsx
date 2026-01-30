import React, {useState} from "react";
import {
  Card, CardHeader, CardBody, Typography, Input, Button
} from "@material-tailwind/react";
import CommonModal from "../../../components/ui/CommonModal";

const MyProfileEdit = () => {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const handleOpenDelete = () => setOpenDeleteModal(!openDeleteModal);

  const [nickname, setNickname] = useState("현재닉네임");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleUpdate = () => {
    alert("회원 정보가 수정되었습니다.");
  };

  const handleDeleteAccount = () => {
    alert("회원 탈퇴가 완료되었습니다.");
    setOpenDeleteModal(false);
    window.location.href = "/";
  };

  return (
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-none border border-gray-200">
          <CardHeader floated={false} shadow={false} className="rounded-none">
            <Typography variant="h5" color="blue-gray">회원 정보 수정</Typography>
          </CardHeader>

          <CardBody className="flex flex-col gap-6">
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">닉네임</Typography>
              <div className="flex gap-2">
                <Input size="lg" value={nickname} onChange={(e) => setNickname(e.target.value)}/>
                <Button variant="outlined" size="sm" className="shrink-0">중복 확인</Button>
              </div>
            </div>
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">새 비밀번호</Typography>
              <Input type="password" size="lg" placeholder="변경할 경우에만 입력하세요" value={password}
                     onChange={(e) => setPassword(e.target.value)}/>
            </div>
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">새 비밀번호 확인</Typography>
              <Input type="password" size="lg" value={confirmPassword}
                     onChange={(e) => setConfirmPassword(e.target.value)}/>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <Button variant="text" color="red" onClick={handleOpenDelete}>회원 탈퇴</Button>
              <Button variant="gradient" color="blue" onClick={handleUpdate}>변경 사항 저장</Button>
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
                <Button variant="text" color="blue-gray" onClick={handleOpenDelete} className="mr-1">
                  취소
                </Button>
                <Button variant="gradient" color="red" onClick={handleDeleteAccount}>
                  탈퇴하기
                </Button>
              </>
            }
        >
          <div className="flex flex-col gap-4">
            <Typography className="text-gray-600 font-normal">
              정말로 탈퇴하시겠습니까? 본인 확인을 위해 비밀번호를 입력해주세요.
            </Typography>
            <Input label="비밀번호 입력" type="password" size="lg"/>
          </div>
        </CommonModal>
      </div>
  );
};

export default MyProfileEdit;