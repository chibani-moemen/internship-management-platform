package tn.iset.rades.internship_backend.model;

public enum RequestStatus {
    PENDING,           // student بعث
    COMPANY_ACCEPTED,  // company قبلت
    COMPANY_REJECTED,  // company رفضت
    ISET_APPROVED,     // admin وافق نهائي
    ISET_REJECTED      // admin رفض نهائي
}

