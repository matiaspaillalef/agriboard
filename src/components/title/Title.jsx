import React from 'react';

const Title = ({ type, classes, text }) => {
  // Verifica que el tipo esté dentro del rango de h1 a h6
  const validTypes = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  const titleTag = validTypes.includes(type) ? type : 'h4';

  return (
    React.createElement(
      titleTag,
      { className: classes || '' },
      text
    )
  );
};

export default Title;