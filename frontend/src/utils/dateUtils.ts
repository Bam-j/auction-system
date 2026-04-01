/**
 * 날짜 객체 또는 문자열을 'YYYY. M. D. HH:mm' 형식으로 변환합니다.
 */
export const formatDate = (dateInput?: string | Date | null) => {
  if (!dateInput) return '-';
  
  return new Date(dateInput).toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
