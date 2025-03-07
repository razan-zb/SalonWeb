import React, { useState, useEffect } from 'react';
import * as SC from './adminSettingsPageStyling'; // Import styled-components
import { useTranslation } from 'react-i18next';
import * as Functions from '../../assest/helpers/api';
import { FaArrowLeft } from 'react-icons/fa'; 
import { useNavigate } from 'react-router-dom';

const AdminSettingsPage = ({ history }) => {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const [timeSlots, setTimeSlots] = useState({
    0: { start: '', end: '' },  // Sunday
    1: { start: '', end: '' },  // Monday
    2: { start: '', end: '' },  // Tuesday
    3: { start: '', end: '' },  // Wednesday
    4: { start: '', end: '' },  // Thursday
    5: { start: '', end: '' },  // Friday
    6: { start: '', end: '' },  // Saturday
  });

  // Fetch user data and time slots
  useEffect(() => {
    const fetchTimeSlots = async () => {
      try {
        const userData = await Functions.fetchUserData('munabathesh@gmail.com');
        setUser(userData);
        if (userData?.timeSlots) {
          const formattedSlots = formatTimeSlots(userData.timeSlots);
          setTimeSlots((prev) => ({ ...prev, ...formattedSlots }));
        }
      } catch (error) {
        console.error('Error fetching time slots:', error);
        alert(t('Error: Failed to fetch time slots.'));
      }
    };

    fetchTimeSlots();
  }, [t]);

  // Convert API format to state format
  const formatTimeSlots = (slotsArray) => {
    const formattedSlots = {};
    slotsArray.forEach((slot) => {
      formattedSlots[slot.day] = { start: slot.startTime, end: slot.endTime };
    });
    return formattedSlots;
  };

  // Change language function
  const changeLanguage = async (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
    window.location.reload(); // Refresh to apply RTL/LTR changes
  };

  const handleBack = () => {
    navigate(-1)
  };
  // Save time slots
  const handleSaveTimeSlots = async () => {
    const formattedTimeSlots = Object.entries(timeSlots).map(([day, slot]) => ({
      day: parseInt(day),
      startTime: slot.start,
      endTime: slot.end,
    }));

    const updatedUser = {
      ...user,
      timeSlots: formattedTimeSlots,
    };

    setUser(updatedUser);
    try {
      const response = await Functions.fetchUpdateUser(updatedUser);
      if (response) {
        alert(t('Success: Time slots updated successfully.'));
      } else {
        alert(t('Error: Failed to update time slots.'));
      }
    } catch (error) {
      console.error('Error updating time slots:', error);
      alert(t('Error: An error occurred while updating time slots.'));
    }
  };



  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
  
    if (confirmLogout) {
      localStorage.removeItem('authToken'); // Remove authentication token
      history.push('/login'); // Navigate to login page
    }
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
      
      {/* Page Title */}
      <SC.Title>{t('Admin Settings')}</SC.Title>

      {/* Language Selection */}
      <SC.SectionTitle>{t('Change Language')}</SC.SectionTitle>
      <SC.ButtonContainer>
        <SC.LanguageButton onClick={() => changeLanguage('en')}>
          <SC.ButtonText>English</SC.ButtonText>
        </SC.LanguageButton>
        <SC.LanguageButton onClick={() => changeLanguage('ar')}>
          <SC.ButtonText>العربية</SC.ButtonText>
        </SC.LanguageButton>
        <SC.LanguageButton onClick={() => changeLanguage('he')}>
          <SC.ButtonText>עברית</SC.ButtonText>
        </SC.LanguageButton>
      </SC.ButtonContainer>

      {/* Time Slots Configuration */}
      <SC.SectionTitle>{t('Set Working Hours')}</SC.SectionTitle>
      <SC.TimeSlotContainer>
        {Object.keys(timeSlots).map((day) => (
          <div key={day} style={{ marginBottom: '15px' }}>
            <SC.Label>{t(`Day ${day}`)}</SC.Label>
            <SC.InputField
              type="text"
              placeholder={t('Start Time (e.g., 09:00)')}
              value={timeSlots[day].start}
              onChange={(e) => setTimeSlots({ ...timeSlots, [day]: { ...timeSlots[day], start: e.target.value } })}
            />
            <SC.InputField
              type="text"
              placeholder={t('End Time (e.g., 17:00)')}
              value={timeSlots[day].end}
              onChange={(e) => setTimeSlots({ ...timeSlots, [day]: { ...timeSlots[day], end: e.target.value } })}
            />
          </div>
        ))}
      </SC.TimeSlotContainer>

      <SC.ButtonsContainer>
        <SC.Button onClick={handleSaveTimeSlots}>
          <SC.ButtonText>{t('Save Changes')}</SC.ButtonText>
        </SC.Button>

        {/* Logout Button */}
        <SC.LogoutButton onClick={handleLogout}>
          <SC.ButtonText>{t('Log Out')}</SC.ButtonText>
        </SC.LogoutButton>
      </SC.ButtonsContainer>
     
    </SC.Container>
  );
};

export default AdminSettingsPage;