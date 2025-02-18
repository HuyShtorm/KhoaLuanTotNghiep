package com.example.projectfinal.util;

import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

import java.util.List;
import java.util.stream.Collectors;

public class MapperUtil {

    public static ModelMapper getInstance() {
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.getConfiguration()
                .setMatchingStrategy(MatchingStrategies.STRICT);
        return modelMapper;
    }

    public static <D> D mapObject(Object source, Class<D> destinationClass) {
        return getInstance().map(source, destinationClass);
    }

    public static <T, U> List<U> mapObjectList(List<T> sourceList, Class<U> destinationClass) {
        return sourceList.stream()
                .map(source -> mapObject(source, destinationClass))
                .collect(Collectors.toList());
    }
    public static <T,R> Page<R> mapPage(Page<T> source, Class<R> destinationClass) {
        List<R> data = source.getContent().stream()
                .map(item -> MapperUtil.mapObject(item, destinationClass)).collect(Collectors.toList());
        return new PageImpl<>(data, source.getPageable(), source.getTotalElements());
    }
}
