import React from 'react';
import {getClient} from "@/apollo-client"
import fetchWeatherQuery from '@/graphql/queries/fetchWeatherQueries';
import CalloutCard from '@/components/CalloutCard';
import StartCard from '@/components/StartCard';
import InformationPanel from '@/components/InformationPanel';
import TempChart from '@/components/TempChart';
import RainChart from '@/components/RainChart';
import HumidityChart from '@/components/HumidityChart';
import cleanData from '@/lib/cleanData'
import getBasePath from '@/lib/getBasePath'

export const revalidate = 1440;

type Props= {
    params:{
        city: string;
        lat: string;
        long: string;
    }
}
export default async function WeatherPage({params:{city, lat, long}}: Props) {
    const client= getClient();

    const {data}= await client.query({
        query: fetchWeatherQuery,
        variables:{
            current_weather: "true",
            longitude: long,
            latitude: lat,
            timezone:'GMT'
        }
    })

    const results: Root = data.myQuery;

    //data to send to gpt 
    const dataToSend= cleanData(results, city);
     const res = await fetch(`${getBasePath()}/api/getWeatherSummary`,{
        method: 'POST',
        headers:{
            'Content-Type':"application/json"
        },
        body: JSON.stringify({
            weatherData: dataToSend
        })
     })

     const GPTdata= await res.json();

     const {content}= GPTdata
    //console.log(results.hourly.time);
  return (
    <div className='flex flex-col min-h-screen md:flex-row'>
        {/* info panel */}
        <InformationPanel 
        city={city} 
        results={results}
        lat={lat}
        long={long}
        />
        <div className='flex-1 p-5 lg:p-10'>
            <div className='p-5'>
                <div className='pb-5'>
                    <h2 className='text-xl font-bold'>Today's Overview</h2>
                    <p className='text-sn text-gray-400'>
                        Last updated at : { new Date(results.current_weather.time).toLocaleString()} 
                    ({results.timezone})</p>
                </div>

                <div className='m-2 mb-10'>
                    {/* callout card */}
                    <CalloutCard 
                    message={content}
                    />
                </div>

                <div className='grid grid-cols-1 xl:grid-cols-2 gap-5'>
                    <StartCard 
                    title='Maximum Temperature'
                    metric={`${results.daily.temperature_2m_max[0].toFixed(1)}°`}
                    color="yellow"
                    />

<StartCard 
                    title='Minimum Temperature'
                    metric={`${results.daily.temperature_2m_min[0].toFixed(1)}°`}
                    color="green"
                    />

                    <div >
                    <StartCard 
                    title='UV Index'
                    metric={`${results.daily.uv_index_max[0].toFixed(1)}`}
                    color="red"
                    />

                    {Number(results.daily.uv_index_max[0].toFixed(1))> 5 && (
                         <CalloutCard 
                         message={"The UV is high today, be sure to wear SPF!"}
                         warning
                         />
                    )}
                    </div>

                    <div className='flex space-x-3'>
                    <StartCard 
                    title='Wind Speed'
                    metric={`${results.current_weather.windspeed.toFixed(1)}m/s`}
                    color="cyan"
                    />

<StartCard 
                    title='Wind Direction'
                    metric={`${results.current_weather.winddirection.toFixed(1)}°`}
                    color="violet"
                    />
                    </div>
                </div>
            </div>
            <hr className="mb-5" />

            <div className="space-y-3">
                {/* Temp Charts */}
                <TempChart results={results}/>
                 {/* Rain Charts */}
                 <RainChart results={results}/>
                  {/* Humidity Charts */}
                  <HumidityChart results={results}/>

            </div>
        </div>
    
    </div>
  );
}
