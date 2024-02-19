"use client";
 
import React, { use } from 'react'
 
import { useState, useEffect } from "react";
 
import database from "@/app/_utility/lib/database"
import { Vote } from "@/app/_utility/models/vote"
import { Voter } from "@/app/_utility/models/voter"
 
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import candidates from '@/app/_utility/constants/candidates'
 
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
 
const ResultsPage = () => {
 
  const [votes, setVotes] = useState<Vote[]>([]);
  const [voters, setVoters] = useState<Voter[]>([]);
 
  useEffect(() => {
    fetchVotes();
    fetchVoters();
  }, []);
 
  async function fetchVotes() {
    const votes = await database.getVotes();
    setVotes(votes);
  }
 
  async function fetchVoters() {
    const voters = await database.getVoters();
    setVoters(voters)
  }
 
  const getTotalVotes = () => {
    return votes.length;
  }
 
  //getVotes by candidate
  const getVotesByParty = () => {
    const cIds: { [key: string]: number } = {}; // Add index signature to allow indexing with a string
    for (const { candidateId } of votes) { // Access 'votes' state variable
      cIds[candidateId] = (cIds[candidateId] || 0) + 1;
    }
    return cIds; // Return the calculated result
  }
 
  const getPercentageOfVotesByParty = () => {
    const totalVotes = getTotalVotes();
    const votesByParty = getVotesByParty();
    const percentageByParty: { [key: string]: number } = {};
 
    for (const candidateId in votesByParty) {
      percentageByParty[candidateId] = (votesByParty[candidateId] / totalVotes) * 100;
    }
 
    return percentageByParty;
  }
 
 
 
 
 
  const getVotesByProvince = () => {
    const provinceIds: { [key: string]: number } = {}; // Add index signature to allow indexing with a string
    for (const { voter } of votes) { // Access 'votes' state variable
      provinceIds[voter.province] = (provinceIds[voter.province] || 0) + 1;
    }
    return provinceIds; // Return the calculated result
  }
 
  const getVotesByPartyAndProvince = () => {
    const partyAndProvinceIds: { [key: string]: { [key: string]: number } } = {}; // Add index signature to allow indexing with a string
    for (const { candidateId, voter } of votes) { // Access 'votes' state variable
      partyAndProvinceIds[candidateId] = partyAndProvinceIds[candidateId] || {};
      partyAndProvinceIds[candidateId][voter.province] = (partyAndProvinceIds[candidateId][voter.province] || 0) + 1;
    }
    return partyAndProvinceIds; // Return the calculated result
  }
 
  const getBarChartDataAndOptionsForStacked = () => {
    const parties = Object.keys(getVotesByPartyAndProvince());
    const partyList = parties.map(index => candidates[index - 1]?.candName);
    const provinces = new Set(); // Using a set to collect unique provinces
    parties.forEach((partyId) => {
      Object.keys(getVotesByPartyAndProvince()[partyId]).forEach((province) => {
        provinces.add(province); // Add province to set
      });
    });
    const uniqueProvinces = Array.from(provinces); // Convert set to array
    const colors = [
      'rgba(255, 99, 132, 0.2)',
      'rgba(54, 162, 235, 0.2)',
      'rgba(255, 206, 86, 0.2)',
    ]; // Define your own color scheme or use Chart.js built-in color schemes
 
    const colorMap = {}; // Map to store colors for each province
    uniqueProvinces.forEach((province, index) => {
      colorMap[province] = colors[index % colors.length]; // Assign color to province
    });

 
    
 
    const data = {
      labels: partyList,
      datasets: uniqueProvinces.map((province) => ({
        label: province,
        data: parties.map((partyId) => getVotesByPartyAndProvince()[partyId][province] || 0), // Fill in 0 for parties with no presence in the province
        backgroundColor: parties.map((partyId) => colorMap[province]), // Use color from color map
        borderColor: 'rgba(0, 0, 0, 1)', // Border color for bars
        borderWidth: 1,
      })),
    };
 
    const options = {
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              const totalVotes = getTotalVotes();
              const dataIndex = context.dataIndex;
              const value = context.dataset.data[dataIndex];
              const percentage = ((value / totalVotes) * 100).toFixed(2);
              return `${context.dataset.label}: ${value} (${percentage}%)`;
            }
          }
        }
      }
    };
 
    return { data, options };
  };
 
 
  const getBarChartDataAndOptions = () => {
    const parties = Object.keys(getVotesByParty());
    const partyList = parties.map(index => candidates[index - 1]?.candName);
    console.log(partyList);
 
    const data = {
      labels: partyList,
      datasets: [
        {
          label: 'Votes by Party',
          data: Object.values(getVotesByParty()),
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
 
    const options = {
      scales: {
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              const totalVotes = getTotalVotes();
              const dataIndex = context.dataIndex;
              const value = context.dataset.data[dataIndex];
              const percentage = ((value / totalVotes) * 100).toFixed(2);
              return `${context.dataset.label}: ${value} (${percentage}%)`;
            }
          }
        }
      }
    };
 
    return { data, options };
  }
 
  return (
<div>
<h2>Results</h2>
 
      <h3>
        Percentage of users voted: 
        {
          // Calculate the percentage and round to two decimal places
          (Number((votes.length / voters.length * 100).toFixed(2)))
        } %
</h3>
 
      <p>Total votes: {getTotalVotes()}</p>
<h2>Results by Party</h2>
      {
        Object.entries(getVotesByParty()).map(([partyId, votes]) => (
<p key={partyId}>Party {partyId}: {votes}</p>
        ))
      }
<h2>Results by Province</h2>
      {
        Object.entries(getVotesByProvince()).map(([province, votes]) => (
<p key={province}>{province}: {votes}</p>
        ))
      }
 
 
      <h2>Results by Party (Percentage)</h2>
      {
        Object.entries(getPercentageOfVotesByParty()).map(([partyId, percentage]) => (
<p key={partyId}>Party {partyId}: {percentage.toFixed(2)}%</p>
        ))
      }
 
      <Bar data={getBarChartDataAndOptions().data} options={getBarChartDataAndOptions().options} />
 
      <h2>Results by Party and Province</h2>
      {
        Object.entries(getVotesByPartyAndProvince()).map(([partyId, votesByProvince]) => (
<div key={partyId}>
<h3>Party {partyId}</h3>
            {
              Object.entries(votesByProvince).map(([province, votes]) => (
<p key={province}>{province}: {votes}</p>
              ))
            }
</div>
        ))
      }
 
      <Bar data={getBarChartDataAndOptionsForStacked().data} options={getBarChartDataAndOptionsForStacked().options} />
</div>
  )
}
 
export default ResultsPage