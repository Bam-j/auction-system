/*
 * 각 제약 조건
 * 아이디: 7자 이상, 영문 대소문자, 숫자
 * 닉네임: 3자 이상 16자 이하, 영문 대소문자, 숫자, 언더바 (마인크래프트 닉네임 제약 조건을 따름)
 * 비밀번호: 8자 이상, 영문 대소문자, 숫자, @$!%*?&\-_#.+^=, 하나씩 포함
 */

export const VALIDATION_PATTERNS: Record<string, RegExp> = {
    username: /^[a-zA-Z0-9]{7,}$/,
    nickname: /^[a-zA-Z0-9_]{3,16}$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\-_#.+^=])[A-Za-z\d@$!%*?&\-_#.+^=]{8,}$/,
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
};

export const VALIDATION_MESSAGES: Record<string, string> = {
    username: "7자 이상, 영문 대소문자와 숫자만 사용 가능합니다.",
    nickname: "3자 이상 16자 이하, 영문과 숫자, 언더바(_)만 사용 가능합니다.",
    password: "8자 이상, 대/소문자/숫자/특수문자를 모두 포함해야 합니다.",
    confirmPassword: "비밀번호가 일치하지 않습니다.",
    email: "유효한 이메일 형식이 아닙니다.",
};

export const validateField = (name: string, value: string, allData: Record<string, string> = {}): string => {
    let errorMessage = "";

    if (!value && name !== "confirmPassword") return "";

    switch (name) {
        case "username":
            if (!VALIDATION_PATTERNS.username.test(value)) {
                errorMessage = VALIDATION_MESSAGES.username;
            }
            break;
        case "nickname":
            if (!VALIDATION_PATTERNS.nickname.test(value)) {
                errorMessage = VALIDATION_MESSAGES.nickname;
            }
            break;
        case "password":
            if (!VALIDATION_PATTERNS.password.test(value)) {
                errorMessage = VALIDATION_MESSAGES.password;
            }
            break;
        case "email":
            if (!VALIDATION_PATTERNS.email.test(value)) {
                errorMessage = VALIDATION_MESSAGES.email;
            }
            break;
        case "confirmPassword":
            const passwordToCompare = allData.password || "";
            if (value || passwordToCompare) {
                if (passwordToCompare !== value) {
                    errorMessage = VALIDATION_MESSAGES.confirmPassword;
                }
            }
            break;
        default:
            break;
    }
    return errorMessage;
};
