import { useState } from 'react'
import bg from "./assets/bg.webp";
import EcoCalculator from './EcoCalculator';

function App() {

  return (
    <div
      className="min-h-screen w-full bg-fixed bg-top bg-no-repeat bg-cover flex justify-center items-center"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundColor: "#d2c09e",
        fontSize: "9pt",
        fontFamily: "Verdana, Arial, sans-serif",
        margin: 0,
        padding: "0 0 35px",
      }}
    >
      <div
        className='bg-[#e3d5b3] border border-[#7d510f]'
        style={
          {
            boxShadow: "1px 1px 2px 1px rgba(60, 30, 0, 0.2)"
          }
        }
      >
        <div
          className='bg-[#f4e4bc] border border-[#7d510f]  m-4'
          style={
            {
              boxShadow: "1px 1px 2px 1px rgba(60, 30, 0, 0.2)"
            }
          }
        >
          <h1 className='text-[16pt] font-bold text-black p-2'>Plemiona Tracker</h1>
          <EcoCalculator />
        </div>
      </div>

    </div>
  );
}

export default App
