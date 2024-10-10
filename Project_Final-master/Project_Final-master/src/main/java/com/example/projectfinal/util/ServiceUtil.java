package com.example.projectfinal.util;

import java.text.Normalizer;
import java.util.regex.Pattern;

public class ServiceUtil {
    private ServiceUtil() {
    }

    public static String convertToTextSearch(String s) {
        String temp = Normalizer.normalize(s, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        temp = pattern.matcher(temp).replaceAll("");
        return temp.replaceAll("đ", "d").toLowerCase();
    }
}
