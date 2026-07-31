package com.ecommerce.service;

import com.ecommerce.exception.BadRequestException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Objects;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path rootLocation;

    public FileStorageService(@Value("${app.file.upload-dir:./uploads}") String uploadDir) {
        this.rootLocation = Paths.get(uploadDir);
        try {
            if (!Files.exists(rootLocation)) {
                Files.createDirectories(rootLocation);
            }
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize storage location", e);
        }
    }

    public String storeFile(MultipartFile file) {
        String filename = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        try {
            if (file.isEmpty()) {
                throw new BadRequestException("Failed to store empty file " + filename);
            }
            if (filename.contains("..")) {
                throw new BadRequestException("Cannot store file with relative path outside current directory " + filename);
            }
            String extension = "";
            int i = filename.lastIndexOf('.');
            if (i > 0) {
                extension = filename.substring(i);
            }
            String newFilename = UUID.randomUUID().toString() + extension;
            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, this.rootLocation.resolve(newFilename), StandardCopyOption.REPLACE_EXISTING);
            }
            return "/uploads/" + newFilename;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file " + filename, e);
        }
    }
}
