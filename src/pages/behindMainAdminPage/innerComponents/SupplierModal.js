import React, { useState, useEffect } from 'react';
import * as SC from '../goodsAndSuppliersStyling';
import { useTranslation } from 'react-i18next';
import * as Functions from '../../../assest/helpers/api'; // API functions
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa'; 

const SupplierModal = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [supplierData, setSupplierData] = useState({ 
    name: '', 
    phoneNumber: '', 
    email: '', 
    address: '', 
    notes: '' 
  });


  useEffect(() => {
    const generatedId = generateUniqueId();
    setSupplierData((prev) => ({
      ...prev,
      _id: generatedId,
    }));
  }, []);

  const generateUniqueId = () => {
    return `supplier_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleSave = async () => {
    if (!supplierData.name || !supplierData.phoneNumber) {
      window.alert(t('Error') + ': ' + t('All fields are required.'));
      return;
    }

    try {
      const response = await Functions.featchCreateSupplier(supplierData);
      if (response) {
        window.alert(t('Success') + ': ' + t('New supplier added!'));
        setSupplierData({ _id: '', name: '', phoneNumber: '', email: '', notes: '', address: '' });
      } else {
        window.alert(t('Error') + ': ' + t('Failed to save supplier. Please try again.'));
      }
    } catch (error) {
      console.error('Error saving supplier:', error);
      window.alert(t('Error') + ': ' + t('An error occurred while saving the supplier.'));
    }
  };
  
  const handleBack = () => {
    navigate('/goods-and-suppliers');
  };
  return (
    <SC.Container>
      {/* Back Button */}

      <SC.Con>
        <FaArrowLeft
          size={30}
          color="#BF9F00"
          onClick={handleBack}
          style={{ cursor: 'pointer', marginBottom: '10px'}}
        />
      </SC.Con>

      {/* Title */}
      <SC.ModalTitle>{t('Add New Supplier')}</SC.ModalTitle>

      <SC.InnerContainer>
        <SC.InputField
          type="text"
          placeholder={t('Enter supplier name')}
          value={supplierData.name}
          onChange={(e) => setSupplierData({ ...supplierData, name: e.target.value })}
        />
        <SC.InputField
          type="tel"
          placeholder={t('Enter phone number')}
          value={supplierData.phoneNumber}
          onChange={(e) => setSupplierData({ ...supplierData, phoneNumber: e.target.value })}
        />
        <SC.InputField
          type="email"
          placeholder={t('Enter email')}
          value={supplierData.email}
          onChange={(e) => setSupplierData({ ...supplierData, email: e.target.value })}
        />
        <SC.InputField
          type="text"
          placeholder={t('Enter address')}
          value={supplierData.address}
          onChange={(e) => setSupplierData({ ...supplierData, address: e.target.value })}
        />
        <SC.InputField
          placeholder={t('Enter notes')}
          value={supplierData.notes}
          onChange={(e) => setSupplierData({ ...supplierData, notes: e.target.value })}
        />
      </SC.InnerContainer>

        <SC.SaveButton onClick={handleSave}>
          <SC.ButtonText>{t('Save')}</SC.ButtonText>
        </SC.SaveButton>
    </SC.Container>
  );
};

export default SupplierModal;