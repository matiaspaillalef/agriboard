export const formatNumber = (value) => {
    if (typeof value === 'number') {
        const hasDecimals = value % 1 !== 0;
        return hasDecimals ? value.toLocaleString('es-CL', { minimumFractionDigits: 1, maximumFractionDigits: 2 }) : value.toLocaleString('es-CL');
    }
    return value;
};