package com.TranTienAnh.CoreService.Configurations;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfiguration {
    @Value("${client.url}")
    private String clientUrl;

    @Value("realtime.service.url")
    private String realTimeServiceUrl;

    @Bean
    public WebMvcConfigurer webMvcConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins(clientUrl, realTimeServiceUrl)
                        .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "HEAD");
            }
        };
    }
}
