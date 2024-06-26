"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { firebaseConfig } from "./firebaseConfig"; // Adjust the import path as necessary
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NumericFormat } from "react-number-format";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const HomePage: React.FC = () => {
  const [selectedCurrency, setSelectedCurrency] = useState<string>("SAR");
  const [loading, setLoading] = useState(true);
  const [exchangeRates, setExchangeRates] = useState({
    AEDfx: 0,
    KWDfx: 0,
    SARfx: 0,
  });
  const [ziinaConfig, setZiinaConfig] = useState<{ apiKey: string }>({
    apiKey: "",
  });
  const [amount, setAmount] = useState<number | null>(null);
  const [formattedAmount, setFormattedAmount] = useState<string>("");
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "appData", "appData");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setExchangeRates({
          AEDfx: data.AEDfx,
          KWDfx: data.KWDfx,
          SARfx: data.SARfx,
        });
        setZiinaConfig(data.ziinaConfig);
      } else {
        console.log("No such document!");
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleCurrencySelect = (currency: string) => {
    setSelectedCurrency(currency);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoadingSubmit(true);
    if (amount && selectedCurrency) {
      let conversionRate = 0;
      let currencyCode = "";
      switch (selectedCurrency) {
        case "AED":
          conversionRate = exchangeRates.AEDfx;
          currencyCode = "AED";
          break;
        case "KWD":
          conversionRate = exchangeRates.KWDfx;
          currencyCode = "USD";
          break;
        case "SAR":
          conversionRate = exchangeRates.SARfx;
          currencyCode = "SAR";
          break;
      }

      const conversionAmount = amount * conversionRate;
      let amountInFils;
      if (selectedCurrency === "KWD") {
        amountInFils = conversionAmount * 100;
      } else {
        amountInFils = conversionAmount * 100;
      }

      // API call to Ziina
      const response = await fetch(
        "https://api-v2.ziina.com/api/payment_intent",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${ziinaConfig.apiKey}`,
          },
          body: JSON.stringify({
            amount: amountInFils,
            currency_code: currencyCode,
            message: `Payment amount of ${formattedAmount} to ECHO Prive`,
            success_url: "https://pay.echo-club.com/success",
            cancel_url: "https://pay.echo-club.com/failure",
            test: false,
          }),
        }
      );

      const result = await response.json();
      if (result.redirect_url) {
        window.location.href = result.redirect_url;
      } else {
        toast.error("Failed to create payment link");
      }
    }
    setLoadingSubmit(false);
  };

  const handleAmountChange = (values: any) => {
    const { value, formattedValue } = values;
    setAmount(Number(value));
    setFormattedAmount(formattedValue);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div
      className="relative flex items-center justify-center h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url('https://echo-club.com/assets/images/bg.jpg')",
      }}
    >
      <ToastContainer />
      <div className="flex flex-col items-center justify-center p-4 bg-black bg-opacity-70 rounded-lg shadow-md">
        <Image
          src="https://echo-club.com/assets/images/image06.png?v=4992636c"
          alt="Echo Club Logo"
          width={200}
          height={200}
        />
        <form onSubmit={handleSubmit} className="mt-4 space-y-4 w-full">
          <div className="relative">
            <NumericFormat
              thousandSeparator={true}
              placeholder="Amount"
              className="p-2 w-full border rounded-md text-black pr-12"
              inputMode="numeric"
              onValueChange={handleAmountChange}
            />
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
              EGP
            </span>
          </div>
          <div className="flex justify-center space-x-4 mt-4">
            <div
              onClick={() => handleCurrencySelect("SAR")}
              className={`flex flex-col items-center cursor-pointer p-2 border rounded-md ${
                selectedCurrency === "SAR"
                  ? "border-blue-500"
                  : "border-transparent"
              }`}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Flag_of_Saudi_Arabia.svg/1599px-Flag_of_Saudi_Arabia.svg.png"
                alt="SAR"
                className="w-8 h-8"
              />
              <span>SAR</span>
            </div>
            <div
              onClick={() => handleCurrencySelect("KWD")}
              className={`flex flex-col items-center cursor-pointer p-2 border rounded-md ${
                selectedCurrency === "KWD"
                  ? "border-blue-500"
                  : "border-transparent"
              }`}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/a/aa/Flag_of_Kuwait.svg"
                alt="KWD"
                className="w-8 h-8"
              />
              <span>KWD</span>
            </div>
            <div
              onClick={() => handleCurrencySelect("AED")}
              className={`flex flex-col items-center cursor-pointer p-2 border rounded-md ${
                selectedCurrency === "AED"
                  ? "border-blue-500"
                  : "border-transparent"
              }`}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/c/cb/Flag_of_the_United_Arab_Emirates.svg"
                alt="AED"
                className="w-8 h-8"
              />
              <span>AED</span>
            </div>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-bold text-black bg-white rounded-md hover:bg-gray-200"
            disabled={loadingSubmit}
          >
            {loadingSubmit ? (
              <div className="flex items-center justify-center">
                <svg
                  className="w-5 h-5 mr-3 -ml-1 text-black animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Processing...
              </div>
            ) : (
              "Pay"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default HomePage;
