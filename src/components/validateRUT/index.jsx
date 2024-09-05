import React, { useEffect, useState } from 'react';

const Rut = ({ value, onChange, onChangeText, onValid, children }) => {
  const formato = (rut) => {
    if (!rut || typeof rut !== 'string') return false;
    return /^\d{1,2}.\d{3}.\d{3}-[kK\d]$/.test(rut);
  };

  const digitoVerificador = (rut) => {
    let multiplos = [2, 3, 4, 5, 6, 7];
    let digitos = rut.split('-')[0].replace(/\./g, '').split('').reverse();
    let digitoVerificador = rut.split('-')[1]?.toUpperCase();
    let digito = 11 - digitos.reduce((acc, elem, index) => (acc + Number(elem) * multiplos[index % multiplos.length]), 0) % 11;
    let digimap = [NaN, '1', '2', '3', '4', '5', '6', '7', '8', '9', 'K', '0'];
    return digimap[digito] === digitoVerificador;
  };

  const rutValido = (rut) => {
    return formato(rut) && digitoVerificador(rut);
  };

  const reformat = (rutNuevo) => {
    if (rutNuevo === undefined || rutNuevo === null) return '';

    let digitos = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'K', 'k'];
    let digitoValido = (digito) => digitos.includes(digito);

    if (rutNuevo !== '') {
      let chars = rutNuevo.split('').filter(digitoValido);
      if (chars.length > 9) return value || ''; 
      let digito = chars[chars.length - 1];

      if (digitoValido(digito)) {
        [1, 5, 9].forEach(index => {
          if (chars.length > index) {
            chars.splice(chars.length - index, 0, (index === 1) ? '-' : '.');
          }
        });
        return chars.join('').toUpperCase();
      } else {
        return value || '';
      }
    }
    return '';
  };

  const onChangeValue = (e) => {
    if (!e || !e.target) return; 

    const newValue = reformat(e.target.value);
    e.target.value = newValue;

    if (onChange) {
      onChange(e);
    }

    if (onValid) {
      onValid(rutValido(newValue));
    }
  };

  const onChangeTextValue = (rut) => {
    const newValue = reformat(rut);
    if (onChangeText) {
      onChangeText(newValue);
    }
    if (onValid) {
      onValid(rutValido(newValue));
    }
  };

  if (typeof document !== 'undefined') {
    return React.Children.map(children, (child) =>
      React.cloneElement(child, { value: value, onChange: onChangeValue })
    );
  } else if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    return React.Children.map(children, (child) =>
      React.cloneElement(child, { value: value, onChangeText: onChangeTextValue })
    );
  }
};

export default Rut;
