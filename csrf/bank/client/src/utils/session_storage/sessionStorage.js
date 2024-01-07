
export const loadAccountId = () => {
    return sessionStorage.getItem("account_id");
};

export const storeAccountId = (accountId) => {
    sessionStorage.setItem("account_id", accountId);
};
