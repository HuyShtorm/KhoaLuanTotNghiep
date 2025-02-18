package com.example.projectfinal.Entity;

import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.MappedSuperclass;
import java.time.LocalDate;
import java.util.Date;

@Getter
@Setter
@MappedSuperclass
public class BaseEntity {
    private String updateBy;
    @CreationTimestamp
    private LocalDate createdAt;
    @UpdateTimestamp
    private LocalDate updateAt;
}
