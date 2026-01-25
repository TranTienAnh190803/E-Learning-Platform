package com.TranTienAnh.CoreService.Models.Enums;

public enum AccountStatus {
    ACTIVE(0),
    PENDING(1),
    DISABLE(2);

    private final int value;

    AccountStatus(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }
}
