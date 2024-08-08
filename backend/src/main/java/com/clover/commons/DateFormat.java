package com.clover.commons;

import org.springframework.stereotype.Component;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.temporal.TemporalAdjusters;
import java.time.format.DateTimeFormatter;

@Component
public class DateFormat {

    public String[] getWeekRange(){

        LocalDate today = LocalDate.now();

        LocalDate startOfWeek = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.SUNDAY));
        LocalDate endOfWeek = today.with(TemporalAdjusters.nextOrSame(DayOfWeek.SATURDAY));

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        String start = startOfWeek.format(formatter);
        String end = endOfWeek.format(formatter);

        return new String[]{start, end} ;
    }

    public String[] getMonthRange(String selectMonth){
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM");
        YearMonth yearMonth = YearMonth.parse(selectMonth, formatter);

        // Get the first and last day of the month
        String firstDay = yearMonth.atDay(1).toString(); // "yyyy-MM-dd" format
        String lastDay = yearMonth.atEndOfMonth().toString(); // "yyyy-MM-dd" format

        return new String[] { firstDay, lastDay };
    }

}
