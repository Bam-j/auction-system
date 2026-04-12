import Swal, {SweetAlertIcon, SweetAlertResult} from 'sweetalert2';

export const COLORS = {
  blue: '#3B82F6',
  red: '#EF4444',
  green: '#10B981',
  yellow: '#F59E0B',
  gray: '#6B7280',
};

const COLOR_CLASSES: Record<string, string> = {
  [COLORS.blue]: 'bg-blue-600 hover:bg-blue-700 shadow-blue-200',
  [COLORS.red]: 'bg-red-600 hover:bg-red-700 shadow-red-200',
  [COLORS.green]: 'bg-green-600 hover:bg-green-700 shadow-green-200',
  [COLORS.yellow]: 'bg-yellow-600 hover:bg-yellow-700 shadow-yellow-200',
  [COLORS.gray]: 'bg-gray-600 hover:bg-gray-700 shadow-gray-200',
};

const commonButtonClasses = 'font-bold py-2.5 px-6 rounded-lg mx-2 text-white transition-all shadow-md hover:shadow-lg active:opacity-85 uppercase tracking-wide text-sm';

export const successAlert = (title: string, text: string = ''): Promise<SweetAlertResult> => {
  return Swal.fire({
    icon: 'success',
    title: title,
    text: text,
    confirmButtonText: '확인',
    customClass: {
      confirmButton: `${commonButtonClasses} bg-blue-600 hover:bg-blue-700 shadow-blue-200`,
    },
    buttonsStyling: false,
  });
};

export const errorAlert = (title: string, text: string = ''): Promise<SweetAlertResult> => {
  return Swal.fire({
    icon: 'error',
    title: title,
    text: text,
    confirmButtonText: '확인',
    customClass: {
      confirmButton: `${commonButtonClasses} bg-red-600 hover:bg-red-700 shadow-red-200`,
    },
    buttonsStyling: false,
  });
};

export const warningAlert = (title: string, text: string = ''): Promise<SweetAlertResult> => {
  return Swal.fire({
    icon: 'warning',
    title: title,
    text: text,
    confirmButtonText: '확인',
    customClass: {
      confirmButton: `${commonButtonClasses} bg-yellow-600 hover:bg-yellow-700 shadow-yellow-200`,
    },
    buttonsStyling: false,
  });
};

export const infoAlert = (title: string, text: string = ''): Promise<SweetAlertResult> => {
  return Swal.fire({
    icon: 'info',
    title: title,
    text: text,
    confirmButtonText: '확인',
    customClass: {
      confirmButton: `${commonButtonClasses} bg-blue-600 hover:bg-blue-700 shadow-blue-200`,
    },
    buttonsStyling: false,
  });
};

interface ConfirmActionProps {
  title: string;
  text: string;
  icon?: SweetAlertIcon;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonColor?: string;
}

export const confirmAction = async ({
                                      title,
                                      text,
                                      icon = 'question',
                                      confirmButtonText = '확인',
                                      cancelButtonText = '취소',
                                      confirmButtonColor = COLORS.blue,
                                    }: ConfirmActionProps): Promise<SweetAlertResult> => {
  const confirmClass = COLOR_CLASSES[confirmButtonColor] || 'bg-blue-600 hover:bg-blue-700 shadow-blue-200';

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

export const confirmDanger = async (title: string, text: string, confirmButtonText: string = '삭제하기'): Promise<SweetAlertResult> => {
  return confirmAction({
    title,
    text,
    icon: 'warning',
    confirmButtonText,
    confirmButtonColor: COLORS.red,
  });
};

export const showLoading = (title: string = '처리 중...', text: string = '잠시만 기다려주세요.'): void => {
  Swal.fire({
    title,
    text,
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

export const closeLoading = (): void => {
  Swal.close();
};

export const toast = (title: string, icon: SweetAlertIcon = 'success'): Promise<SweetAlertResult> => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });

  return Toast.fire({
    icon: icon,
    title: title
  });
};
