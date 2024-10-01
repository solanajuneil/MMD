export const getPhilippinesUTC = (month) => {
    if (!month) {
        throw new Error("Must provide month!");
    }

    // In the Philippines, the time zone is UTC+8 year-round
    const philippinesGMT = "UTC+8";

    return philippinesGMT;
}
