import Swal from "sweetalert2";

export const COLORS = {
  blue: "#3B82F6",
  red: "#EF4444",
  green: "#10B981",
  yellow: "#F59E0B",
  gray: "#6B7280",
};

const COLOR_CLASSES = {
  [COLORS.blue]: "bg-blue-600 hover:bg-blue-700 shadow-blue-200",
  [COLORS.red]: "bg-red-600 hover:bg-red-700 shadow-red-200",
  [COLORS.green]: "bg-green-600 hover:bg-green-700 shadow-green-200",
  [COLORS.yellow]: "bg-yellow-600 hover:bg-yellow-700 shadow-yellow-200",
  [COLORS.gray]: "bg-gray-600 hover:bg-gray-700 shadow-gray-200",
};

const commonButtonClasses = "font-bold py-2.5 px-6 rounded-lg mx-2 text-white transition-all shadow-md hover:shadow-lg active:opacity-85 uppercase tracking-wide text-sm";

export const successAlert = (title, text = "") => {
  return Swal.fire({
    icon: "success",
    title: title,
    text: text,
    confirmButtonText: "확인",
    customClass: {
      confirmButton: `${commonButtonClasses} bg-blue-600 hover:bg-blue-700 shadow-blue-200`,
    },
    buttonsStyling: false,
  });
};

export const errorAlert = (title, text = "") => {
  return Swal.fire({
    icon: "error",
    title: title,
    text: text,
    confirmButtonText: "확인",
    customClass: {
      confirmButton: `${commonButtonClasses} bg-red-600 hover:bg-red-700 shadow-red-200`,
    },
    buttonsStyling: false,
  });
};

export const warningAlert = (title, text = "") => {
  return Swal.fire({
    icon: "warning",
    title: title,
    text: text,
    confirmButtonText: "확인",
    customClass: {
      confirmButton: `${commonButtonClasses} bg-yellow-600 hover:bg-yellow-700 shadow-yellow-200`,
    },
    buttonsStyling: false,
  });
};

export const infoAlert = (title, text = "") => {
  return Swal.fire({
    icon: "info",
    title: title,
    text: text,
    confirmButtonText: "확인",
    customClass: {
      confirmButton: `${commonButtonClasses} bg-blue-600 hover:bg-blue-700 shadow-blue-200`,
    },
    buttonsStyling: false,
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
  const confirmClass = COLOR_CLASSES[confirmButtonColor] || "bg-blue-600 hover:bg-blue-700 shadow-blue-200";
  
  return Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    customClass: {
      confirmButton: `${commonButtonClasses} ${confirmClass}`,
      cancelButton: `${commonButtonClasses} bg-gray-500 hover:bg-gray-600 shadow-gray-100`,
    },
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
