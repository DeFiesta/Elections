import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

const Candidates = ({ candidates, provider, account, voting}) => {
	const [fetchedCandidates, setFetchedCandidates] = useState([]);




	const fetchCandidates = async () => {
	if (!voting) return;

	try {
	  const [candidateAddresses, candidateNames, candidateIds, candidateVoteCounts] = await voting.getAllCandidates();
	  const candidateList = [];

	  for (let i = 0; i < candidateIds.length; i++) {
	    candidateList.push({
	      id: candidateIds[i].toNumber(),
	      name: candidateNames[i],
	      address: candidateAddresses[i],
	      voteCount: candidateVoteCounts[i].toNumber()
	    });
	  }

	  setFetchedCandidates(candidateList);
	} catch (error) {
	  console.error("Error fetching candidates:", error);
	}
	};

	useEffect(() => {
		fetchCandidates();
	}, [voting]);


	return (
	<div className="message.content">
		<h1>List of Candidates</h1>
		<ul>
			{fetchedCandidates.map((candidate) => (
			  <li key={candidate.id}>
			    {candidate.name} ({candidate.voteCount} votes)
			  </li>
			))}
		</ul>
	</div>
	);
};

export default Candidates;
