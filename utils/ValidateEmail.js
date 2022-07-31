export const validateEmail = value => {
    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const isValid = pattern.test(String(value).toLowerCase());
    return isValid;
};

export const validateName = value => {
    const pattern = /^[a-zA-Z ]+$/;
    const isValid = pattern.test(String(value).toLowerCase());
    return isValid;
};

export const validateWeight = value => {
    const pattern = /^-?((0(\.[0-9]+)?)|([1-9]+[0-9]*(\.[0-9]+)?))$/;
    const isValid = pattern.test(String(value).toLowerCase());
    return isValid;
};