package com.auction.backend.global.utils;

public class SearchParamParser {

    //"ALL" 또는 빈 문자열을 파싱 및 ENUM으로 변환
    public static <T extends Enum<T>> T parseEnum(Class<T> enumType, String value) {
        if (value == null || value.isEmpty() || value.equalsIgnoreCase("ALL")) {
            return null;
        }
        try {
            return Enum.valueOf(enumType, value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    //빈 문자열 null 반환
    public static String parseString(String value) {
        if (value == null || value.isEmpty() || value.equalsIgnoreCase("ALL")) {
            return null;
        }
        return value;
    }
}
