export const formatDate = (value?: string | null, withTime = false) => {
    if (!value) return "-";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";

    return new Intl.DateTimeFormat("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        ...(withTime && { hour: "2-digit", minute: "2-digit" }),
    }).format(date);
};

export const parseRentalDueDate = (value: string) => {
    const endDate = value.split("~").at(-1)?.trim().replace(/\./g, "-");
    if (!endDate || !/^\d{4}-\d{2}-\d{2}$/.test(endDate)) return null;

    const date = new Date(`${endDate}T23:59:59`);
    return Number.isNaN(date.getTime()) ? null : date;
};
