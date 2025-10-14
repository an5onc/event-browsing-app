import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEvents } from '../context/EventsContext';
import { Event } from '../types/Event';
import EventPreviewBanner from "../components/EventPreviewBanner";
import Popup from "../components/Popup";
import InviteUserSearch from "../components/InviteUserSearch";


// Reuse the same category list as the create form.  This avoids
// duplication and ensures consistency between pages.  In a more
// sophisticated app categories might come from the server or user
// configuration.
const AVAILABLE_CATEGORIES = ["Music", "Tech", "Art", "Sports", "Food", "Community", "Other"];

/**
 * Page for editing an existing event.  It loads the current event
 * data into local state, allows the user to modify the fields and
 * persists the changes back to the EventsContext.  If the event
 * cannot be found (e.g. due to an invalid ID) a simple message is
 * shown.
 */
interface User {
  id: string;
  name: string;
}

const EditEventPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { events, updateEvent } = useEvents();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState<Event | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [invitedUsers, setInvitedUsers] = useState<User[]>([]);


  useEffect(() => {
  const found = events.find((e) => e.id === id);
  if (found) {
    setEventData(found);
    if (found.isPrivate && found.invitedUserIds) {
      setInvitedUsers(found.invitedUserIds.map((id) => ({ id, name: `User ${id}` })));
    }
  }
}, [id, events]);


  if (!eventData) {
    return <p className="text-center mt-8">Event not found.</p>;
  }

  const handleChange = <K extends keyof Event>(key: K, value: Event[K]) => {
    setEventData((prev) => (prev ? { ...prev, [key]: value } : prev));
  };
  const handleCategoryChange = (e: ChangeEvent<HTMLInputElement>) => {
      const categoryValue = e.target.value;
      setEventData((prev) => {
        if (!prev) return prev;
        const updatedCategories = e.target.checked
          ? [...(prev.categories || []), categoryValue]
          : (prev.categories || []).filter((cat) => cat !== categoryValue);
        return { ...prev, categories: updatedCategories };
      });
    };

    const handleTogglePrivate = (e: ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setEventData((prev) => (prev ? { ...prev, isPrivate: checked } : prev));
    if (!checked) setInvitedUsers([]);
  };

  const handleInviteUser = (user: User) => {
    setInvitedUsers((prev) => {
      if (prev.some((u) => u.id === user.id)) return prev;
      return [...prev, user];
    });
  };


  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setEventData((prev) =>
        prev ? { ...prev, imageUrl: URL.createObjectURL(file) } : prev
      );
    }
  };
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (
      !eventData.title ||
      !eventData.description ||
      !eventData.startDate ||
      !eventData.location ||
      !eventData.categories?.length
    ) {
      setError("Please fill out all required fields, including at least one category.");
      return;
    }

    if (eventData.isPrivate && invitedUsers.length === 0) {
      setError("A private event must have at least one invited user.");
      return;
    }

    const updated = {
      ...eventData,
      invitedUserIds: invitedUsers.map((u) => u.id),
    };

    updateEvent(updated);
    navigate(`/events/${eventData.id}`);
  };

  

  return (
    <section className="bg-gradient-to-b from-brand-blue via-brand-blue to-brand-bluegrey/10 pt-16 pb-12 min-h-screen">
      <div className="mx-auto max-w-3xl px-4">
        <div className="bg-white rounded-lg border border-brand-light shadow-md">
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4 text-brand-blue">Edit Event</h1>

            <EventPreviewBanner
              title={eventData.title}
              date={eventData.startDate}
              location={eventData.location}
              imageUrl={eventData.imageUrl ?? ""}
            />

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              {error && (
                <div className="text-red-500 bg-red-100 p-3 rounded">{error}</div>
              )}

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  value={eventData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={eventData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              {/* Date & Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={eventData.startDate}
                  onChange={(e) => handleChange("startDate", e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  value={eventData.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              {/* Private Event */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPrivate"
                  checked={!!eventData.isPrivate}
                  onChange={handleTogglePrivate}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
                <label htmlFor="isPrivate" className="ml-2 text-sm text-gray-700">
                  Is this a Private Event?
                </label>
              </div>

              {/* Invite Users */}
              {eventData.isPrivate && (
                <div className="bg-yellow-50 p-4 border-l-4 border-yellow-400">
                  <h4 className="text-sm font-semibold text-yellow-800 mb-2">
                    Private Event Invitation
                  </h4>
                  <button
                    type="button"
                    onClick={() => setIsPopupOpen(true)}
                    className="w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    {invitedUsers.length > 0
                      ? `Manage ${invitedUsers.length} Invited Users`
                      : "Invite Users"}
                  </button>
                </div>
              )}

              {/* RSVP */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rsvp"
                  checked={!!eventData.rsvpRequired}
                  onChange={(e) => handleChange("rsvpRequired", e.target.checked)}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
                <label htmlFor="rsvp" className="ml-2 text-sm text-gray-700">
                  RSVP Required?
                </label>
              </div>

              {/* Price Toggle */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price
                </label>
                <input
                  type="number"
                  value={eventData.price ?? 0}
                  onChange={(e) =>
                    handleChange("price", parseInt(e.target.value) || 0)
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              {/* Categories */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categories (Select one or more)
                </label>
                <div className="flex flex-wrap gap-4 p-3 border border-gray-300 rounded-md">
                  {AVAILABLE_CATEGORIES.map((cat) => (
                    <div key={cat} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`cat-${cat}`}
                        value={cat}
                        checked={eventData.categories?.includes(cat) || false}
                        onChange={handleCategoryChange}
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                      <label htmlFor={`cat-${cat}`} className="ml-2 text-sm text-gray-700">
                        {cat}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Banner Image (Optional)
                </label>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/gif"
                  onChange={handleImageChange}
                  className="mt-1 block w-full text-sm text-gray-500 file:bg-indigo-100 file:text-indigo-700 file:rounded-md"
                />
              </div>

              {/* Capacity */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Capacity (Optional)
                </label>
                <input
                  type="number"
                  value={eventData.capacity ?? ""}
                  onChange={(e) =>
                    handleChange(
                      "capacity",
                      e.target.value === ""
                        ? undefined
                        : Number(e.target.value)
                    )
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-2 px-4 bg-brand-gold text-brand-blue rounded-md hover:bg-brand-honeycomb"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      </div>

      {isPopupOpen && (
        <Popup onClose={() => setIsPopupOpen(false)}>
          <InviteUserSearch
            onInvite={handleInviteUser}
            invitedUsers={invitedUsers}
          />
        </Popup>
      )}
    </section>
  );
};

export default EditEventPage;
    