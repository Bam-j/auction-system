package com.auction.backend.global.service;

import org.springframework.web.multipart.MultipartFile;
import java.util.concurrent.CompletableFuture;

/**
 * 파일 업로드 처리를 위한 공통 인터페이스
 */
public interface FileService {
    /**
     * 비동기 파일 업로드
     */
    CompletableFuture<String> uploadFileAsync(MultipartFile file);

    /**
     * 동기 파일 업로드
     */
    String uploadFile(MultipartFile file);
    
    /**
     * 파일 삭제 (선택 사항)
     */
    void deleteFile(String fileUrl);
}
