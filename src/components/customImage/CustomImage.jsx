'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import LogoNormal from "@/assets/img/layout/agrisoft_logo.png";
import LogoDark from "@/assets/img/layout/agrisoft_logo_dark.png";

import { PencilSquareIcon } from '@heroicons/react/24/outline';

function CustomImage ({ imagenPorDefecto }) {
  const [imagenUsuario, setImagenUsuario] = useState(null);

  const handleImagenChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onloadend = () => {
      setImagenUsuario(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="mx-[80px] mt-[50px] flex items-center relative">
      <div className="mt-1 ml-1 bg-lightPrimary bg-white shadow-3xl shadow-shadow-500 p-7 rounded-xl max-h-[350px] max-w-[350px] ">
        <Image src={imagenUsuario || LogoNormal} alt="Agrisoft" width={249} height={241} priority className='object-cover max-h-[100px] min-w-[100px]'/>
      </div>
      <div className="absolute bottom-[-10px] right-[-10px] bg-navy-600 dark:bg-navy-900 rounded-md p-1">
        <label htmlFor="imagenInput" className="cursor-pointer">
          <PencilSquareIcon className="h-4 w-4 text-white" />
        </label>
        <input id="imagenInput" type="file" className="hidden" onChange={handleImagenChange} accept="image/png, image/jpg, image/jpeg" />
      </div>
    </div>
  );
}

export default CustomImage;
