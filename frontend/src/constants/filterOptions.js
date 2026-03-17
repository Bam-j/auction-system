export const CATEGORY_OPTIONS = [
  {label: "전체", value: "ALL"},
  {label: "무기", value: "WEAPON"},
  {label: "방어구", value: "ARMOR"},
  {label: "도구", value: "TOOL"},
  {label: "치장품", value: "COSMETIC"},
  {label: "칭호", value: "TITLE"},
  {label: "블록", value: "BLOCK"},
  {label: "레드스톤 장치", value: "REDSTONE_DEVICES"},
  {label: "광석", value: "ORE"},
  {label: "성장 재화", value: "GROWTH_GOODS"},
  {label: "기타", value: "ETC"},
];

export const STATUS_OPTIONS = [
  {label: "전체", value: "ALL"},
  {label: "판매중", value: "FIXED_SALES"},
  {label: "경매중", value: "AUCTION"},
  {label: "즉시구매완료", value: "INSTANT_BUY"},
  {label: "판매완료", value: "SOLD_OUT"},
];

export const BID_STATUS_OPTIONS = [
  {label: "전체", value: "ALL"},
  {label: "진행 중", value: "BIDDING"},
  {label: "낙찰", value: "SUCCESS"},
  {label: "패찰", value: "FAILED"},
];

export const PURCHASE_REQUEST_STATUS_OPTIONS = [
  {label: "전체", value: "ALL"},
  {label: "대기중", value: "PENDING"},
  {label: "승인됨", value: "APPROVED"},
  {label: "거절됨", value: "REJECTED"},
];

export const SEARCH_TYPE_OPTIONS = [
  {label: "전체", value: "ALL"},
  {label: "상품명", value: "productName"},
  {label: "판매자", value: "seller"},
];

export const ADMIN_SEARCH_TYPE_OPTIONS = [
  {label: "전체", value: "ALL"},
  {label: "상품명", value: "productName"},
  {label: "요청자", value: "requester"},
  {label: "판매자", value: "seller"},
];

export const BIDDER_SELLER_SEARCH_TYPE_OPTIONS = [
  {label: "전체", value: "ALL"},
  {label: "상품명", value: "productName"},
  {label: "판매자", value: "seller"},
  {label: "입찰자", value: "bidder"},
];

export const BUYER_SELLER_SEARCH_TYPE_OPTIONS = [
  {label: "전체", value: "ALL"},
  {label: "상품명", value: "productName"},
  {label: "판매자", value: "seller"},
  {label: "요청자", value: "buyer"},
];

export const PRODUCT_ADMIN_SEARCH_TYPE_OPTIONS = [
  {label: "전체", value: "ALL"},
  {label: "상품명", value: "productName"},
  {label: "등록자", value: "registrant"},
];

export const MY_SALES_SEARCH_TYPE_OPTIONS = [
  {label: "전체", value: "ALL"},
  {label: "상품명", value: "productName"},
  {label: "구매자", value: "buyer"},
];

export const USER_ADMIN_SEARCH_TYPE_OPTIONS = [
  {label: "전체", value: "ALL"},
  {label: "닉네임", value: "nickname"},
  {label: "아이디", value: "username"},
  {label: "이메일", value: "email"},
];

export const CATEGORY_FILTER_CONFIG = {
  id: "category",
  label: "카테고리",
  options: CATEGORY_OPTIONS,
};

export const STATUS_FILTER_CONFIG = {
  id: "status",
  label: "상태",
  options: STATUS_OPTIONS,
};

export const SALE_METHOD_FILTER_CONFIG = {
  id: "status",
  label: "판매 방식",
  options: STATUS_OPTIONS,
};

export const BID_STATUS_FILTER_CONFIG = {
  id: "status",
  label: "상태",
  options: BID_STATUS_OPTIONS,
};

export const PURCHASE_REQUEST_STATUS_FILTER_CONFIG = {
  id: "status",
  label: "상태",
  options: PURCHASE_REQUEST_STATUS_OPTIONS,
};

export const USER_STATUS_OPTIONS = [
  {label: "전체", value: "ALL"},
  {label: "정상", value: "ACTIVE"},
  {label: "탈퇴함", value: "DELETED"},
  {label: "차단됨", value: "BLOCKED"},
];

export const USER_STATUS_FILTER_CONFIG = {
  id: "status",
  label: "계정 상태",
  options: USER_STATUS_OPTIONS,
};

export const SEARCH_TYPE_FILTER_CONFIG = {
  id: "searchType",
  label: "검색 분류",
  options: SEARCH_TYPE_OPTIONS,
};

export const ADMIN_SEARCH_TYPE_FILTER_CONFIG = {
  id: "searchType",
  label: "검색 분류",
  options: ADMIN_SEARCH_TYPE_OPTIONS,
};

export const USER_ADMIN_SEARCH_TYPE_FILTER_CONFIG = {
  id: "searchType",
  label: "검색 분류",
  options: USER_ADMIN_SEARCH_TYPE_OPTIONS,
};

export const BIDDER_SELLER_SEARCH_TYPE_FILTER_CONFIG = {
  id: "searchType",
  label: "검색 분류",
  options: BIDDER_SELLER_SEARCH_TYPE_OPTIONS,
};

export const BUYER_SELLER_SEARCH_TYPE_FILTER_CONFIG = {
  id: "searchType",
  label: "검색 분류",
  options: BUYER_SELLER_SEARCH_TYPE_OPTIONS,
};

export const PRODUCT_ADMIN_SEARCH_TYPE_FILTER_CONFIG = {
  id: "searchType",
  label: "검색 분류",
  options: PRODUCT_ADMIN_SEARCH_TYPE_OPTIONS,
};

export const MY_SALES_SEARCH_TYPE_FILTER_CONFIG = {
  id: "searchType",
  label: "검색 분류",
  options: MY_SALES_SEARCH_TYPE_OPTIONS,
};

export const mapFilterParams = (searchData) => {
  const params = { ...searchData };
  Object.keys(params).forEach(key => {
    if (params[key] === "ALL") {
      params[key] = "";
    }
  });
  return params;
};
