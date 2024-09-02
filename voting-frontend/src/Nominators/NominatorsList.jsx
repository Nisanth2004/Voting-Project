import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../pages/Header";

// Define your S3 base URL here
const S3_BASE_URL = "https://bommanapdi.s3.eu-north-1.amazonaws.com/";

const NominatorsList = () => {
    const [nominators, setNominators] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("http://localhost:8080/api/nominator")
            .then(response => {
                setNominators(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("There was an error fetching the nominators!", error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="text-center mt-5 text-xl font-semibold">Loading...</div>;
    }

    if (nominators.length === 0) {
        return <div className="text-center mt-5 text-xl font-semibold">No Nominators Found</div>;
    }

    return (
        <div>
            <Header />
            <div className="container mx-auto mt-10 px-4">
                <h2 className="text-3xl font-bold text-center mb-8">Nominators List</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {nominators.map(nominator => {
                      
                        const photoUrl = `${S3_BASE_URL}${nominator.photoImagePath}`;
                        const nativityUrl = `${S3_BASE_URL}${nominator.nativityImagePath}`;

                        return (
                            <div key={nominator.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                <img 
                                    src={photoUrl} 
                                    alt={`${nominator.name}'s photo`} 
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-4">
                                    <h5 className="text-xl font-semibold mb-2">{nominator.name}</h5>
                                    <p className="text-gray-700">
                                        <strong>Email:</strong> {nominator.email}<br/>
                                        <strong>Age:</strong> {nominator.age}
                                    </p>
                                    <a 
                                        href={`/nominator/${nominator.id}`} 
                                        className="inline-block px-4 py-2 mt-3 bg-blue-500 text-white text-sm rounded-lg shadow hover:bg-blue-600 transition-transform transform hover:scale-105"
                                    >
                                        View Details
                                    </a>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default NominatorsList;
