import { useEffect, useState } from "react";
import { api } from "../lib/api";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    name: "",
    description: "",
    start_at: "",
    end_at: "",
    venue_id: "",
  });

  const loadEvents = async () => {
    const data = await api.listEvents();
    setEvents(data);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    await api.createEvent(newEvent);
    setNewEvent({ name: "", description: "", start_at: "", end_at: "", venue_id: "" });
    loadEvents();
  };

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-4">Events</h2>

      <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-6">
        <input
          type="text"
          placeholder="Name"
          value={newEvent.name}
          onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
          className="border p-2 rounded-md"
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={newEvent.description}
          onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
          className="border p-2 rounded-md"
        />
        <input
          type="text"
          placeholder="Venue ID"
          value={newEvent.venue_id}
          onChange={(e) => setNewEvent({ ...newEvent, venue_id: e.target.value })}
          className="border p-2 rounded-md"
          required
        />
        <input
          type="datetime-local"
          value={newEvent.start_at}
          onChange={(e) => setNewEvent({ ...newEvent, start_at: e.target.value })}
          className="border p-2 rounded-md"
          required
        />
        <input
          type="datetime-local"
          value={newEvent.end_at}
          onChange={(e) => setNewEvent({ ...newEvent, end_at: e.target.value })}
          className="border p-2 rounded-md"
          required
        />
        <button className="bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700">
          Add Event
        </button>
      </form>

      <table className="w-full bg-white rounded-xl shadow text-sm">
        <thead className="border-b bg-gray-50">
          <tr className="text-left text-gray-600">
            <th className="p-2">Name</th>
            <th>Description</th>
            <th>Start</th>
            <th>End</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {events.map((e) => (
            <tr key={e.event_id} className="border-b hover:bg-gray-50">
              <td className="p-2">{e.name}</td>
              <td>{e.description}</td>
              <td>{new Date(e.start_at).toLocaleString()}</td>
              <td>{new Date(e.end_at).toLocaleString()}</td>
              <td>{e.is_published ? "Published" : "Draft"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Events;
