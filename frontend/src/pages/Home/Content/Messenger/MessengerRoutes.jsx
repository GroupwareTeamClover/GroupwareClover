import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ChatMain } from './ChatMain';


const MessengerRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ChatMain />} />
    </Routes>
  );
};

export default MessengerRoutes;