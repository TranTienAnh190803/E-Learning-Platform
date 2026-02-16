package com.TranTienAnh.CoreService.Configurations;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class StaticResourceConfig implements WebMvcConfigurer {

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Cho phép truy cập đường dẫn upload/avatar (public đường dẫn)
        registry.addResourceHandler("/uploads/avatar/**")
                .addResourceLocations("file:" + uploadDir + "/avatar/");

        registry.addResourceHandler("/uploads/course/**")
                .addResourceLocations("file:" + uploadDir + "/course/");

        registry.addResourceHandler("/uploads/lesson/**")
                .addResourceLocations("file:" + uploadDir + "/lesson/");
    }
}
