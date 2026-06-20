package com.TranTienAnh.CoreService.Forms;

public class Events<T> {
    private String eventName;

    private T message;

    public Events() {
    }

    public Events(String eventName, T message) {
        this.eventName = eventName;
        this.message = message;
    }

    public String getEventName() {
        return eventName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public T getMessage() {
        return message;
    }

    public void setMessage(T message) {
        this.message = message;
    }
}
