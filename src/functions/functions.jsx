export const formatNumber = (value) => {
    if (typeof value === 'number') {
        // Verifica si el número tiene decimales
        const hasDecimals = value % 1 !== 0;

        // Formatea el número según corresponda
        return value.toLocaleString('es-CL', { 
            minimumFractionDigits: hasDecimals ? 1 : 0, 
            maximumFractionDigits: hasDecimals ? 2 : 0 
        });
    }
    return value;
};