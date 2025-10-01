/* This component is used to display a list of events in the event browsing app.
This page should display the full list of events in the app. It should take the event data 
from the shared context and render each event as a card or row, usually by mapping over the events 
array and passing each item into the EventItem component. The list should update automatically whenever new 
events are added, removed, or updated. If there are no events, the page should show a simple message 
like “No events found.”*/

/**
 * Purpose: Describe what this file does in one line.
 *
 * Common references:
 * - Actions (like/RSVP): src/context/EventsContext.tsx
 * - Buttons: src/components/LikeButton.tsx, src/components/RSVPButton.tsx
 * - Event card: src/components/EventItem.tsx
 * - Pages: src/pages/EventList.tsx, src/pages/EventDetail.tsx, src/pages/CreateEvent.tsx
 * - Filters: src/components/Filters.tsx, src/components/SearchBar.tsx
 * - Routing: src/App.tsx
 *
 * Hint: If you need like or RSVP functionality, import from EventsContext
 * and/or reuse LikeButton or RSVPButton components.
 */



// Aaron this page is assigned to you.
import React from 'react';
import {Event}from '../types/Event';
import { Link } from 'react-router-dom';

interface EventListProps {
   events: Event[];
}

const EventList: React.FC<EventListProps>= ({events})=>{
    if (events.length===0)
    {
        return(
            <div className = "text-center py-12">
                <p className = "text-lg text-gray-600">No events found.</p>
            </div>
        );
    }
    return(
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            
            {events.map((event)=>(
                <EventItemTemp key ={event.id} event = {event}/> 
            ))}  
        </div>
    );
    };
    

    const EventItemTemp: React.FC<{event: Event}> = 
    ({event})=>
        {
        return (
            <Link
                to = {`/events/${event.id}`}
                className = "border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow bg-white">
                {event.imageUrl&&(
                    <img
                        src={event.imageUrl}
                        alt={event.title}
                        className = "w-full h-48 object-cover rounded-md mb-3"
                        />
                
                )}
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h3>
                <p className = "text-sm text-gray-600 mb-2">
                    {new Date(event.startDate).toLocaleDateString()}at{' '}
                    {new Date(event.startDate).toLocaleTimeString([],{
                            hour:'2-digit',
                            minute:'2-digit',
                        })}
                        </p>
                        <p className="text-sm text-gray-600 mb-3">{event.location}</p>
                        <p className = "text-sm text-gray-700 line-clamp-2 mb-3">
                            {event.description}
                        </p>
                        <div className = "flex items-center gap-3 text-sm text-gray-600">
                            <span>❤️ {event.likes}</span>
                            <span>👤{Array.isArray(event.rsvps)? event.rsvps.length: event.rsvps}</span>
                            <span className = "ml-auto px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs">
                                {event.category}
                                </span>
                                </div>
                                </Link>
        );
    };
    export default EventList;