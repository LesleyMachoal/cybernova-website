import { EventModel } from '../models/eventModel.js';

export const getEvents = async (req, res) => {
  try {
    const events = await EventModel.getEvents();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch events', error: err.message });
  }
};

export const createEvent = async (req, res) => {
  try {
    const { title, date, time, location, description, link, status } = req.body;
    if (!title || !date) {
      return res.status(400).json({ message: 'Title and date are required' });
    }

    const event = await EventModel.createEvent({
      title,
      date,
      time: time || '',
      location: location || '',
      description: description || '',
      link: link || '',
      status: status || 'upcoming',
    });

    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create event', error: err.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, date, time, location, description, link, status } = req.body;

    const event = await EventModel.updateEvent(id, {
      title,
      date,
      time,
      location,
      description,
      link,
      status,
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update event', error: err.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    await EventModel.deleteEvent(id);
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete event', error: err.message });
  }
};
