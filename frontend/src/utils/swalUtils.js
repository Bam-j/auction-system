import Swal from "sweetalert2";

export const COLORS = {
  blue: "#3B82F6",
  red: "#EF4444",
  green: "#10B981",
  yellow: "#F59E0B",
  gray: "#6B7280",
};

const commonButtonClasses = "font-bold py-2 px-6 rounded-lg mx-2 text-white";

export const successAlert = (title, text = "") => {
  return Swal.fire({
    icon: "success",
    title: title,
    text: text,
    confirmButtonColor: COLORS.blue,
  });
};

export const errorAlert = (title, text = "") => {
  return Swal.fire({
    icon: "error",
    title: title,
    text: text,
    confirmButtonColor: COLORS.red,
  });
};

export const warningAlert = (title, text = "") => {
  return Swal.fire({
    icon: "warning",
    title: title,
    text: text,
    confirmButtonColor: COLORS.yellow,
  });
};

export const infoAlert = (title, text = "") => {
  return Swal.fire({
    icon: "info",
    title: title,
    text: text,
    confirmButtonColor: COLORS.blue,
  });
};

export const confirmAction = async ({
  title,
  text,
  icon = "question",
  confirmButtonText = "확인",
  cancelButtonText = "취소",
  confirmButtonColor = COLORS.blue,
}) => {
  return Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    customClass: {
      confirmButton: `${commonButtonClasses}`,
      cancelButton: `${commonButtonClasses} bg-gray-500 hover:bg-gray-600`,
    },
    confirmButtonColor,
    buttonsStyling: false,
  });
};

export const confirmDanger = async (title, text, confirmButtonText = "삭제하기") => {
  return confirmAction({
    title,
    text,
    icon: "warning",
    confirmButtonText,
    confirmButtonColor: COLORS.red,
  });
};

export const showLoading = (title = "처리 중...", text = "잠시만 기다려주세요.") => {
  Swal.fire({
    title,
    text,
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

export const closeLoading = () => {
  Swal.close();
};
