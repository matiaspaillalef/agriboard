'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import LogoNormal from "@/assets/img/layout/agrisoft_logo.png";
import LogoDark from "@/assets/img/layout/agrisoft_logo_dark.png";
import { getDataCompanies } from "@/app/api/ConfiguracionApi";

import { PencilSquareIcon } from '@heroicons/react/24/outline';

function CustomImage ({ imagenPorDefecto }) {
  const [imagenUsuario, setImagenUsuario] = useState(null);
  const [company, setCompany] = useState(null);

  const userDataString = sessionStorage.getItem("userData");
  const userData = JSON.parse(userDataString);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const dataCompanies = await getDataCompanies();
        const data = dataCompanies.find((company) => company.id === userData.idCompany);
        data.logo && setImagenUsuario('/' + data.logo.replace("public/", ""));
        setCompany(data);
      } catch (error) {
        console.error("Error fetching company:", error);
      }
    };

    fetchCompany();
  }, );

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
      <div className="mt-1 ml-1 bg-white shadow-3xl shadow-shadow-500 p-7 rounded-xl max-h-[350px] max-w-[350px] min-h-[150px] min-w-[150px] flex justify-center items-center">
        <Image src={imagenUsuario ? imagenUsuario : LogoNormal} alt="Agrisoft" width={249} height={241} priority className='object-cover max-h-[100px] min-w-[100px]'/>
      </div>
    </div>
  );
}

export default CustomImage;
