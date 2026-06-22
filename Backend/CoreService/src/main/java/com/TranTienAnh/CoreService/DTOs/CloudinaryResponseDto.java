package com.TranTienAnh.CoreService.DTOs;

public class CloudinaryResponseDto {
    private String contentUrl;

    private String publicId;

    public CloudinaryResponseDto() {
    }

    public CloudinaryResponseDto(String contentUrl, String publicId) {
        this.contentUrl = contentUrl;
        this.publicId = publicId;
    }

    public String getContentUrl() {
        return contentUrl;
    }

    public void setContentUrl(String contentUrl) {
        this.contentUrl = contentUrl;
    }

    public String getPublicId() {
        return publicId;
    }

    public void setPublicId(String publicId) {
        this.publicId = publicId;
    }
}
