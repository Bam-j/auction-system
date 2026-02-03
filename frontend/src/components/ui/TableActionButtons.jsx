import React from "react";
import {Button, IconButton, Tooltip} from "@material-tailwind/react";
import {EyeIcon, TrashIcon, NoSymbolIcon} from "@heroicons/react/24/outline";

/**
 * 테이블 우측 관리 컬럼에 들어갈 공통 버튼 그룹
 * @param onView - 상세보기 클릭 핸들러 (없으면 아이콘 숨김)
 * @param onDelete - 삭제/차단 클릭 핸들러 (없으면 버튼 숨김)
 * @param deleteLabel - 삭제 버튼 텍스트 (기본값: 삭제)
 * @param isBlocked - (회원관리용) 현재 차단 상태인지 여부
 */
const TableActionButtons = ({
                              onView,
                              onDelete,
                              deleteLabel = "삭제",
                              isBlocked = false
                            }) => {
  return (
      <div className="flex items-center gap-2">
        {onDelete && (
            <Button
                size="sm"
                color={isBlocked ? "green" : "red"}
                variant={isBlocked ? "outlined" : "text"}
                className="whitespace-nowrap px-3"
                onClick={onDelete}
            >
              {isBlocked ? "차단 해제" : deleteLabel}
            </Button>
        )}

        {onView && (
            <Tooltip content="상세 정보 확인">
              <IconButton size="sm" variant="text" color="blue-gray" onClick={onView}>
                <EyeIcon className="h-4 w-4"/>
              </IconButton>
            </Tooltip>
        )}
      </div>
  );
};

export default TableActionButtons;